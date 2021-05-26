import dotenv from 'dotenv';
import mariadb from 'mariadb';

const config = dotenv.config().parsed;

const pool = mariadb.createPool({
  host: config.HOST,
  port: config.DBPORT,
  user: config.USER,
  password: config.PASSWORD,
  database: config.DATABASE,
});

export default pool;
