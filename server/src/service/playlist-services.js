import tracksData from '../data/tracks.js';
import playlistData from '../data/playlists.js';
import genresData from '../data/genres-data.js';

export const playlistGenerator = async (req) => {
  const duration = req.body.points.duration;
  const playlistName = req.body.playlistName;

  const genresDuration = req.body.genres.map((g) => g.duration === 0 ? g : {...g, duration: Math.round(duration * g.duration / 100)});
  const genresName = Object.values(req.body.genres
      .map((g) => g.duration === 0 ? {...g, duration: null} : {...g, duration: g.name})
      .reduce((acc, g) => {
        const a = {[g.name]: g.duration}; return {...acc, ...a};
      }, {}));

  let tracksAll = [];

  if (req.body.repeatArtist === false) {
    const result = await tracksData.getTracksNotRepArtists(genresName);
    tracksAll = result.filter((t) => t.hasOwnProperty('id'));
  } else {
    const result = await tracksData.getTracks(genresName);
    tracksAll = result.filter((t) => t.hasOwnProperty('id'));
  }

  const generateTracksList = (tr, gen) => {
    const result = gen.map((g) => {
      let totalDuration = 0;
      let a = [];
      const temp = new Set;
      let tracksFiltered = tr.filter((t) => t.genre.toLowerCase() === g.name);
      while (totalDuration < g.duration) {
        temp.add(tracksFiltered.pop());
        a = [...temp];
        totalDuration = a.reduce((acc, t) => acc+=t.duration, 0);
        tracksFiltered = tracksFiltered.filter((t) => t.duration < g.duration * 1.05 - totalDuration);
      }
      return temp;
    });
    return result;
  };

  const tracksList = generateTracksList(tracksAll, genresDuration).reduce((acc, arr) => [...acc, ...arr], []);
  const playlistDuration = tracksList.reduce((acc, t) => acc + t.duration, 0);
  const averagePlaylistRank = Math.round(tracksList.reduce((acc, t) => acc + t.rank, 0)/tracksList.length);

  const playlistDataObject = {
    name: playlistName,
    duration: playlistDuration,
    user: req.user.id,
    rank: averagePlaylistRank,
  };

  const newPlaylist = await playlistData.setPlaylist(playlistDataObject);

  await Promise.all(
      tracksList.map(async (track) => playlistData.addTrackToPlaylist(newPlaylist.id, track.id, track.deezer_id)));
  await Promise.all(
      req.body.genres.map(
          async (g) => {
            if (g.duration !== 0) {
              const genreId = await genresData.getGenreByName(g.name);
              await playlistData.addPlaylistToGenre(genreId.id, genreId.deezer_id, newPlaylist.id);
            };
          }));

  return newPlaylist;
};

const updatePlaylist = async (id, data) => {
  const playlist = await playlistData.getPlaylistById(id);

  if (!playlist) {
    return null;
  }

  const updated = {...playlist, ...data};
  await playlistData.updatePlaylistName(updated);

  return updated;
};

export default {
  updatePlaylist,
  playlistGenerator,
};
