import tracksData from '../data/tracks.js';
import objectHash from 'object-hash';
import playlistData from '../data/playlists.js';


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
  console.log(req.body);
  let tracks = [];
  const from = req.body.points.from;
  const to = req.body.points.to;
  if (req.body.repeatArtist === true) {
    const keys = Object.keys(req.body.genres);
    const result = await Promise.all(
        keys.map( async key => {
          if (req.body.genres[key] !== 0) {
            const duration = Math.round(req.body.points.duration * (req.body.genres[key]/100));
            console.log(duration);
            const a = await tracksData.getTracksByGenre(key, duration);
            const b = await a.filter(c => c.hasOwnProperty('tracks_id'));
            tracks = [...tracks, ...b];
          }
        }));

    const playlistDuration = tracks.reduce((acc, t) => acc + t.duration, 0); // result int
    const tracksId = tracks.reduce((acc, t) => acc + t.tracks_id, ''); // result string
    const hash = objectHash(tracksId + req.user.user_id + from.toLowerCase() + to.toLowerCase());
    const rank = Math.round((tracks.reduce((acc, t) => acc + t.rank, 0))/tracks.length);
    const plData = {
      name: req.body.playlistName,
      duration: playlistDuration,
      user: req.user.user_id,
      rank: rank,
      hash: hash,
    };
    const newPlaylist = await playlistData.setPlaylist(plData);
    console.log(newPlaylist);

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

// playlistGenerator( [{genre: 132, duration: 1000}, {genre: 116, duration: 2000}]);

export default {
  playlistGenerator,
  playlistGeneratorNotRepArtist,
}