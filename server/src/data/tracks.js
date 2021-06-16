import pool from './pool.js';

const getTracks = async (genresNameArr) => {
  const rock = genresNameArr[0];
  const pop = genresNameArr[1];
  const rap = genresNameArr[2];

  const sql = `
    SELECT t.id, t.deezer_id, t.title, t.duration, t.rank, t.preview, a.deezer_id AS artist_id, a.name AS artist, g.name AS genre
    FROM tracks AS t
    JOIN genres AS g
    ON g.deezer_id = t.genre_deezer_id
    JOIN artists AS a
    ON a.deezer_id = t.artist_deezer_id
    WHERE g.name = ? OR g.name = ? OR g.name = ?
    ORDER BY rand()
  `;

  const result = await pool.query(sql, [rock, pop, rap]);
  return result;
};

const getTracksNotRepArtists = async (genresNameArr) => {
  const rock = genresNameArr[0];
  const pop = genresNameArr[1];
  const rap = genresNameArr[2];

  const sql = `
    SELECT t.id, t.deezer_id, t.title, t.duration, t.rank, t.preview, a.deezer_id AS artist_id, a.name AS artist, g.name AS genre
    FROM tracks AS t
    JOIN genres AS g
    ON g.deezer_id = t.genre_deezer_id
    JOIN artists AS a
    ON a.deezer_id = t.artist_deezer_id
    WHERE g.name = ? OR g.name = ? OR g.name = ?
    GROUP BY a.deezer_id
    ORDER BY rand()
  `;

  const result = await pool.query(sql, [rock, pop, rap]);
  return result;
};

export default {
  getTracks,
  getTracksNotRepArtists,
};
