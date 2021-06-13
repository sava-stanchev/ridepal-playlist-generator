import tracksData from '../data/tracks.js';
import objectHash from 'object-hash';
import playlistData from '../data/playlists.js';
import genresData from '../data/genres-data.js';

export const playlistGenerator = async (req) => {
  const from = req.body.points.from;
  const to = req.body.points.to;
  const duration = req.body.points.duration;
  const playlistName = req.body.playlistName;
  const genresDuration = req.body.genres.map((g) => g.duration === 0? g: {...g, duration: Math.round(duration*g.duration/100)});
  const genresName = req.body.genres.map((g) => g.duration === 0 ? {...g, duration: null} : {...g, duration: g.name})
      .reduce((acc, g) => {
        const a = {[g.name]: g.duration}; return {...acc, ...a};
      }, {});


  let tracksAll = [];

  if (req.body.repeatArtist === false) {
    const result = await tracksData.getTracksNotRepArtists(genresName);
    tracksAll = result.filter((t) => t.hasOwnProperty('tracks_id'));
  } else {
    const result = await tracksData.getTracks(genresName);
    tracksAll = result.filter((t) => t.hasOwnProperty('tracks_id'));
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
        tracksFiltered = tracksFiltered.filter((t) => t.duration < g.duration*1.05 - totalDuration);
      }
      return temp;
    });
    return result;
  };


  const tracksList = generateTracksList(tracksAll, genresDuration).reduce((acc, arr) => [...acc, ...arr], []);
  const tracksId = tracksList.reduce((acc, t) => acc + t.tracks_id, ''); // result string
  const hash = objectHash(tracksId + req.user.user_id + from.toLowerCase() + to.toLowerCase());
  const is_hashExist = await playlistData.getHash(hash);

  if (is_hashExist !== undefined) {
    return console.log('playlist is repeated');
  }

  const playlistDuration = tracksList.reduce((acc, t) => acc+t.duration, 0);
  const averagePlaylistRank = Math.round(tracksList.reduce((acc, t) => acc+t.rank, 0)/tracksList.length);
  const playlistDataObject = {
    name: playlistName,
    duration: playlistDuration,
    user: req.user.user_id,
    rank: averagePlaylistRank,
    hash: hash,
  };
  const newPlaylist = await playlistData.setPlaylist(playlistDataObject);
  await Promise.all(
      tracksList.map(async (track) => playlistData.setPlaylistTrackMap(newPlaylist.playlists_id, track.deez_tracks_id)));
  await Promise.all(
      req.body.genres.map(
          async (g) => {
            if (g.duration !== 0) {
              const genreId = await genresData.getGenreByName(g.name);
              await playlistData.setPlaylistGenreMap(newPlaylist.playlists_id, genreId.deez_genres_id);
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
  const _ = await playlistData.updatePlaylistName(updated);

  return updated;
};

export default {
  updatePlaylist,
  playlistGenerator,
};