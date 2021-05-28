import pool from './pool.js';


/** set new playlist
 *
 * @param {Object} data
 * @return {Object}
 */
const setPlaylist = async (data) => {
  console.log(data);
  const sql = `
  INSERT INTO playlists (playlist_name, duration, created_by, rank, hash, created_on)
  VALUES (?, ?, ?, ?, ?, NOW())
  `;

  const result = await pool.query(sql, [data.name, data.duration, data.user, data.rank, data.hash]);
  const newPlaylist = await pool.query(`SELECT * FROM playlists WHERE playlists_id = ${result.insertID}`)[0];

  return newPlaylist;
};


export default {
  setPlaylist,
}