import pool from "./pool.js";

const setPlaylist = async (data) => {
  const { name, duration, rank, user } = data;

  const insertSql = `
    INSERT INTO playlists (title, playtime, \`rank\`, user_id, created_on)
    VALUES (?, ?, ?, ?, NOW())
  `;

  const [insertResult] = await pool.query(insertSql, [
    name,
    duration,
    rank,
    user,
  ]);

  const playlistId = insertResult.insertId;
  const selectSql = `SELECT * FROM playlists WHERE id = ?`;
  const [result] = await pool.query(selectSql, [playlistId]);
  return result[0];
};

const addTrackToPlaylist = async (playlistId, trackId, trackDeezerId) => {
  const sql = `
    INSERT INTO playlists_has_tracks (playlist_id, track_id, track_deezer_id)
    VALUES (?, ?, ?)
  `;

  return await pool.query(sql, [playlistId, trackId, trackDeezerId]);
};

const addPlaylistToGenre = async (genreId, genreDeezerId, playlistId) => {
  const sql = `
    INSERT INTO genres_has_playlists (genre_id, genre_deezer_id, playlist_id)
    VALUES (?, ?, ?)
  `;

  return await pool.query(sql, [genreId, genreDeezerId, playlistId]);
};

const getAllPlaylists = async () => {
  const [rows] = await pool.query(`
    SELECT 
      p.id, 
      p.title, 
      p.created_on, 
      p.playtime, 
      p.user_id,
      u.username AS created_by, 
      p.rank, 
      p.is_deleted,
      GROUP_CONCAT(DISTINCT g.name) AS genres
    FROM playlists p
    JOIN genres_has_playlists gp ON p.id = gp.playlist_id
    JOIN genres g ON gp.genre_id = g.id
    JOIN users u ON p.user_id = u.id
    WHERE p.is_deleted = 0
    GROUP BY p.id
    ORDER BY p.rank
  `);

  return rows;
};

const getPlaylistById = async (id) => {
  const sql = `
    SELECT 
      p.id, 
      p.title, 
      p.created_on, 
      p.playtime, 
      p.user_id,
      u.username AS created_by, 
      p.rank, 
      p.is_deleted,
      COALESCE(GROUP_CONCAT(g.name), '') AS genres
    FROM playlists p
    LEFT JOIN genres_has_playlists gp ON p.id = gp.playlist_id
    LEFT JOIN genres g ON gp.genre_id = g.id
    JOIN users u ON p.user_id = u.id
    WHERE p.id = ?
    GROUP BY p.id
  `;

  const [result] = await pool.query(sql, [id]);
  return result;
};

const getTracksForPlaylistById = async (playlistId) => {
  const sql = `
    SELECT 
      t.id AS track_id, 
      t.title AS track_title,
      t.deezer_id, 
      p.playtime, 
      t.duration, 
      a.name AS artist_name, 
      al.cover, 
      p.rank, 
      p.title, 
      t.preview 
    FROM playlists_has_tracks pht
    JOIN playlists p ON pht.playlist_id = p.id
    JOIN tracks t ON pht.track_id = t.id
    JOIN artists a ON t.artist_id = a.id
    JOIN genres g ON t.genre_id = g.id
    JOIN albums al ON t.album_id = al.id
    WHERE p.id = ?
  `;

  const [rows] = await pool.query(sql, [playlistId]);
  return rows;
};

const deletePlaylist = async (id) => {
  const sql = `UPDATE playlists SET is_deleted = 1 WHERE id = ?`;
  const [result] = await pool.query(sql, [id]);
  if (result.affectedRows === 0) {
    throw new Error("Something went wrong trying to delete playlist");
  }
};

const updatePlaylistName = async (playlist) => {
  const { newPlaylistName } = playlist;
  const playlistId = playlist[0].id;
  const sql = `UPDATE playlists SET title = ? WHERE id = ?`;
  const [result] = await pool.query(sql, [newPlaylistName, playlistId]);
  if (result.affectedRows === 0) {
    throw new Error("Something went wrong trying to update playlist");
  }
};

export default {
  getPlaylistById,
  getTracksForPlaylistById,
  getAllPlaylists,
  setPlaylist,
  deletePlaylist,
  updatePlaylistName,
  addTrackToPlaylist,
  addPlaylistToGenre,
};
