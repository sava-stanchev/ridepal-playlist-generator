import pool from './pool.js';

const getGenreByName = async (name) => {
  const sql = `
    SELECT * FROM genres
    WHERE name = ?
  `;
  const result = await pool.query(sql, [name]);
  return result[0];
};

export default {
  getGenreByName,
};
