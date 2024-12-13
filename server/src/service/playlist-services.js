import tracksData from "../data/tracks.js";
import playlistData from "../data/playlists.js";
import genresData from "../data/genres.js";

export const playlistGenerator = async (req) => {
  const { duration, playlistName, genres, repeatArtist } = req.body;
  const userId = req.user.id;

  const getGenresDuration = () => {
    return genres.map((genre) =>
      genre.duration === 0
        ? genre
        : { ...genre, duration: Math.round((duration * genre.duration) / 100) }
    );
  };

  const getGenresName = () => {
    return Object.values(
      genres
        .map((genre) =>
          genre.duration === 0
            ? { ...genre, duration: null }
            : { ...genre, duration: genre.name }
        )
        .reduce((acc, genre) => {
          acc[genre.name] = genre.duration;
          return acc;
        }, {})
    );
  };

  const genresDuration = getGenresDuration();
  const genresName = getGenresName();

  const fetchTracks = async () => {
    const fetchTracksFunc = repeatArtist
      ? tracksData.getTracks
      : tracksData.getTracksNotRepArtists;
    const tracks = await fetchTracksFunc(genresName);
    return tracks.filter((track) => track.hasOwnProperty("id"));
  };

  const tracksAll = await fetchTracks();

  const generateTracksList = (tracks, genresDuration) => {
    return genresDuration.map((genre) => {
      const tracksFiltered = tracks.filter(
        (track) => track.genre.toLowerCase() === genre.name
      );
      let totalDuration = 0;
      let temp = new Set();
      let tracksSubset = [];

      while (totalDuration < genre.duration) {
        const track = tracksFiltered.pop();
        if (track) {
          temp.add(track);
          tracksSubset = [...temp];
          totalDuration = tracksSubset.reduce((acc, t) => acc + t.duration, 0);
          tracksFiltered = tracksFiltered.filter(
            (track) => track.duration < genre.duration * 1.05 - totalDuration
          );
        }
      }
      return tracksSubset;
    });
  };

  const tracksList = generateTracksList(tracksAll, genresDuration).flat();
  const playlistDuration = tracksList.reduce(
    (acc, track) => acc + track.duration,
    0
  );
  const averagePlaylistRank = Math.round(
    tracksList.reduce((acc, track) => acc + track.rank, 0) / tracksList.length
  );

  const playlistDataObject = {
    name: playlistName,
    duration: playlistDuration,
    user: userId,
    rank: averagePlaylistRank,
  };

  const newPlaylist = await playlistData.setPlaylist(playlistDataObject);

  const addTracksToPlaylist = async () => {
    await Promise.all(
      tracksList.map((track) =>
        playlistData.addTrackToPlaylist(
          newPlaylist.id,
          track.id,
          track.deezer_id
        )
      )
    );
  };

  await addTracksToPlaylist();

  const addGenresToPlaylist = async () => {
    await Promise.all(
      genres.map(async (genre) => {
        if (genre.duration !== 0) {
          const genreId = await genresData.getGenreByName(genre.name);
          await playlistData.addPlaylistToGenre(
            genreId.id,
            genreId.deezer_id,
            newPlaylist.id
          );
        }
      })
    );
  };

  await addGenresToPlaylist();

  return newPlaylist;
};

const updatePlaylist = async (id, data) => {
  const playlist = await playlistData.getPlaylistById(id);

  if (!playlist) {
    return null;
  }

  const updated = { ...playlist, ...data };
  await playlistData.updatePlaylistName(updated);

  return updated;
};

export default {
  updatePlaylist,
  playlistGenerator,
};
