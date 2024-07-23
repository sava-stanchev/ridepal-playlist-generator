import dotenv from "dotenv";
import mysql from "mysql2";

const config = dotenv.config().parsed;

const pool = mysql.createPool({
  host: config.HOST,
  user: config.USER,
  password: config.PASSWORD,
  database: config.DATABASE,
});

const promisePool = pool.promise();

export default promisePool;
