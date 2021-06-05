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
const getAllUsers = async () => {
  const sql = `
    SELECT u.users_id, u.username, u.password, u.email, r.role, u.is_deleted
    FROM users AS u
    JOIN roles AS r
    ON u.user_role = r.roles_id
  `;
  const result = await pool.query(sql);
  return result;
};

const getUserById = async (id) => {
  const sql = `
    SELECT u.users_id, u.username, u.password, u.email, r.role, u.is_deleted
    FROM users AS u
    JOIN roles AS r
    ON u.user_role = r.roles_id
    WHERE u.users_id = ?
  `;
  const result = await pool.query(sql, [id]);
  return result;
};

const deleteUser = async (id) => {
  const sql = `
    UPDATE users SET users.is_deleted = 1
    WHERE users.users_id = ?
  `;
  return await pool.query(sql, [id]);
};

/**
 *
 * @param {number} userId
 * @return {Object} user data
 */
const getUserById = async (userId) => {
  const sql = `
  SELECT users_id, username, email, user_role
  FROM users AS u
  WHERE u.users_id = ?
  `;

  const user = await pool.query(sql, [userId]);
  return user[0];
};


/**
 *
 * @param {number} userId
 * @param {string} data
 * @return {Object} user data
 */
const updateUser = async (userId, data) => {
  const sql = `
  UPDATE users AS u
  SET username = ?  
  WHERE u.users_id = ?
  `;

  const result = await pool.query(sql, [data.username, userId]);
  const user = getUserById(userId);
  console.log(result);
  return user;
};


const logout = async (token) => {
  return await pool.query('INSERT INTO tokens (token) VALUES (?)', [token]);
};

export default {
  getUserByName,
  createUser,
  getAllUsers,
  getUserById,
  deleteUser,
  logout,
};
