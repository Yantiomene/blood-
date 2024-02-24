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


const updateDonationRequest = async (req, res) => {
    const { requestId } = req.params;
    const { quantity, bloodType, location, isFulfilled } = req.body;

    try {
        // Check if the donation request exists
        const existingRequest = await db.query('SELECT * FROM donation_requests WHERE id = $1', [requestId]);

        if (existingRequest.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Donation request not found',
            });
        }

        // Update donation request
        const updateFields = [];
        const updateValues = [];

        if (quantity !== undefined) {
            updateFields.push('"quantity"');
            updateValues.push(quantity);
        }

        if (bloodType !== undefined) {
            updateFields.push('"bloodType"');
            updateValues.push(bloodType);
        }

        if (location !== undefined) {
            updateFields.push('"location"');
            validateLocationFormat(location);
            const locationPoint = await db.query('SELECT ST_SetSRID(ST_MakePoint($1, $2), 4326) AS location', [location[0], location[1]]);
            updateValues.push(locationPoint.rows[0].location);
        }

        if (isFulfilled !== undefined) {
            updateFields.push('"isFulfilled"');
            updateValues.push(isFulfilled);
        }

        updateFields.push('"updated_at"');
        updateValues.push(new Date());

        const updateQuery =
            `UPDATE donation_requests SET (${updateFields.join(', ')}) = (${updateValues.map((_, i) => `$${i + 1}`).join(', ')}) WHERE id = $${updateValues.length + 1} RETURNING *`;

        const result = await db.query(updateQuery, [...updateValues, requestId]);
        const updatedRequest = result.rows[0];
        
        req.logger.info('Donation request updated successfully');
        res.status(200).json({
            success: true,
            message: 'Donation request updated successfully',
            updatedRequest,
        });
    } catch (error) {
        req.logger.error('Error updating donation request:', error.message);
        console.error('Error updating donation request:', error.message);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};

module.exports = {
    getDonationRequests,
    createDonationRequest,
    updateDonationRequest,
};
