const validateLocationFormat = (location) => {
    if (!location || !Array.isArray(location) || location.length !== 2) {
        throw new Error('Invalid location format. Please provide an array with [longitude, latitude].');
    }

    const [longitude, latitude] = location;

    if (isNaN(longitude) || isNaN(latitude) || longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
        throw new Error('Invalid longitude or latitude values.');
    }
};

module.exports = {
    validateLocationFormat,
};
