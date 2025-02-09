import pool from "./pool.js";

const getUserBy = async (column, value) => {
  const allowedColumns = ["id", "username", "email"];
  if (!allowedColumns.includes(column)) throw new Error("Invalid column name");

  const sql = `
    SELECT u.id, u.username, u.password, u.email, u.role_id 
    FROM users AS u
    WHERE u.${column} = ? 
    AND u.is_deleted = 0
  `;

  const [result] = await pool.query(sql, [value]);
  return result[0] || null;
};

const createUser = async (user) => {
  const sqlNewUser = `
    INSERT INTO users (username, password, email)
    VALUES (?, ?, ?)
  `;

  const [result] = await pool.query(sqlNewUser, [
    user.username,
    user.password,
    user.email,
  ]);

  const sql = `
    SELECT u.username, u.email 
    FROM users AS u 
    WHERE u.id = ?
  `;

  const [createdUser] = await pool.query(sql, [result.insertId]);
  return createdUser[0] || null;
};

const getAllUsers = async () => {
  const sql = `
    SELECT u.id, u.username, u.email, r.role, u.is_deleted 
    FROM users AS u 
    JOIN roles AS r ON u.role_id = r.id 
    WHERE u.is_deleted = 0
  `;

  const [result] = await pool.query(sql);
  return result;
};

const getUserById = async (id) => {
  const sql = `
    SELECT u.id, u.username, u.email, r.role, u.is_deleted, u.role_id 
    FROM users AS u 
    JOIN roles AS r ON u.role_id = r.id 
    WHERE u.id = ?
  `;

  const [user] = await pool.query(sql, [id]);
  return user[0] || null;
};

const deleteUser = async (id) => {
  const sql = `UPDATE users SET is_deleted = 1 WHERE id = ?`;
  const [result] = await pool.query(sql, [id]);
  if (result.affectedRows === 0) {
    throw new Error("Something went wrong trying to delete user");
  }
};

const updateUser = async (user) => {
  const sql = `UPDATE users SET username = ?, email = ? WHERE id = ?`;
  const [result] = await pool.query(sql, [user.username, user.email, user.id]);
  if (result.affectedRows === 0) {
    throw new Error("Something went wrong trying to update user");
  }
};

const changeRole = async (user) => {
  const newRoleId = user.role_id === 2 ? 1 : 2;
  const sql = `
    UPDATE users 
    SET role_id = ? 
    WHERE id = ?
  `;

  const [result] = await pool.query(sql, [newRoleId, user.id]);
  return result.affectedRows > 0;
};

export default {
  getUserBy,
  createUser,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
  changeRole,
};
