import pool from './pool.js';

const getMainGenres = async () => {
  console.log('2');
  const sql = `
  SELECT * FROM genres
  WHERE is_main = 1
  `;
  const genres = await pool.query(sql)[0];
  return genres;
};

export default {
  getMainGenres,
}