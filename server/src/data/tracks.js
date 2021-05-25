// import pool from './pool.js';

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
  // console.log(genre);
  // console.log(duration);
  const sql = `
  CALL select_random_tracks_from_genre(?, ?)
  `;
  const a = await pool.query(sql, [genre, duration]);
  const tracks = await pool.query(`SELECT * FROM temp`);
  // const truncateTable = await pool.query(`truncate temp`);

  //console.log(tracks);
  return tracks;
};


export default {
  getTracksByGenre,
};
