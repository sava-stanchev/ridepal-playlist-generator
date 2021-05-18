import pool from './pool.js';

const createUser = async (user) => {
  const sqlNewUser = `
    INSERT INTO users (username, password, e_mail, is_admin, is_deleted) 
    VALUES (?, ?, ?, 0, 0)
  `;
  const result = await pool.query(sqlNewUser,
      [user.username, user.password, user.e_mail]);

  const sql = `
    SELECT u.username, u.e_mail,
    FROM users AS u
    WHERE u.users_id = ?
  `;

  const createdUser = (await pool.query(sql, [result.insertId]))[0];
  return createdUser;
};

const validateUser = async ({username, password}) => {
  const userData = await pool.query('SELECT * FROM users u WHERE u.username = ?', [username]);

  if (userData.length === 0) {
    throw new Error('Username does not exist!');
  }

  if (await bcrypt.compare(password, userData[0].password)) {
    return userData[0];
  }

  return null;
};

export default {
  createUser,
  validateUser,
};
