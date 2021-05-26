import tracksData from '../data/tracks.js';


/**
 *
 * @param {Array} data - array of object{genre:xx, duration:xx}
 * @return {Array} array of objects
 */
const playlistGenerator = async (data) => {
  const req = await Promise.all(data.map(obj => tracksData.getTracksByGenre(obj)));
  const tracks = await a.reduce((acc, c)=>[...acc, ...c], []);
  console.log(tracks);
  return tracks;
};

/**
 *
 * @param {Array} data - array of object{genre:xx, duration:xx}
 * @return {Array} array of objects
 */
const playlistGeneratorNotRepArtist = async (data) => {
  const req = await Promise.all(data.map(obj => tracksData.getTracksByGenre(obj)));
  const tracks = await a.reduce((acc, c)=>[...acc, ...c], []);
  console.log(tracks);
  return tracks;
};

// playlistGenerator( [{genre: 132, duration: 1000}, {genre: 116, duration: 2000}]);

export default {
  playlistGenerator,
  playlistGeneratorNotRepArtist,
}