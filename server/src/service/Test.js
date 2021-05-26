
import mariadb from 'mariadb';
import fetch from 'node-fetch';


const HOST = 'localhost';
const DBPORT = 3306;
const USER = 'root';
const PASSWORD = 'Pr0t0dqk0n';
const DATABASE = 'playlist_generator';
const NB_GENRES = 2000;
const TIME = 150;
const NB_ARTISTS = 10;
const NB_ALBUMS = 30;
const NB_TRACKS = 3000;


const pool = mariadb.createPool({
  host: HOST,
  port: DBPORT,
  user: USER,
  password: PASSWORD,
  database: DATABASE,
});


/**
 * @param {number} genre
 * @return {object} tracks
 */
const test = async () => {
  console.log('hi');
  
  fetch(`http://dev.virtualearth.net/REST/V1/Routes/Driving?wp.0=Sofia&wp.1=Pernik&routeAttributes=excludeItinerary&key=AlyPtpHnx-TC4cf6hqJyd2oQKsQwnovawxxxnua_ml-uIxALhwZ__iJg9izB3iHr`, {
    method: 'GET',
  })
  .then(res => res.json())
  .then(data => console.log(data.resourceSets[0].resources[0].travelDuration))
  .catch(error => console.log(error))
};

test();

