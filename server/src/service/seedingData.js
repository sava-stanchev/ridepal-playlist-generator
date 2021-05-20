import fetch from 'node-fetch';
import mariadb from 'mariadb';


const HOST = 'localhost';
const DBPORT = 3306;
const USER = 'root';
const PASSWORD = 'Pr0t0dqk0n';
const DATABASE = 'rpg';
const NB_ARTISTS = 2000;
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

/** Take all genres from Deezer */
const allGenresSeeding = async () => {
  try {
    let genres = [];
    for (let i = 1; i < 2000; i++) {
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


/** Set 1000 artist */
const artistsSeeding = async () => {
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

artistsSeeding();

// /** Set 1000 artist */
// const artistsSeeding = async () => {
//   try {
//     const result = await pool.query(`SELECT genres_id FROM genres WHERE is_main = 1`);
//     const mainGenres = result.reduce((acc, data) => data.hasOwnProperty('genres_id')?[...acc, data.genres_id]:acc, []);
//     console.log(mainGenres);

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

// artistsSeeding();

const albumsSeeding = async () => {
  try {
    const albums = [];
    for (let i = 1; i < NB_ALBUMS; i++) {
      const response = await fetch(`https://api.deezer.com/album/${ALBUMS_START_POINT+i}`);
      albums[i-1] = await response.json();
    }

    // console.log(albums);
    const req = await Promise.all(albums.map(async (album) => {
      const artistId = album.artist.id;

      const isArtistExist = async (id) => {
        const sql= `
        SELECT * FROM artists
        WHERE artists_id = ?
        `;
        const result = await pool.query(sql, [artistId])[0];
        return result?true:false;
      };

      if (isArtistExist(artistId)) {
        const sql = `
        INSERT INTO albums (albums_id, album_title, genre, artist)
        VALUES (?, ?, ?, ?)
        `;
        const result = await pool.query(sql,
            [album.id, album.title, album.genre_id, artistId]);
      }
    }));
  } catch (error) {
    console.log(error);
  }
};


const isArtistExist = async (id) => {
  const sql= `
  SELECT * FROM artists
  WHERE artists_id = ?
  `;
  const result = await pool.query(sql, [id])[0];
  if (result === 'undefined') {
    return false;
  }
  return true;
};

const isAlbumExist = async (id) => {
  const sql= `
  SELECT * FROM albums
  WHERE albums_id = ?
  `;
  const result = await pool.query(sql, [id])[0];
  if (result === 'undefined') {
    return false;
  }
  return true;
};


// /**
//  * Set single artist
//  * @param {object} data
//  */
// const singleArtistSeeding = async (data) => {
//   try {
//     const sql = `
//     INSERT INTO artists (artists_id, artist_name)
//     VALUES (?, ?)
//     `;
//     const result = await pool.query(sql, [data.id, data.name]);
//     return result;
//   } catch (error) {
//     console.log(error);
//   }
// };


// /**
//  * Set single album
//  * @param {number} id
//  */
// const singleAlbumSeeding = async (data) => {
//   try {
//     const sql = `
//       INSERT INTO albums (albums_id, album_title, genre, artist)
//       VALUES (?, ?, ?, ?)
//       `;
//     const result = await pool.query(sql,
//         [data.id, data.title, data.genre_id, data.artist.id]);
//     const newAlbum = await pool.query (`SELECT * FROM albums WHERE albums_id = ${result.insertId}`)[0];
//     return newAlbum;
//   } catch (error) {
//     console.log(error);
//   }
// };


const tracksSeeding = async () => {
  try {
    const notFilteredTracks = [];
    for (let i = 1; i < NB_TRACKS; i++) {
      const response = await fetch(`https://api.deezer.com/track/${TRACKS_START_POINT+i}`);
      notFilteredTracks[i-1] = await response.json();
    }
    const tracks = notFilteredTracks
        .filter(track => track.hasOwnProperty('id'));
    //console.log(tracks);

    const req = await Promise.all(tracks.map(async (track) => {
      // console.log(track);
      const artistId = track.artist.id;
      const albumId = track.album.id;
      const album = await fetch(`https://api.deezer.com/album/${albumId}`);
      

      const trackSql = `
      INSERT INTO tracks (tracks_id, track_title, duration, rank, release_date, artist)
      VALUES (?, ?, ?, ?, ?, ?)
      `;
      const trackResult = await pool.query(trackSql,
          [track.id, track.title, track.duration, track.rank, track.release_date, track.artist.id]);
      console.log('231');

      const mapSql = `
      INSERT INTO album_track_map (album, track)
      VALUES (?, ?)
      `;
      const mapResult = await pool.query(mapSql,
          [album.genre_id, track.id]);
    }));
    return true;
  } catch (error) {
    console.log(error);
  }
};

// allGenresSeeding();
// mainGenres(); // working
// genreSeeding(); // working
// singleArtistSeeding(1); // working
// singleGenreSeeding(132); // working
// 
// artistsSeeding(); // working
// albumsSeeding();
// tracksSeeding();

