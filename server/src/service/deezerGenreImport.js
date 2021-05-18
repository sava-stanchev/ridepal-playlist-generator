import fetch from 'node-fetch';
import mariadb from 'mariadb';


const PORT = 5555;
const HOST = 'localhost';
const DBPORT = 3306;
const USER = 'root';
const PASSWORD = '';
const DATABASE = 'library';
const PRIVATE_KEY = 'secretkey';
const TOKEN_LIFETIME = 3600;


const pool = mariadb.createPool({
  host: HOST,
  port: DBPORT,
  user: USER,
  password: PASSWORD,
  database: DATABASE,
});

(async () => {
  try {
    const a = await fetch(`https://api.deezer.com/genre/`);
    const aJson = await a.json();
    const b = await Promise.all(
        aJson.data.map(async genre =>{
          console.log('hi');
          console.log(genre.picture);
          console.log(genre.name);
          console.log(genre.id);
          const sql = `
          INSERT INTO genres (genre, pic, z)
              VALUES (?, ?, ?)
          `;
          const r = await pool.query(sql, [genre.name, genre.picture, genre.id]);
          return r;
        }),

    );


    console.log(b);
  } catch (error) {
    console.log(error);
  }
})();
