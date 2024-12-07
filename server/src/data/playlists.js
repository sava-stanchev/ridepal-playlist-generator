import pool from "./pool.js";

const setPlaylist = async (data) => {
  const sql = [
    "INSERT INTO playlists (title, playtime, `rank`, user_id, created_on)",
    "VALUES (?, ?, ?, ?, NOW())",
  ].join("\n");

  const result = await pool.query(sql, [
    data.name,
    data.duration,
    data.rank,
    data.user,
  ]);

  const resultObject = JSON.parse(JSON.stringify(result));
  const newSql = `SELECT * FROM playlists WHERE id = ?`;
  const newPlaylist = await pool.query(newSql, [resultObject[0].insertId]);
  return newPlaylist[0][0];
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
  const result = await pool.query(`
    SELECT p.id, p.title, p.created_on, p.playtime, p.user_id,
      u.username AS created_by, p.rank, p.is_deleted,
      GROUP_CONCAT(g.name) as genres,
      (SELECT COUNT(*) 
        FROM (SELECT p.id, p.title, p.playtime, p.rank, p.created_on, p.user_id, p.is_deleted, u.username,
        GROUP_CONCAT(g.name) as genres
        FROM playlists p
        JOIN genres_has_playlists as gp ON p.id = gp.playlist_id
        JOIN genres g ON gp.genre_id = g.id
        JOIN users u ON p.user_id = u.id
        GROUP BY p.title
        HAVING p.is_deleted = 0
      ) as temp) as total
    FROM playlists p
    JOIN genres_has_playlists as gp ON p.id = gp.playlist_id
    JOIN genres g ON gp.genre_id = g.id
    JOIN users u ON p.user_id = u.id
    GROUP BY p.title
    HAVING p.is_deleted = 0
    ORDER BY p.rank
  `);

  return result[0];
};

const getPlaylistById = async (id) => {
  const sql = `
    SELECT p.id, p.title, p.created_on, p.playtime, p.user_id,
      u.username AS created_by, p.rank, p.is_deleted,
      GROUP_CONCAT(g.name) as genres
    FROM playlists p
    JOIN genres_has_playlists as gp ON p.id = gp.playlist_id
    JOIN genres g ON gp.genre_id = g.id
    JOIN users u ON p.user_id = u.id
    WHERE p.id = ?
  `;

  const result = await pool.query(sql, [id]);
  return result[0];
};

const getTracksForPlaylistById = async (id) => {
  const sql = `
    SELECT t.id AS track_id, t.title as track_title, t.deezer_id, p.playtime,
    t.duration, a.name AS artist_name, al.cover, p.rank, p.title, t.preview
    FROM playlists_has_tracks pht
    JOIN playlists p ON pht.playlist_id = p.id
    JOIN tracks t ON pht.track_id = t.id
    JOIN artists a ON t.artist_id = a.id
    JOIN genres g ON t.genre_id = g.id
    JOIN albums al ON t.album_id = al.id
    WHERE p.id = ?
  `;

  const result = await pool.query(sql, [id]);
  return result[0];
};

const deletePlaylist = async (id) => {
  const sql = `
    UPDATE playlists SET playlists.is_deleted = 1
    WHERE playlists.id = ?
  `;

  return await pool.query(sql, [id]);
};

const updatePlaylistName = async (playlist) => {
  const { newPlaylistName } = playlist;
  const playlistId = playlist[0].id;

  const sql = `
    UPDATE playlists AS p SET
    p.title = ?
    WHERE p.id = ?
  `;

  return await pool.query(sql, [newPlaylistName, playlistId]);
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
