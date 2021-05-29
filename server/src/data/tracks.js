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
  const tracks = await pool.query(`SELECT * FROM temp_table_${genre}`);
  // const dropTable = await pool.query(`drop table temp_table_${genre}`);
  return tracks;
};


/**
 * @param {number} genre
 * @return {object} tracks
 */
 const getTracksByGenreNotRepeatArtist = async ({genre, duration}) => {
  const truncateTable = await pool.query(`truncate temp_not_artist`);
  const sql = `
  CALL select_rand_tracks_not_artist(?, ?)
  `;
  const a = await pool.query(sql, [duration, genre]);
  const tracks = await pool.query(`SELECT * FROM temp_not_artist`);
  truncateTable = await pool.query(`truncate temp_not_artist`);
  return tracks;
};


export default {
  getTracksByGenre,
  getTracksByGenreNotRepeatArtist,
};
