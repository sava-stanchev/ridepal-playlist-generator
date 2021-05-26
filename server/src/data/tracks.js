//import pool from './pool.js';

import mariadb from 'mariadb';


const HOST = 'localhost';
const DBPORT = 3306;
const USER = 'root';
const PASSWORD = 'Pr0t0dqk0n';
const DATABASE = 'playlist_generator';
const NB_GENRES = 2000;
const TIME = 150;
const NB_ARTISTS = 10;
const NB_ALBUMS = 30;
const NB_TRACKS = 3000;


const pool = mariadb.createPool({
  host: HOST,
  port: DBPORT,
  user: USER,
  password: PASSWORD,
  database: DATABASE,
});


/**
 * @param {number} genre
 * @return {object} tracks
 */
const getTracksByGenre = async ({genre, duration}) => {
  const sql = `
  CALL select_rand_tracks(?, ?)
  `;
  const a = await pool.query(sql, [duration, genre]);
  const tracks = await pool.query(`SELECT * FROM temp`);
  const truncateTable = await pool.query(`truncate temp`);
  console.log(tracks);


  return tracks;
};

// getTracksByGenre({genre: 132, duration: 1000});


/**
 * @param {number} genre
 * @return {object} tracks
 */
 const getTracksByGenreNotRepeatArtist = async ({genre, duration}) => {
  const sql = `
  CALL select_rand_tracks_not_artist(?, ?)
  `;
  const a = await pool.query(sql, [duration, genre]);
  const tracks = await pool.query(`SELECT * FROM temp_not_artist`);
  const truncateTable = await pool.query(`truncate temp_not_artist`);
  console.log(tracks);


  return tracks;
};

// getTracksByGenreNotRepeatArtist({genre:132, duration:1000});

export default {
  getTracksByGenre,
  getTracksByGenreNotRepeatArtist,
};
