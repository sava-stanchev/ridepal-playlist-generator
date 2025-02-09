import pool from "./pool.js";

const addToken = async (token) => {
  const sql = `INSERT INTO tokens (token) VALUES (?)`;
  const [result] = await pool.query(sql, [token]);
  if (result.affectedRows === 0) {
    throw new Error("Something went wrong");
  }
};

const getToken = async (token) => {
  const sql = `SELECT * FROM tokens WHERE token = ?`;
  const [result] = await pool.query(sql, [token]);
  return result[0];
};

const removeToken = async (token) => {
  const sql = `DELETE FROM tokens WHERE token = ?`;
  const [result] = await pool.query(sql, [token]);
  if (result.affectedRows === 0) {
    throw new Error("Something went wrong");
  }
};

export default {
  addToken,
  getToken,
  removeToken,
};
