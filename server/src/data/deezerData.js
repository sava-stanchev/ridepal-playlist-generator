import pool from './pool.js';

const setGenres = async (data) => {
  console.log('data1');
  console.log(data);
  const result = await Promise.all(
      data.map(async (genre) => {
        const sql = `
          INSERT INTO genres (name, picture, deez_genre_id)
          VALUES (?, ?, ?)
          `;
        const r = await pool.query(sql, genre.name, genre.picture, genre.id);
        return r;
      }),
  );
  console.log('data');
  console.log(result);
};


export default {
  setGenres,
};
