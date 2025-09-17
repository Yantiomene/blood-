const axios = require('axios');
const { GOOGLE_MAPS_API_KEY } = require('./src/constants');

async function getNearbyHospitals(apiKey, latitude, longitude) {
  const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

  try {
    // Step 1: Get human-readable address
    const geocodingResponse = await axios.get(geocodingUrl);
    const address = geocodingResponse.data.results[0].formatted_address;

    // Step 2: Use Places API to find nearby hospitals
    const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=hospital&key=${apiKey}`;
    //const placesUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=blood+bank&location=${latitude},${longitude}&radius=5000&key=${apiKey}`;
    const placesResponse = await axios.get(placesUrl);

    const hospitals = placesResponse.data.results.map((result) => ({
      name: result.name,
      address: result.vicinity,
    }));

    return { address, hospitals };
  } catch (error) {
    console.error('Error:', error.message);
    throw new Error('Error fetching nearby hospitals');
  }
}

// Example usage
const apiKey = GOOGLE_MAPS_API_KEY;
const userLatitude = 5.8; // Replace with user's latitude 37.7749
const userLongitude = -18; // Replace with user's longitude

getNearbyHospitals(apiKey, userLatitude, userLongitude)
  .then(({ address, hospitals }) => {
    console.log('User Address:', address);
    console.log("Number of hospitals:", hospitals.length);
    console.log('Nearby Hospitals:', hospitals);
  })
  .catch((error) => console.error('Error:', error.message));
