/* eslint-disable max-len */
import fetch from 'node-fetch';
import mariadb from 'mariadb';


const HOST = 'localhost';
const DBPORT = 3306;
const USER = 'root';
const PASSWORD = 'Pr0t0dqk0n';
const DATABASE = 'rpg';
const NB_GENRES = 2000;
const TIME = 200;
const ARTISTS_BLACKLIST = [5429322, 5475614, 5195381, 6937433];
const ALBUMS_BLACKLIST = [230188352, 14499818, 11713634, 183332312, 179431712, 170480242, 160041702, 217614992, 186174392, 75228792, 7991214, 9854796, 128110722, 184596992, 97645982];
const NB_ARTISTS = 3000;
const NB_ALBUMS = 2000;
const ALBUMS_START_POINT = 82000;
const NB_TRACKS = 3000;
const TRACKS_START_POINT = 999999;


const pool = mariadb.createPool({
  host: HOST,
  port: DBPORT,
  user: USER,
  password: PASSWORD,
  database: DATABASE,
});

/** Get all artists from DB */
const getAllArtists = async () => {
  const sql = `
  SELECT * FROM artists
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


/** Get all genres from DB
 * @return {Array}
 */
const getAllGenres = async () => {
  const sql = `
  SELECT * FROM genres
  `;
  const result = await pool.query(sql);
  const genres = result.filter(data => data.hasOwnProperty('genres_id'));
  return genres;
};

/** Get all albums from DB
 * @return {Array}
 */
const getAllAlbums = async () => {
  const mainGenres = await getMainGenres();
  const mainGenresIndex = mainGenres.map(genre => genre.genres_id);
  const sql = `
  SELECT * FROM albums
  `;
  const result = await pool.query(sql);
  const albums = result.filter(data => data.hasOwnProperty('albums_id')).filter(album => mainGenresIndex.includes(album.genre));
  // console.log(albums);
  return albums;
};



/** Set tracks from Deezer */
const setTracks = async () => {
  // try {
    let timer = 0;
    const albums = await getAllAlbums();
    await Promise.all(
        albums.map(async album => {
          timer +=TIME;
          setTimeout(
              async () => {
                const tracksId = [];
                const response = await fetch(`https://api.deezer.com/album/${album.albums_id}/tracks`);
                const tracks = await response.json();
                await Promise.all(
                    tracks.data.map(async track => {
                      if (!(tracksId.includes(track.id))) {
                        tracksId.push(track.id);
                        const sql = `
                        INSERT INTO tracks (tracks_id, track_title, duration, rank, artist)
                        VALUES (?, ?, ?, ?, ?)
                        `;
                        const res = await pool.query(sql, [track.id, track.title, track.duration, track.rank, track.artist.id]);
                      }
                    }));
              }, timer);
        }));
  // } catch (error) {
  //   console.log(error);
  // }
};

setTracks();

/** Set albums by artist from Deezer*/
const setAlbumByArtist = async () => {
  try {
    let timer = 0;
    const artists = await getAllArtists();

    await Promise.all(
        artists.map(async artist => {
          timer += TIME;
          setTimeout(
              async () => {
                const albumIds = [];
                const response = await fetch(`https://api.deezer.com/artist/${artist.artists_id}/albums`);
                const albums = await response.json();
                await Promise.all(
                    albums.data.map(async album => {
                      if (!(album.genre_id === -1) && !(ALBUMS_BLACKLIST.includes(album.id)) && !(albumIds.includes(album.id))) {
                        albumIds.push(album.id);
                        const sql = `
                        INSERT INTO albums (albums_id, album_title, genre, artist)
                        VALUES (?, ?, ?, ?)
                        `;
                        const res = await pool.query(sql, [album.id, album.title, album.genre_id, artist.artists_id]);
                      }
                    }));
              }, timer);
        }));
  } catch (error) {
    console.log(error);
  }
};
// setAlbumByArtist();


/** Not OK some problems with exceptions */
const setArtistByGenre = async () => {
  try {
    let timer = 0;
    const genres = await getMainGenres();

    await Promise.all(
        genres.map(async genre => {
          timer += TIME;
          setTimeout(
              async () => {
                const artistsIds = [];
                const response = await fetch(`https://api.deezer.com/genre/${genre}/artists`);
                const artists = await response.json();
                await Promise.all(
                    artists.data.map(async artist => {
                      if (!(ARTISTS_BLACKLIST.includes(artist.id)) && !(artistsIds.includes(artist.id))) {
                        artistsIds.push(artist.id);
                        const sql = `
                        INSERT INTO artists (artists_id, artist_name)
                        VALUES (?, ?)
                        `;
                        const res = await pool.query(sql, [artist.id, artist.name]);
                      }
                    }));
              }, timer);
        }));
  } catch (error) {
    console.log(error);
  }
};


/** Set all genres from Deezer */
const allGenresSeeding = async () => {
  try {
    const genres = [];
    for (let i = 1; i < NB_GENRES; i++) {
      const response = await fetch(`https://api.deezer.com/genre/${i}`);
      genres[i-1] = await response.json();
    }
    const req = await Promise.all(genres.map(async (genre) => {
      const sql = `
      INSERT INTO genres (genres_id, genre)
      VALUES (?, ?)
      `;
      const result = await pool.query(sql, [genre.id, genre.name]);
    }));
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
    const resultZero = await pool.query(sqlSetUpdateToZero);

    const sqlSetIsMainToNull = `
      UPDATE genres SET is_main = null
    `;
    const resultNull = await pool.query(sqlSetIsMainToNull);

    const sqlSetUpdateToOne = `
      SET SQL_SAFE_UPDATES = 1;    
    `;
    const resultOne = await pool.query(sqlSetUpdateToOne);

    const result = mainGenres.data.map(async genre => {
      const sql = `
      UPDATE genres SET is_main = 1
      WHERE genres.genres_id = ?
      `;
      const result = await pool.query(sql, [genre.id]);
      return result;
    });
  } catch (error) {
    console.log(error);
  }
};

/** Set number of artist from Deezer */
const setArtists = async () => {
  try {
    const artists = [];
    for (let i = 1; i < NB_ARTISTS; i++) {
      const response = await fetch(`https://api.deezer.com/artist/${i}`);
      artists[i-1] = await response.json();
    }
    const req = await Promise.all(artists.map(async (artist) => {
      const sql = `
      INSERT INTO artists (artists_id, artist_name)
      VALUES (?, ?)
      `;
      const result = await pool.query(sql, [artist.id, artist.name]);
    }));
  } catch (error) {
    console.log(error);
  }
};
// setArtists();
