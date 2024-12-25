import pool from "./pool.js";

const addToken = async (token) => {
  const sql = `INSERT INTO tokens (token) VALUES (?)`;
  const [result] = await pool.query(sql, [token]);
  return result.affectedRows > 0;
};

const getToken = async (token) => {
  const sql = `SELECT * FROM tokens WHERE token = ?`;
  const [result] = await pool.query(sql, [token]);
  return result[0];
};

const removeToken = async (token) => {
  const sql = `DELETE FROM tokens WHERE token = ?`;
  const [result] = await pool.query(sql, [token]);
  return result.affectedRows > 0;
};

export default {
  addToken,
  getToken,
  removeToken,
};
