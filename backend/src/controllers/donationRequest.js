const { validateLocationFormat, getNearbyHospitals } = require('../utils/geoUtils');
const { sendNotificationEmail } = require('../utils/email');
const db = require('../db');
const wkx = require('wkx');
const fs = require('fs');

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


const findNearbyDonors = async (req, res) => {
    const { bloodType } = req.body; // Assuming bloodType is sent with the donation request
    const userId = req.user.id; // Assuming you have user information in req.user
    const userLocation = req.user.location;
    const username = req.user.username;
    const userEmail = req.user.email;
    const userContact = req.user.contactNumber;

    try {
        // Find nearby donors with matching blood type
        const result = await db.query(`
            SELECT 
                id,
                email,
                "bloodType", 
                ST_X(location::geometry) as latitude, 
                ST_Y(location::geometry) as longitude,
                ST_Distance(location, $1) as distance,
                "contactNumber"
            FROM 
                users
            WHERE 
                "bloodType" = $2 AND id != $3
            ORDER BY 
                distance
            LIMIT 5;
        `, [userLocation, bloodType, userId]);

        const point = wkx.Geometry.parse(Buffer.from(userLocation, 'hex'));

        // fetch nearby hospitals
        const { address, hospitals } = await getNearbyHospitals(point.y, point.x);
        const generateHospitalHTML = (hospital) => `
            <li>
                <strong style="color: #d9534f;">${hospital.name}</strong><br>
                ${hospital.address}
            </li>
        `;

        // Generate HTML content for each hospital in the 'hospitals' array
        const hospitalsHTML = hospitals.length > 0
        ? hospitals.map(generateHospitalHTML).join('')
        : '<p>No nearby hospitals.</p>';

        // Generate Donor HTML content
        const generateDonorHTML = (donor) => `
            <li>
                <strong style="color: #5cb85c;">Email:${donor.email}</strong><br>
                <strong style="color: #5cb85c;">Contact Number:${donor.contactNumber}</strong> <br>
                <strong style="color: #5cb85c;">Blood Type:${donor.bloodType}</strong><br>
            </li>
        `;
        const donorsHTML = result.rows.length > 0 
        ? result.rows.map(generateDonorHTML).join('')
        : '<p>No nearby donors.</p>';

        // Send email to nearby donors
        for (const donor of result.rows) {
            const { email, distance } = donor;
                    
            const subject = 'Blood Donation Request';
            const text = `You are a potential donor located ${distance} meters away. Consider helping someone in need!`;
            //const html =  fs.readFileSync('../utils/donorNotificationEmail.html', 'utf8');
            const html = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Blood Donation Request</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                        color: #333;
                    }
            
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        padding: 20px;
                        background-color: #fff;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
            
                    h2 {
                        color: #d9534f;
                    }
            
                    p {
                        margin-bottom: 15px;
                    }
            
                    ul {
                        list-style-type: none;
                        padding: 0;
                        margin: 0;
                    }
            
                    li {
                        margin-bottom: 5px;
                    }
            
                    strong {
                        color: #5bc0de;
                    }
            
                    footer {
                        margin-top: 20px;
                        font-size: 12px;
                        color: #777;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Blood Donation Request</h2>
                    <p>You are a potential donor located ${distance} meters away. Consider helping someone in need!</p>
                    <p>Requestor Information:</p>
                    <ul>
                        <li><strong>Name:</strong> ${username}</li>
                        <li><strong>Email:</strong> ${userEmail}</li>
                        <li><strong>Contact Number:</strong> ${userContact}</li>
                        <li><strong>Address:</strong> ${address}</li>
                    </ul>
                    <p>Nearby hospitals:</p>
                    <ul>
                        ${hospitalsHTML}
                    </ul>
                    <footer>Thank you, &copy;2024 the Blood+ team, all rights reserved</footer>
                </div>
            </body>
            </html>
            `;
        
            // Send email
            await sendNotificationEmail(email, subject, text, html);
        }

        // send email to user
        const subject = 'Blood Donors Nearby';
        const text = `You have a potential donors. Consider contacting them!`;
        const html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Blood Donors Nearby</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                    color: #333;
                }
        
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #fff;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
        
                h2 {
                    color: #5cb85c;
                }
        
                p {
                    margin-bottom: 15px;
                }
        
                ul {
                    list-style-type: none;
                    padding: 0;
                    margin: 0;
                }
        
                li {
                    margin-bottom: 5px;
                }
        
                strong {
                    color: #5bc0de;
                }
        
                footer {
                    margin-top: 20px;
                    font-size: 12px;
                    color: #777;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Blood Donors Nearby</h2>
                <p>You have potential donors. Consider contacting them!</p>
                <p>Donors List:</p>
                <ul>
                    ${donorsHTML}
                </ul>
                <p>Nearby Hospitals:</p>
                <ul>
                    ${hospitalsHTML}
                </ul>
                <footer>Thank you, &copy;2024 the Blood+ team, all rigths reserves</footer>
            </div>
        </body>
        </html>
        `;
        /*const html = `<p>You have a potential donors. Nearby donors List: ${result.rows},
        Nearby Hospitals: ${hospitals}
        </p>`;*/
    
        // Send email
        await sendNotificationEmail(userEmail, subject, text, html);

        return res.status(200).json({
            success: true,
            donors: result.rows || [],
            hospitals: hospitals || [],
        });
    } catch (error) {
        console.error('Error finding nearby donors:', error.message);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};



module.exports = {
    getDonationRequests,
    createDonationRequest,
    updateDonationRequest,
    findNearbyDonors
};
