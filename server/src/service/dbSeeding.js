/* eslint-disable max-len */
import fetch from 'node-fetch';
import mariadb from 'mariadb';


const HOST = 'localhost';
const DBPORT = 3306;
const USER = 'root';
const PASSWORD = 'Pr0t0dqk0n';
const DATABASE = 'playlist_generator';
const NB_GENRES = 2000;
const TIME = 150;
// const NB_ARTISTS = 10;
const NB_ALBUMS = 30;
// const NB_TRACKS = 3000;


const pool = mariadb.createPool({
  host: HOST,
  port: DBPORT,
  user: USER,
  password: PASSWORD,
  database: DATABASE,
});

/** Get all artists from DB
 * @return {Array}
 */
const getAllArtists = async () => {
  const sql = `
  SELECT a.artists_id, a.deez_artists_id, ga.genre FROM artists AS a
  LEFT JOIN genre_artist_map AS ga
  ON a.deez_artists_id = ga.artist
  ORDER BY ga.genre
  `;
  const result = await pool.query(sql);
  const artists = result.filter(data => data.hasOwnProperty('artists_id'));
  return artists;
};


/** Get main genres from DB
 * @return {Array}
 */
const getMainGenres = async () => {
  const sql = `
  SELECT * FROM genres
  WHERE is_main = 1
  `;
  const result = await pool.query(sql);
  const genres = result.filter(data => data.hasOwnProperty('genres_id'));
  return genres;
};


// /** Get all genres from DB
//  * @return {Array}
//  */
// const getAllGenres = async () => {
//   const sql = `
//   SELECT * FROM genres
//   `;
//   const result = await pool.query(sql);
//   const genres = result.filter(data => data.hasOwnProperty('genres_id'));
//   return genres;
// };


/** Get all albums from DB
 * @param {number} - number of rows from genre to return
 * @return {Array}
 */
const getNumberOfAlbums = async (n) => {
  const mainGenres = await getMainGenres();
  const mainGenresIndex = mainGenres.map(genre => genre.deez_genres_id);
  const sql = `
      select albums_id, deez_albums_id, artist, genre
      from
      (
      select albums_id, deez_albums_id, artist, genre, 
      (@num:=if(@group=genre, @num +1, if(@group := genre, 1, 1))) row_number
      from albums
      cross join (select @num:=0, @group:=null) c
      order by genre
      ) as x
      where x.row_number <=${n};
  `;
  const result = await pool.query(sql);
  const albums = result.filter(data => data.hasOwnProperty('albums_id'));
  return albums;
};


/** Set tracks from Deezer */
const setTracks = async () => {
  try {
    let timer = 0;
    const tracksId = [];
    const albums = await getNumberOfAlbums(NB_ALBUMS);
    await Promise.all(
        albums.map(async album => {
          timer +=TIME;
          setTimeout(
              async () => {
                const response = await fetch(`https://api.deezer.com/album/${album.deez_albums_id}/tracks`);
                const tracks = await response.json();
                await Promise.all(
                    tracks.data.map(async track => {
                      if (!tracksId.includes(track.id)) {
                        tracksId.push(track.id);
                        const sql = `
                        INSERT INTO tracks (deez_tracks_id, track_title, duration, rank, artist, genre)
                        VALUES (?, ?, ?, ?, ?, ?)
                        `;
                        const res = await pool.query(sql, [track.id, track.title, track.duration, track.rank, album.artist, album.genre]);
                      }
                      const sqlMap = `
                      INSERT INTO album_track_map (album, track)
                      VALUES (?, ?)
                      `;
                      const resMap = await pool.query(sqlMap, [album.deez_albums_id, track.id]);
                    }));
              }, timer);
        }));
  } catch (error) {
    console.log(error);
  }
};


/** Set albums by artist from Deezer*/
const setAlbumByArtist = async () => {
  try {
    let timer = 0;
    const albumIds = [];
    const genres = await getMainGenres();
    const genresId = genres.map(genre => genre.deez_genres_id);
    const artists = await getAllArtists();
    await Promise.all(
        artists.map(async artist => {
          timer += TIME;
          setTimeout(
              async () => {
                const response = await fetch(`https://api.deezer.com/artist/${artist.deez_artists_id}/albums`);
                const resJSON = await response.json();
                const albums = resJSON.data;
                if (albums !== 'undefined') {
                  await Promise.all(
                      albums.map(async (album) => {
                        if (genresId.includes(album.genre_id)) {
                          albumIds.push(album.id);
                          const sql = `
                          INSERT INTO albums (deez_albums_id, album_title, genre, artist)
                          VALUES (?, ?, ?, ?)
                          `;
                          const res = await pool.query(sql, [album.id, album.title, artist.genre, artist.deez_artists_id]);
                        }
                      }));
                }
              }, timer);
        }));
  } catch (error) {
    console.log(error);
  }
};

/** Set artists by genres */
const setArtistByGenre = async () => {
  try {
    let timer = 0;
    const artistsId = [];
    const genres = await getMainGenres();

    const req = await Promise.all(
        genres.map(async (genre) => {
          timer += TIME;
          setTimeout(
              async () => {
                const response = await fetch(`https://api.deezer.com/genre/${genre.deez_genres_id}/artists`);
                const resJSON = await response.json();
                const artists = resJSON.data;
                const req = await Promise.all(
                    artists.map(async (artist) => {
                      if (!(artistsId.includes(artist.id))) {
                        artistsId.push(artist.id);
                        const sql = `
                        INSERT INTO artists (deez_artists_id, artist_name)
                        VALUES (?, ?)
                        `;
                        const res = await pool.query(sql, [artist.id, artist.name]);
                      }
                      const sqlMap = `
                      INSERT INTO genre_artist_map (genre, artist)
                      VALUES (?, ?);
                      `;
                      const resMap = await pool.query(sqlMap, [genre.deez_genres_id, artist.id]);
                    }));
              }, timer);
        }));
  } catch (error) {
    console.log(error);
  }
};


/** Set all genres from Deezer
 * @return {boolean | error} - true if input is successful
 */
const allGenresSeeding = async () => {
  try {
    const responseArr = [];

    for (let i = 0; i < NB_GENRES; i++) {
      const response = await fetch(`https://api.deezer.com/genre/${i}`);
      responseArr[i] = await response.json();
    }
    const genres = responseArr.filter(genre => genre.hasOwnProperty('id'));
    const req = await Promise.all(
        genres.map(async (genre) => {
          if (genre.id !== 'undefined' && genre.name !== 'undefined') {
            const sql = `
            INSERT INTO genres (deez_genres_id, genre)
            VALUES (?, ?)
            `;
            const result = await pool.query(sql, [genre.id, genre.name]);
          }
        }));
    return true;
  } catch (error) {
    console.log(error);
  }
};


/** Set main genres according to Deezer */
const setMainGenres = async () => {
  try {
    const response = await fetch(`https://api.deezer.com/genre/`);
    const mainGenres = await response.json();

    const sqlSetUpdateToZero = `
      SET SQL_SAFE_UPDATES = 0   
    `;
    const resultToZero = await pool.query(sqlSetUpdateToZero);

    const sqlSetIsMainToNull = `
      UPDATE genres SET is_main = null
    `;
    const resultToNull = await pool.query(sqlSetIsMainToNull);

    const sqlSetUpdateToOne = `
      SET SQL_SAFE_UPDATES = 1;    
    `;
    const resultToOne = await pool.query(sqlSetUpdateToOne);

    const result = await Promise.all(
        mainGenres.data.map(async genre => {
          const sql = `
          UPDATE genres SET is_main = 1
          WHERE genres.deez_genres_id = ?
          `;
          const result = await pool.query(sql, [genre.id]);
          return result;
        }));
  } catch (error) {
    console.log(error);
  }
};


// /** Set number of artist from Deezer */
// const setArtists = async () => {
//   try {
//     const artists = [];
//     for (let i = 1; i < NB_ARTISTS; i++) {
//       const response = await fetch(`https://api.deezer.com/artist/${i}`);
//       artists[i-1] = await response.json();
//     }
//     const req = await Promise.all(artists.map(async (artist) => {
//       const sql = `
//       INSERT INTO artists (artists_id, artist_name)
//       VALUES (?, ?)
//       `;
//       const result = await pool.query(sql, [artist.id, artist.name]);
//     }));
//   } catch (error) {
//     console.log(error);
//   }
// };
// // setArtists();
(async ()=>{
  // await allGenresSeeding();
  // await setMainGenres();
  // await setArtistByGenre();
  // await setAlbumByArtist();
  await setTracks();
  setTimeout(() => pool.end(), 100000);
})();
