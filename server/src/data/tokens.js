import pool from "./pool.js";

const tokenExists = async (token) => {
  const result = await pool.query(
    "SELECT * FROM tokens AS t WHERE t.token = ?",
    [token]
  );

  return result && result.length > 0;
};

const blacklistToken = async (token) => {
  const sql = `INSERT INTO tokens (token) VALUES (?)`;
  const [result] = await pool.query(sql, [token]);
  return result.affectedRows > 0;
};

export default {
  tokenExists,
  blacklistToken,
};
