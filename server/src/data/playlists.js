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

// const setPlaylistGenreMap = async (playlist, genre) => {
//   const sql = `
//     INSERT INTO playlist_genre_map (playlist, genre)
//     VALUES (?, ?)
//   `;
//   const result = await pool.query(sql, [playlist, genre]);
//   return result;
// };

const addPlaylistToGenre = async (genreId, genreDeezerId, playlistId) => {
  const sql = `
    INSERT INTO genres_has_playlists (genre_id, genre_deezer_id, playlist_id)
    VALUES (?, ?, ?)`;

  return await pool.query(sql, [genreId, genreDeezerId, playlistId]);
};

const getAllPlaylists = async () => {
  return await pool.query(`
    SELECT p.id, p.title, p.created_on, p.playtime, p.user_id, u.username AS created_by, p.rank, g.deezer_id, g.name, p.is_deleted
    FROM playlists p
    JOIN users AS u 
    ON p.user_id = u.id
    JOIN playlist_genre_map AS pgm
    ON p.id = pgm.playlist
    JOIN genres AS g
    ON pgm.genre = g.deezer_id
    WHERE p.is_deleted != 1
    ORDER BY p.rank
  `);
};

const getPlaylistById = async (id) => {
  const sql = `
    SELECT p.playlists_id, p.playlist_name, p.created_on, p.duration, p.created_by as user_id, u.username AS created_by, p.rank, g.deez_genres_id, g.genre, p.is_deleted
    FROM playlists p
    JOIN users AS u 
    ON p.created_by = u.users_id
    JOIN playlist_genre_map AS pgm
    ON p.playlists_id = pgm.playlist
    JOIN genres AS g
    ON pgm.genre = g.deez_genres_id
    WHERE p.playlists_id = ?
  `;
  const result = await pool.query(sql, [id]);
  return result;
};

const getTracksForPlaylistById = async (id) => {
  const sql = `
    SELECT p.playlist_name, t.deez_tracks_id, p.duration, t.tracks_id,
    p.playlists_id, p.rank, t.track_title, a.artist_name, t.duration AS track_duration, al.album_cover AS albumCover
    FROM playlists p
    JOIN users AS u 
    ON p.created_by = u.users_id
    JOIN playlist_track_map AS ptm
    ON p.playlists_id = ptm.playlist
    JOIN tracks AS t
    ON t.deez_tracks_id = ptm.track
    JOIN artists AS a
    ON a.deez_artists_id = t.artist
    JOIN album_track_map AS atm
    ON atm.track = t.deez_tracks_id
    JOIN albums AS al
    ON atm.album = al.deez_albums_id
    WHERE p.playlists_id = ?
  `;
  const result = await pool.query(sql, [id]);
  return result;
};

const getHash = async (hash) => {
  const sql = `
    SELECT * FROM playlists
    WHERE hash = ?
  `;
  const result = await pool.query(sql, [hash]);
  return result[0];
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
  getHash,
  deletePlaylist,
  updatePlaylistName,
  addTrackToPlaylist,
  addPlaylistToGenre,
};
