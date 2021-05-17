import fetch from 'node-fetch';
import setGenres from '../data/deezerData.js';


const mainGenres = () => {
  fetch(`https://api.deezer.com/genre/`)
      .then((res) => res.json())
      .then((data) => () => setGenres(data))
      .catch((error) => {return error.message});
};

export default {
  mainGenres,
};
