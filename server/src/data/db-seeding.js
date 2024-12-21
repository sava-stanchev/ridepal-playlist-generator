import fetch from "node-fetch";
import { RateLimit } from "async-sema";
import bcrypt from "bcrypt";
import pool from "./pool.js";

const limit = RateLimit(10);

const fetchFromDeezer = async (url) => {
  try {
    const response = await fetch(url);
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error(`Error fetching from Deezer: ${error.message}`);
    return [];
  }
};

const selectedGenres = ["Pop", "Rock", "Rap/Hip Hop"];
const selectedGenresMap = new Map();
const roles = ["admin", "user"];
const users = [
  {
    username: "Sava94",
    email: "sava94@email.com",
    password: "123456",
  },
];

(async () => {
  try {
    const [genresDB] = await pool.query("SELECT * FROM genres");

    if (!genresDB || genresDB.length === 0) {
      console.log("Seeding genres...");

      await limit();
      const genresDeezer = (
        await fetchFromDeezer("https://api.deezer.com/genre")
      ).filter((genre) => selectedGenres.includes(genre.name));

      await Promise.all(
        genresDeezer.map(({ id, name }) =>
          pool.query(
            `
            INSERT INTO genres (deezer_id, name)
            VALUES (?, ?)
          `,
            [id, name]
          )
        )
      );
    }

    const [artistsDB] = await pool.query("SELECT * FROM artists");

    if (!artistsDB || artistsDB.length === 0) {
      console.log("Seeding artists...");

      const [genres] = await pool.query("SELECT * FROM genres");

      await Promise.all(
        genres.map(async (genre) => {
          await limit();
          const genreArtists = await fetchFromDeezer(
            `https://api.deezer.com/genre/${genre.deezer_id}/artists`
          );

          await Promise.all(
            genreArtists.map(({ id, name, tracklist }) =>
              pool.query(
                `
                INSERT INTO artists (deezer_id, name, tracklist, genre_id, genre_deezer_id)
                VALUES (?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                name = ?
              `,
                [id, name, tracklist, genre.id, genre.deezer_id, name]
              )
            )
          );
        })
      );
    }

    const [albumsDB] = await pool.query("SELECT * FROM albums");

    if (!albumsDB || albumsDB.length === 0) {
      console.log("Seeding albums...");

      const [genres] = await pool.query("SELECT * FROM genres");

      genres.forEach((genre) =>
        selectedGenresMap.set(genre.deezer_id, genre.id)
      );

      const [artists] = await pool.query("SELECT * FROM artists");

      await Promise.all(
        artists.map(async (artist) => {
          await limit();
          const artistAlbums = await fetchFromDeezer(
            `https://api.deezer.com/artist/${artist.deezer_id}/albums?limit=5`
          );

          await Promise.all(
            artistAlbums.map(({ id, title, cover, tracklist, genre_id }) => {
              if (selectedGenresMap.has(genre_id)) {
                pool.query(
                  `
                  INSERT INTO albums (deezer_id, title, cover, tracklist, artist_id, artist_deezer_id, genre_id, genre_deezer_id)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                  ON DUPLICATE KEY UPDATE
                  title = ?
                `,
                  [
                    id,
                    title,
                    cover,
                    tracklist,
                    artist.id,
                    artist.deezer_id,
                    selectedGenresMap.get(genre_id),
                    genre_id,
                    title,
                  ]
                );
              }
            })
          );
        })
      );
    }

    const [tracksDB] = await pool.query("SELECT * FROM tracks");

    if (!tracksDB || tracksDB.length === 0) {
      console.log("Seeding tracks...");

      const [albums] = await pool.query("SELECT * FROM albums");

      await Promise.all(
        albums.map(async (album) => {
          await limit();
          const albumTracks = await fetchFromDeezer(
            `https://api.deezer.com/album/${album.deezer_id}/tracks`
          );

          await Promise.all(
            albumTracks.map(({ id, title, duration, rank, preview }) =>
              pool.query(
                `
                INSERT INTO tracks (deezer_id, title, duration, \`rank\`, preview, album_id, album_deezer_id, artist_id, artist_deezer_id, genre_id, genre_deezer_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                title = ?
              `,
                [
                  id,
                  title,
                  duration,
                  rank,
                  preview,
                  album.id,
                  album.deezer_id,
                  album.artist_id,
                  album.artist_deezer_id,
                  album.genre_id,
                  album.genre_deezer_id,
                  title,
                ]
              )
            )
          );
        })
      );
    }

    const [usersDB] = await pool.query("SELECT * FROM users");

    if (!usersDB || usersDB.length === 0) {
      console.log("Creating admins...");

      await Promise.all(
        users.map(async ({ username, password, email }) =>
          pool.query(
            `
            INSERT INTO users (username, password, email, role_id)
            VALUES (?, ?, ?, ?)
          `,
            [
              username,
              await bcrypt.hash(password, 10),
              email,
              roles.indexOf("admin") + 1,
            ]
          )
        )
      );
    }
  } catch (error) {
    console.error(`Error seeding the database: ${error.message}`);
  } finally {
    pool.end();
  }
})();
