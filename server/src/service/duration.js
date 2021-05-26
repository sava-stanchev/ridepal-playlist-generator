import fetch from 'node-fetch';


/**
 * @param {object} route
 * @return {number} duration
 */
const test = async ({from, to}) => {
  console.log('hi');
  let a = 0;
  fetch(`http://dev.virtualearth.net/REST/V1/Routes/Driving?wp.0=${from}&wp.1=${to}&routeAttributes=excludeItinerary&key=AlyPtpHnx-TC4cf6hqJyd2oQKsQwnovawxxxnua_ml-uIxALhwZ__iJg9izB3iHr`, {
    method: 'GET',
  })
      .then(res => res.json())
      .then(data => a = data.resourceSets[0].resources[0].travelDuration)
      .catch(error => console.log(error));
 
  return a;
};

// test(b);

export default {
  test,
}