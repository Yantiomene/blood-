const { validateLocationFormat } = require('../utils/geoUtils');
const db = require('../db');

const createDonationRequest = async (req, res) => {
    const { bloodType, quantity, location } = req.body;
    const userId = req.user.id;

    try {
        validateLocationFormat(location);

        const locationPoint = await db.query('SELECT ST_SetSRID(ST_MakePoint($1, $2), 4326) AS location', [location[0], location[1]]);

        // Insert the donation request into the database
        const result = await db.query(
            'INSERT INTO donation_requests ("userId", "bloodType", quantity, location, "isFulfilled", "requestingEntity", "requestingEntityId") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [userId, bloodType, quantity, locationPoint.rows[0].location, false, 'User', userId]
        );

        const createdDonationRequest = result.rows[0];

        req.logger.info('Donation request created successfully');
        res.status(201).json({
            success: true,
            message: 'Donation request created successfully',
            donationRequest: createdDonationRequest,
        });
    } catch (error) {
        req.logger.error('Error creating donation request:', error.message);
        console.error('Error creating donation request:', error.message);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};



const getDonationRequests = async (req, res) => {
    const { isFulfilled } = req.query;

    try {

        let query = 'SELECT * FROM donation_requests';
        const params = [];

        if (isFulfilled) {
            query += ' WHERE "isFulfilled" = $1';
            params.push(isFulfilled);
        }

        // Retrieve all donation requests from the database
        const result = await db.query(query, params);
        const donationRequests = result.rows;

        req.logger.info('Fetched donation requests successfully');
        res.status(200).json({
            success: true,
            donationRequests,
        });
    } catch (error) {
        req.logger.error('Error retrieving donation requests:', error.message);
        console.error('Error retrieving donation requests:', error.message);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};

module.exports = {
    getDonationRequests,
    createDonationRequest,
};
