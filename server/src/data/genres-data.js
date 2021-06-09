import pool from './pool.js';

const getMainGenres = async () => {
  const sql = `
    SELECT * FROM genres
    WHERE is_main = 1
  `;
  const genres = await pool.query(sql)[0];
  return genres;
};

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
};
