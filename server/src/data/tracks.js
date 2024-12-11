import pool from "./pool.js";

const fetchTracksByGenres = async (
  genres,
  allowMultipleTracksPerArtist = true
) => {
  const placeholders = genres.map(() => "?").join(" OR g.name = ");
  const sql = `
    SELECT 
      t.id, 
      t.deezer_id, 
      t.title, 
      t.duration, 
      t.rank, 
      t.preview,
      a.deezer_id AS artist_id, 
      a.name AS artist, 
      g.name AS genre
    FROM tracks AS t
    JOIN genres AS g ON g.deezer_id = t.genre_deezer_id
    JOIN artists AS a ON a.deezer_id = t.artist_deezer_id
    WHERE g.name = ${placeholders}
    ${allowMultipleTracksPerArtist ? "" : "GROUP BY a.deezer_id"}
    ORDER BY RAND()
  `;

  try {
    const [result] = await pool.query(sql, genres);
    return result;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

const getTracks = async (genres) => {
  return await fetchTracksByGenres(genres, true);
};

const getTracksNotRepArtists = async (genres) => {
  return await fetchTracksByGenres(genres, false);
};

export default {
  getTracks,
  getTracksNotRepArtists,
};
