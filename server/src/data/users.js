import pool from './pool.js';

const getUserByName = async (username) =>{
  const sql = `
    SELECT * FROM users
    WHERE username = ?
  `;
  const result = await pool.query(sql, [username]);
  return result[0];
};

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

const getAllUsers = async () => {
  const sql = `
    SELECT u.users_id, u.username, u.password, u.email, r.role, u.is_deleted
    FROM users AS u
    JOIN roles AS r
    ON u.user_role = r.roles_id
    WHERE u.is_deleted = 0 OR u.is_deleted IS NULL
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
  const user = await pool.query(sql, [id]);
  return user;
};

const deleteUser = async (id) => {
  const sql = `
    UPDATE users SET users.is_deleted = 1
    WHERE users.users_id = ?
  `;
  return await pool.query(sql, [id]);
};

const updateUser = async (userId, data) => {
  const sql = `
    UPDATE users AS u
    SET username = ?, email = ? 
    WHERE u.users_id = ?
  `;

  await pool.query(sql, [data.username, data.email, userId]);
  const user = await getUserById(userId);
  return user[0];
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
  updateUser,
  logout,
};
