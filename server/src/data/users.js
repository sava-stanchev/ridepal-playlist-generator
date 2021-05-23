// import pool from './pool.js';

import mariadb from 'mariadb';


const HOST = 'localhost';
const DBPORT = 3306;
const USER = 'root';
const PASSWORD = 'Pr0t0dqk0n';
const DATABASE = 'playlist_generator';
const NB_GENRES = 2000;
const TIME = 150;
const NB_ARTISTS = 10;
const NB_ALBUMS = 30;
const NB_TRACKS = 3000;


const pool = mariadb.createPool({
  host: HOST,
  port: DBPORT,
  user: USER,
  password: PASSWORD,
  database: DATABASE,
});

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


const logout = async (token) => {
  return await pool.query('INSERT INTO tokens (token) VALUES (?)', [token]);
};

export default {
  getUserByName,
  createUser,
  logout,
};
