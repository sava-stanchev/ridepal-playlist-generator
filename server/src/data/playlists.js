import pool from './pool.js';


/** set new playlist
 *
 * @param {Object} data
 * @return {Object}
 */
const setPlaylist = async (data) => {
  console.log('sql');
  // console.log(data);
  const sql = `
  INSERT INTO playlists (playlist_name, duration, created_by, rank, hash, created_on)
  VALUES (?, ?, ?, ?, ?, NOW())
  `;

  const result = await pool.query(sql, [data.name, data.duration, data.user, data.rank, data.hash]);
  console.log(result);
  const newSql = `SELECT * FROM playlists WHERE playlists_id = ?`;
  const newPlaylist = await pool.query(newSql, [result.insertId])[0];
  return newPlaylist;
};

const setPlaylistTrackMap = async (data) => {

};

const 


export default {
  getPlaylistById,
  getPlaylistAll,
  setPlaylist,
  setPlaylistTrackMap,
}