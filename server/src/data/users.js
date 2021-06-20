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
    INSERT INTO users (username, password, email)
    VALUES (?, ?, ?)
  `;
  const result = await pool.query(sqlNewUser,
      [user.username, user.password, user.email]);

  const sql = `
    SELECT u.username, u.email
    FROM users AS u
    WHERE u.id = ?
  `;
  const createdUser = (await pool.query(sql, [result.insertId]))[0];
  console.log('tuk');
  console.log(createdUser);
  return createdUser;
};

const getAllUsers = async () => {
  const sql = `
    SELECT u.id, u.username, u.password, u.email, r.role, u.is_deleted
    FROM users AS u
    JOIN roles AS r
    ON u.role_id = r.id
    WHERE u.is_deleted = 0
  `;
  const result = await pool.query(sql);
  return result;
};

const getUserById = async (id) => {
  const sql = `
    SELECT u.id, u.username, u.password, u.email, r.role, u.is_deleted, u.role_id
    FROM users AS u
    JOIN roles AS r
    ON u.role_id = r.id
    WHERE u.id = ?
  `;
  const user = await pool.query(sql, [id]);
  return user;
};

const deleteUser = async (id) => {
  const sql = `
    UPDATE users SET users.is_deleted = 1
    WHERE users.id = ?
  `;
  return await pool.query(sql, [id]);
};

const updateUser = async (id, data) => {
  const sql = `
    UPDATE users AS u
    SET username = ?, email = ? 
    WHERE u.id = ?
  `;

  await pool.query(sql, [data.username, data.email, id]);
  const user = await getUserById(id);
  return user[0];
};

const changeRole = async (id) => {
  const user = await getUserById(id);
  let sql;
  if (user[0].role_id === 2) {
    sql = `
    UPDATE users SET users.role_id = 1
    WHERE users.id = ?
  `;
  } else {
    sql = `
    UPDATE users SET users.role_id = 2
    WHERE users.id = ?
  `;
  }

  return await pool.query(sql, [id]);
};

export default {
  getUserByName,
  createUser,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
  changeRole,
};
