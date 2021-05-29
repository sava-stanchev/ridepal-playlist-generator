import pool from './pool.js';

/**
 *
 * @return {object}
 */
const getMainGenres = async () => {
  console.log('2');
  const sql = `
  SELECT * FROM genres
  WHERE is_main = 1
  `;
  const genres = await pool.query(sql)[0];
  return genres;
};

/**
 *
 * @param {string} name
 * @return {object}
 */
const getGenreByName = async (name) => {
  const sql = `
  SELECT * FROM genres
  WHERE genre = ?
  `;
  const result = await pool.query(sql, [name]);
  return result[0];
};


export default {
  getMainGenres,
  getGenreByName,
}