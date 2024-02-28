const axios = require('axios');
const { GOOGLE_MAPS_API_KEY } = require('../constants');

const validateLocationFormat = (location) => {
    if (!location || !Array.isArray(location) || location.length !== 2) {
        throw new Error('Invalid location format. Please provide an array with [longitude, latitude].');
    }

    const [longitude, latitude] = location;

    if (isNaN(longitude) || isNaN(latitude) || longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
        throw new Error('Invalid longitude or latitude values.');
    }
};


async function getNearbyHospitals(latitude, longitude) {
  const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;

  try {
    // Step 1: Get human-readable address
    const geocodingResponse = await axios.get(geocodingUrl);
    const address = geocodingResponse.data.results[0].formatted_address;

    // Step 2: Use Places API to find nearby hospitals
    const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=hospital&key=${GOOGLE_MAPS_API_KEY}`;
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

module.exports = {
    validateLocationFormat,
    getNearbyHospitals,
};
