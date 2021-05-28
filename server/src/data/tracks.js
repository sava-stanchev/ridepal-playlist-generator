import pool from './pool.js';


/**
 * @param {string} genre
 * @param {number} duration
 * @return {object} tracks
 */
const getTracksByGenre = async (genre, duration) => {
  let truncateTable = await pool.query(`truncate temp`);
  const sql = `
    CALL select_rand_tracks(?, ?)
  `;
  const a = await pool.query(sql, [duration, genre]);
  const tracks = await pool.query(`SELECT * FROM temp`);
  truncateTable = await pool.query(`truncate temp`);
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
