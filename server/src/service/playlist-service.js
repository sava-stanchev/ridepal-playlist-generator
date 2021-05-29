import tracksData from '../data/tracks.js';
import objectHash from 'object-hash';
import playlistData from '../data/playlists.js';
import genresData from '../data/genresData.js';


/**
 *
 * @param {Object} req
 * @return {Array} array of objects
 */

// {
//   playlistName: 'sad',
//   genres: { jazz: '100', rock: 0, blues: 0, disco: 0, pop: 0 },
//   points: { duration: 2397, from: 'sofia', to: 'pernik' },
//   repeatArtist: true
// }

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
            console.log(duration);
            console.log(key);
            return await tracksData.getTracksByGenre(key, duration);
          }
        }));
    // generate view or drop table create name by genre
    const resultFiltered = await result[0].filter(obj => obj.hasOwnProperty('tracks_id'));
    tracks = [...tracks, ...resultFiltered];
    console.log(tracks);

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
                console.log(genreId);
                await playlistData.setPlaylistGenreMap(newPlaylist.playlists_id, genreId.deez_genres_id);
              };
            }
        )
    );
    const genreId = await genresData.getGenreByName(key);
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
