import tracksData from '../data/tracks.js';
import objectHash from 'object-hash';
import playlistData from '../data/playlists.js';
import genresData from '../data/genresData.js';


/**
 *
 * @param {Object} req
 * @return {Array} array of objects
 */
const playlistGenerator = async (req) => {
  let tracks = [];
  const from = req.body.points.from;
  const to = req.body.points.to;
  const keys = Object.keys(req.body.genres);
  if (req.body.repeatArtist === true) {
    const result = await Promise.all(
        keys.map( async key => {
          if (req.body.genres[key] !== 0) {
            const duration = Math.round(req.body.points.duration * (req.body.genres[key]/100));
            const genre = await genresData.getGenreByName(key);
            const result = await tracksData.getTracksByGenre(genre.deez_genres_id, duration);
            const resultFiltered = await result.filter(obj => obj.hasOwnProperty('tracks_id'));
            tracks = [...tracks, ...resultFiltered];
          }
        }));
    const playlistDuration = tracks.reduce((acc, t) => acc + t.duration, 0); // result int
    const tracksId = tracks.reduce((acc, t) => acc + t.tracks_id, ''); // result string
    const hash = objectHash(tracksId + req.user.user_id + from.toLowerCase() + to.toLowerCase());
    const is_hashExist = await playlistData.getHash(hash);
    if (is_hashExist !== undefined) {
      return console.log('playlist is repeated');
    }
    const averageRank = Math.round((tracks.reduce((acc, t) => acc + t.rank, 0))/tracks.length);
    const playlistDataObject = {
      name: req.body.playlistName,
      duration: playlistDuration,
      user: req.user.user_id,
      rank: averageRank,
      hash: hash,
    };
    const newPlaylist = await playlistData.setPlaylist(playlistDataObject);
    await Promise.all(
        tracks.map( async track => playlistData.setPlaylistTrackMap(newPlaylist.playlists_id, track.deez_track_id)));
    await Promise.all(
        keys.map(
            async (key) => {
              if (req.body.genres[key] !== 0) {
                const genreId = await genresData.getGenreByName(key);
                await playlistData.setPlaylistGenreMap(newPlaylist.playlists_id, genreId.deez_genres_id);
              };
            }));
    return tracks;
  } else {
    const result = await Promise.all(
        keys.map( async key => {
          if (req.body.genres[key] !== 0) {
            const duration = Math.round(req.body.points.duration * (req.body.genres[key]/100));
            const genre = await genresData.getGenreByName(key);
            const result = await tracksData.getTracksByGenreNotRepeatArtist(genre.deez_genres_id, duration);
            const resultFiltered = await result.filter(obj => obj.hasOwnProperty('tracks_id'));
            tracks = [...tracks, ...resultFiltered];
          }
        }));
    const playlistDuration = tracks.reduce((acc, t) => acc + t.duration, 0); // result int
    const tracksId = tracks.reduce((acc, t) => acc + t.tracks_id, ''); // result string
    const hash = objectHash(tracksId + req.user.user_id + from.toLowerCase() + to.toLowerCase());
    const is_hashExist = await playlistData.getHash(hash);
    if (is_hashExist !== undefined) {
      return console.log('playlist is repeated');
    }
    const averageRank = Math.round((tracks.reduce((acc, t) => acc + t.rank, 0))/tracks.length);
    const playlistDataObject = {
      name: req.body.playlistName,
      duration: playlistDuration,
      user: req.user.user_id,
      rank: averageRank,
      hash: hash,
    };
    const newPlaylist = await playlistData.setPlaylist(playlistDataObject);
    await Promise.all(
        tracks.map( async track => playlistData.setPlaylistTrackMap(newPlaylist.playlists_id, track.deez_track_id)));
    await Promise.all(
        keys.map(
            async (key) => {
              if (req.body.genres[key] !== 0) {
                const genreId = await genresData.getGenreByName(key);
                await playlistData.setPlaylistGenreMap(newPlaylist.playlists_id, genreId.deez_genres_id);
              };
            }));
    return tracks;
  }
};

/**
 *
 * @param {Array} data - array of object{genre:xx, duration:xx}
 * @return {Array} array of objects
 */
const playlistGeneratorNotRepArtist = async (data) => {
  const req = await Promise.all(data.map(obj => tracksData.getTracksByGenreNotRepeatArtist(obj)));
  const tracks = await a.reduce((acc, c)=>[...acc, ...c], []);
  console.log(tracks);
  return tracks;
};


export default {
  playlistGenerator,
  playlistGeneratorNotRepArtist,
};
