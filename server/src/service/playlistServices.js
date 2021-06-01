import tracksData from '../data/tracks.js';
import objectHash from 'object-hash';
import playlistData from '../data/playlists.js';
import genresData from '../data/genresData.js';


/**
 *
 * @param {Object} req
 * @return {Array} array of objects
 */
export const playlistGenerator = async (req) => {
  const from = req.body.points.from;
  const to = req.body.points.to;
  const duration = req.body.points.duration;
  const playlistName = req.body.playlistName;
  const genresDuration = req.body.genres.map(g => g.duration === 0? g: {...g, duration: Math.round(duration*g.duration/100)});
  const genresName = req.body.genres.map(g => g.duration === 0 ? {...g, duration: null} : {...g, duration: g.name})
      .reduce((acc, g) => {
        const a = {[g.name]: g.duration}; return {...acc, ...a};
      }, {});

  const result = await tracksData.getTracks(genresName);
  let tracksAll = result.filter(t => t.hasOwnProperty('tracks_id'));
  const keys = Object.keys(genresName);


  // console.log(tracksAll[tracksAll.length-1]);
  if (req.body.repeatArtist === false) {
    const temp = [...tracksAll];
    console.log(temp[temp.length-1]);
    console.log(tracksAll[tracksAll.length-1]);
    const artists = [];
    const tempFiltered = temp.reduce((acc, tr) => {
      if (artists.includes(t.deez_artists_id)) {
        return acc;
      }
      artists.push(t.deez_artists_id);
      return [...acc, t];
    });
    tracksAll = [...tempFiltered];
  };
  // console.log(tracksAll);
  // console.log(tracksAll.pop());

  // const temp = [...tracksAll];
  // // console.log(temp);
  // const tempReduced = temp.reduce((acc, t, _, artistsArr = []) => {
  //   if (artistsArr.includes(t.deez_artists_id)) {
  //     return acc;
  //   }
  //   artistsArr.push(t.deez_artists_id);
  //   return [...acc, t];
  // }, []);

  // tracksAll = [...tempReduced];

  const generateTracksList = (tr, gen) => {
    const result = gen.map(g => {
      let totalDuration = 0;
      const temp = [];
      console.log(g.name);
      let tracksFiltered = tr.filter(t => t.genre.toLowerCase() === g.name);
      while (totalDuration < g.duration) {
        temp.push(tracksFiltered.pop());
        totalDuration = temp.reduce((acc, t) => acc+=t.duration, 0);
        tracksFiltered = tracksFiltered.filter(t => t.duration < g.duration*1.05 - totalDuration);
        // console.log(tracksFiltered);
      }
      console.log('temp');
      console.log(temp);
      return temp;
    });
    return result;
  };


  const tracksList = generateTracksList(tracksAll, genresDuration).reduce((acc, arr) => [...acc, ...arr], []);
  const tracksId = tracksList.reduce((acc, t) => acc + t.tracks_id, ''); // result string
  console.log(tracksId);
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
  console.log(newPlaylist);
  console.log(tracksList);
  await Promise.all(
      tracksList.map( async track => playlistData.setPlaylistTrackMap(newPlaylist.playlists_id, track.deez_tracks_id)));
  await Promise.all(
      req.body.genres.map(
          async (g) => {
            if (g.duration !== 0) {
              const genreId = await genresData.getGenreByName(g.name);
              await playlistData.setPlaylistGenreMap(newPlaylist.playlists_id, genreId.deez_genres_id);
            };
          }));



  // console.log(from);
  // console.log(to);
  // console.log(playlistName);
};


