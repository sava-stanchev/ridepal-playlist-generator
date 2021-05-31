import pool from './pool.js';


/**
 * @param {string} genre
 * @param {number} duration
 * @return {object} tracks
 */
const getTracksByGenre = async (genre, duration) => {
  const sql = `
    CALL rand_track(?, ?)
  `;
  const result = await pool.query(sql, [duration, genre]);
  const tracks = await pool.query(`SELECT * FROM temp_table_${genre}`);
  const dropTable = await pool.query(`drop table temp_table_${genre}`);
  return tracks;
};


const getTracks = async ({jazz, rock, blues, disco, pop}) => {
  const sql = `
  select t.tracks_id, t.deez_tracks_id, t.track_title, t.duration, t.rank, a.artist_name as artist, g.genre from tracks as t
  join genres as g
  on g.deez_genres_id = t.genre
  join artists as a
  on a.deez_artists_id = t.artist
  where g.genre = ? or g.genre = ? or g.genre = ? or g.genre = ? or g.genre = ?
  ORDER BY rand()
  `;
  const result = await pool.query(sql, [jazz, rock, blues, disco, pop]);
  return result;
};


/**
 * @param {number} genre
 * @param {number} duration
 * @return {object} tracks
 */
const getTracksByGenreNotRepeatArtist = async (genre, duration) => {
  const sql = `
    CALL rand_track_not_rep_artist(?, ?)
  `;
  const a = await pool.query(sql, [duration, genre]);
  console.log(a);
  const tracks = await pool.query(`SELECT * FROM temp_table_${genre}`);
  const dropTable = await pool.query(`drop table temp_table_${genre}`);
  return tracks;
};


export default {
  getTracksByGenre,
  getTracksByGenreNotRepeatArtist,
  getTracks,
};
