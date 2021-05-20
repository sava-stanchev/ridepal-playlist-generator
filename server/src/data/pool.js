// import dotenv from 'dotenv';
import mariadb from 'mariadb';

// const a = dotenv.config().parsed;
// console.log(a);
// const config = dotenv.config().parsed;
// console.log(config);

// const pool = mariadb.createPool({
//   host: config.HOST,
//   port: config.DBPORT,
//   user: config.USER,
//   password: config.PASSWORD,
//   database: config.DATABASE,
// });

const HOST = 'localhost';
const DBPORT = 3306;
const USER = 'root';
const PASSWORD = 'Pr0t0dqk0n';
const DATABASE = 'rpg';
const NB_ARTISTS = 2000;
const NB_ALBUMS = 2000;
const ALBUMS_START_POINT = 82000;
const NB_TRACKS = 3000;
const TRACKS_START_POINT = 999999;

const pool = mariadb.createPool({
  host: HOST,
  port: DBPORT,
  user: USER,
  password: PASSWORD,
  database: DATABASE,
});

export default pool;
