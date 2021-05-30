import pool from './pool.js';


/** set new playlist
 *
 * @param {Object} data
 * @return {Object}
 */
const setPlaylist = async (data) => {
  const sql = `
  INSERT INTO playlists (playlist_name, duration, created_by, rank, hash, created_on)
  VALUES (?, ?, ?, ?, ?, NOW())
  `;

  const result = await pool.query(sql, [data.name, data.duration, data.user, data.rank, data.hash]);
  const newSql = `SELECT * FROM playlists WHERE playlists_id = ?`;
  const newPlaylist = await pool.query(newSql, [result.insertId]);
  return newPlaylist[0];
};

/**
 * @param {number} playlist
 * @param {number} track
 * @return {object}
 */
const setPlaylistTrackMap = async (playlist, track) => {
  const sql = `
  INSERT INTO playlist_track_map (playlist, track)
  VALUES (?, ?)
  `;
  const result = await pool.query(sql, [playlist, track]);
  return result;
};

/**
 *
 * @param {number} playlist
 * @param {string} genre
 * @return {object}
 */
const setPlaylistGenreMap = async (playlist, genre) => {
  const sql = `
  INSERT INTO playlist_genre_map (playlist, genre)
  VALUES (?, ?)
  `;
  const result = await pool.query(sql, [playlist, genre]);
  return result;
};


const getAllPlaylists = async () => {
  return await pool.query(`
    SELECT * FROM playlists p
  `);
};

const getPlaylistById = async (id) => {

};

/** check is given hash exist in playlist table
 *
 * @param {string} hash
 * @return {object | undefined}
 */
const getHash = async (hash) => {
  const sql = `
    SELECT * FROM playlists
    WHERE hash = ?
  `;
  const result = await pool.query(sql, [hash]);
  return result[0];
};


export default {
  getPlaylistById,
  getAllPlaylists,
  setPlaylist,
  setPlaylistTrackMap,
  setPlaylistGenreMap,
  getHash,
};
