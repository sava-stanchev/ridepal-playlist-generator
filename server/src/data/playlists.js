import pool from './pool.js';

const setPlaylist = async (data) => {
  const sql = `
    INSERT INTO playlists (title, playtime, rank, user_id, created_on)
    VALUES (?, ?, ?, ?, NOW())
  `;

  const result = await pool.query(sql, [data.name, data.duration, data.rank, data.user]);
  const newSql = `SELECT * FROM playlists WHERE id = ?`;
  const newPlaylist = await pool.query(newSql, [result.insertId]);
  return newPlaylist[0];
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
  return await pool.query(`
    SELECT p.id, p.title, p.created_on, p.playtime, p.user_id, u.username AS created_by, p.rank, g.deezer_id, g.name, p.is_deleted
    FROM playlists p
    JOIN users AS u 
    ON p.user_id = u.id
    JOIN genres_has_playlists AS ghp
    ON p.id = ghp.playlist_id
    JOIN genres AS g
    ON ghp.genre_deezer_id = g.deezer_id
    WHERE p.is_deleted != 1
    ORDER BY p.rank
  `);
};

const getPlaylistById = async (id) => {
  const sql = `
    SELECT p.id, p.title, p.created_on, p.playtime, p.user_id, u.username AS created_by, p.rank, g.deezer_id, g.name, p.is_deleted
    FROM playlists p
    JOIN users AS u 
    ON p.user_id = u.id
    JOIN genres_has_playlists AS ghp
    ON p.id = ghp.playlist_id
    JOIN genres AS g
    ON ghp.genre_deezer_id = g.deezer_id
    WHERE p.id = ?
  `;
  const result = await pool.query(sql, [id]);
  return result;
};

const getTracksForPlaylistById = async (id) => {
  const sql = `
    SELECT t.id AS track_id, t.title as track_title, t.deezer_id, p.playtime,
    t.duration, a.name AS artist_name, al.cover, p.rank, p.title
    FROM playlists_has_tracks pht
    JOIN playlists p ON pht.playlist_id = p.id
    JOIN tracks t ON pht.track_id = t.id
    JOIN artists a ON t.artist_id = a.id
    JOIN genres g ON t.genre_id = g.id
    JOIN albums al ON t.album_id = al.id
    WHERE p.id = ?
  `;
  const result = await pool.query(sql, [id]);
  return result;
};

const deletePlaylist = async (id) => {
  const sql = `
    UPDATE playlists SET playlists.is_deleted = 1
    WHERE playlists.playlists_id = ?
  `;
  return await pool.query(sql, [id]);
};

const updatePlaylistName = async (playlist) => {
  const {playlist_name} = playlist;
  const playlistId = playlist[0].playlists_id;

  const sql = `
    UPDATE playlists AS p SET
    p.playlist_name = ?
    WHERE p.playlists_id = ?
  `;

  return await pool.query(sql, [playlist_name, playlistId]);
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
