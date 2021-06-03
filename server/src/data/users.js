import pool from './pool.js';


/**
 *
 * @param {string} username
 * @return {Object | undefined}
 */
const getUserByName = async (username) =>{
  const sql = `
  SELECT * FROM users
  WHERE username = ?
  `;
  const result = await pool.query(sql, [username]);
  return result[0];
};


/**
 *
 * @param {Object} user
 * @return {Object} - created user
 */
const createUser = async (user) => {
  const sqlNewUser = `
    INSERT INTO users (username, password, email, user_role, is_deleted) 
    VALUES (?, ?, ?, 2, null)
  `;
  const result = await pool.query(sqlNewUser,
      [user.username, user.password, user.email]);

  const sql = `
    SELECT u.username, u.email
    FROM users AS u
    WHERE u.users_id = ?
  `;
  const createdUser = (await pool.query(sql, [result.insertId]))[0];
  return createdUser;
};

/**
 *
 * @return {Array} - list of users
 */
const getUsers = async () => {
  const sql = `
  SELECT * FROM users
  `;
  const result = await pool.query(sql);
  return result;
};


const logout = async (token) => {
  return await pool.query('INSERT INTO tokens (token) VALUES (?)', [token]);
};

export default {
  getUserByName,
  createUser,
  getUsers,
  logout,
};
