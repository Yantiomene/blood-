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

// Reverse geocoding: [lat, lon] -> address
async function reverseGeocode(latitude, longitude) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;
  try {
    const resp = await axios.get(url);
    if (!resp.data.results || resp.data.results.length === 0) {
      throw new Error('No reverse geocoding results found');
    }
    const formattedAddress = resp.data.results[0].formatted_address;
    return formattedAddress;
  } catch (error) {
    console.error('Error reverse geocoding:', error.message);
    throw new Error('Error reverse geocoding the provided coordinates');
  }
}

// Forward geocoding: address/place -> { coords: [lon, lat], address }
async function geocodeAddress(address) {
  if (!address || typeof address !== 'string' || !address.trim()) {
    throw new Error('Address is required');
  }
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;
  try {
    const resp = await axios.get(url);
    if (!resp.data.results || resp.data.results.length === 0) {
      throw new Error('No results found for the provided address');
    }
    const top = resp.data.results[0];
    const { lat, lng } = top.geometry.location;
    const formattedAddress = top.formatted_address;
    // Return [lon, lat] and formatted address
    return { coords: [lng, lat], address: formattedAddress };
  } catch (error) {
    console.error('Error geocoding address:', error.message);
    throw new Error('Error geocoding the provided address');
  }
}

module.exports = {
    validateLocationFormat,
    getNearbyHospitals,
    reverseGeocode,
    geocodeAddress,
};
