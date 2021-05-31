import pool from './pool.js';


/**
 * @param {string} genre
 * @param {number} duration
 * @return {object} tracks
 */
const getTracksByGenre = async (genre, duration) => {
  const sql = `
    CALL rand_track(?, ?)
  `;
  const a = await pool.query(sql, [duration, genre]);
  console.log(a);
  const tracks = await pool.query(`SELECT * FROM temp_table_${genre}`);
  const dropTable = await pool.query(`drop table temp_table_${genre}`);
  return tracks;
};


/**
 * @param {number} genre
 * @param {number} duration
 * @return {object} tracks
 */
const getTracksByGenreNotRepeatArtist = async (genre, duration) => {
  const sql = `
    CALL rand_track_not_rep_artist(?, ?)
  `;
  const a = await pool.query(sql, [duration, genre]);
  console.log(a);
  const tracks = await pool.query(`SELECT * FROM temp_table_${genre}`);
  const dropTable = await pool.query(`drop table temp_table_${genre}`);
  return tracks;
};


export default {
  getTracksByGenre,
  getTracksByGenreNotRepeatArtist,
};
