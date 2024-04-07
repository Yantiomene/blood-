const db = require('../db');
const { hash } = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const { SECRET } = require('../constants');
const redisClient = require('../utils/redis');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email');
const { validateLocationFormat } = require('../utils/geoUtils');

exports.getUsers = async (req, res) => {
    try {
        const users = await db.query('SELECT id, username, email FROM users');
        req.logger.info('Fetched user data successfully');
        return res.status(200).json({
            success: true,
            users: users.rows || [] // Return an empty array if users.rows is falsy
        });
    } catch (error) {
        req.logger.error(`Error fetching users: ${error.message}`);
        console.error("Could not get users:", error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

exports.register = async (req, res) => {
    const { username, email, password, bloodType } = req.body;

    try {
        const hashedPassword = await hash(password, 10);
        const verificationCode = generateShortCode();

        // Store verification code in Redis
        if (!redisClient.isAlive()) {
            throw new Error('Redis client not connected');
        }

        // Check if there's an existing verification code for the email
        const existingCode = await redisClient.get(email);

        // If there's an existing code, delete it
        if (existingCode) {
            await redisClient.del(existingCode);
        }

        // Store the new verification code in Redis
        await redisClient.set(verificationCode, email, 60 * 60); // Expire in 1h (3600 seconds)

        await db.query(
            'INSERT INTO users (username, email, password, "bloodType") VALUES ($1, $2, $3, $4) RETURNING *',
            [username, email, hashedPassword, bloodType]
        );

        // Send verification email with the short code
        sendVerificationEmail(email, verificationCode);
        console.log(">> VERIFICATION CODE: ", verificationCode);

        req.logger.info('Created user successfully');
        return res.status(201).json({
            success: true,
            message: 'User created successfully'
        });
    } catch (error) {
        req.logger.error(`Error creating user: ${error.message}`);
        console.error("Could not create new user:", error.message);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
        })
    }
}

exports.login = async (req, res) => {
    const user = req.user;
    const payload = {
        id: user.id,
        email: user.email
    }
    try {
        const token = sign(payload, SECRET, { expiresIn: '1h' });
        req.user = user;
        req.logger.info(`${user.email} logged in successfully`);
        return res.status(200).cookie('token', token, { httpOnly: true }).json({
            success: true,
            message: 'Logged in successfully',
        })
    } catch (error) {
        req.logger.error(`Error loging in user: ${error.message}`);
        console.error(error.message);
        return res.status(500).json({
            success: false,
            error: 'Error loging in user',
        })
    }
}

exports.logout = async (req, res) => {
    try {
        req.logger.info('User Logged out successfully');
        return res.status(200).clearCookie('token', { httpOnly: true }).json({
            success: true,
            message: 'Logged out successfully'
        })
    } catch (error) {
        req.logger.error(`Error loging out user: ${error.message}`);
        console.error(error.message);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
        })
    }
}

exports.getUserProfile = async (req, res) => {
    const userId = req.user.id;

    try {
        const userProfile = await db.query('SELECT id, username, email, "bloodType", "isDonor", location, "isVerified" FROM users WHERE id = $1', [userId]);

        if (!userProfile.rows.length) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        req.logger.info("Fetched user profile successfully");
        return res.status(200).json({
            success: true,
            user: userProfile.rows[0]
        });
    } catch (error) {
        req.logger.error("Error fetching user profile:", error.message);
        console.error("Could not get user profile:", error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


exports.updateUserProfile = async (req, res) => {
    const userId = req.user.id;
    const { username, email, bloodType, isDonor, location, contactNumber } = req.body;

    try {

        // Update donation request
        const updateFields = [];
        const updateValues = [];

        if (username !== undefined) {
            updateFields.push('"username"');
            updateValues.push(username);
        }

        if (email !== undefined) {
            updateFields.push('"email"');
            updateValues.push(email);
        }

        if (bloodType !== undefined) {
            updateFields.push('"bloodType"');
            updateValues.push(bloodType);
        }

        if (isDonor !== undefined) {
            updateFields.push('"isDonor"');
            updateValues.push(isDonor);
        }

        if (location !== undefined) {
            validateLocationFormat(location);
            updateFields.push('"location"');
            const locationPoint = await db.query('SELECT ST_SetSRID(ST_MakePoint($1, $2), 4326) AS location', [location[0], location[1]]);
            updateValues.push(locationPoint.rows[0].location);
        }

        if (contactNumber !== undefined) {
            updateFields.push('"contactNumber"');
            updateValues.push(contactNumber);
        }

        updateFields.push('"updated_at"');
        updateValues.push(new Date());

        const updateQuery = `UPDATE users SET (${updateFields.join(', ')}) = (${updateValues.map((_, i) => `$${i + 1}`).join(', ')}) WHERE id = $${updateValues.length + 1} RETURNING *`;
        const result = await db.query(updateQuery, [...updateValues, userId]);

        req.user = result.rows[0];

        req.logger.info("Updated user profile successfully");
        return res.status(200).json({
            success: true,
            message: 'User profile updated successfully'
        });
    } catch (error) {
        req.logger.error("Error updating user profile:", error.message);
        console.error("Could not update user profile:", error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


// function to generate a new verification code
exports.requestNewToken = async (req, res) => {
    const { email } = req.body;
    console.log(">> EMAIL: ", email, req.body);
    try {
        // check if email exists
        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Email is required',
            });
        }

        // check if email exists in database
        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (!user.rows[0]) {
            return res.status(404).json({
                success: false,
                error: 'Email not found',
            })
        }

        // Generate a new verification code 
        const verificationCode = generateShortCode();

        // check if redis client is connected
        if (!redisClient.isAlive()) {
            throw new Error('Redis client not connected');
        }

        // Check if there's an existing verification code for the email
        const existingCode = await redisClient.get(email);

        // If there's an existing code, delete it
        if (existingCode) {
            await redisClient.del(existingCode);
        }

        // Store the new verification code in Redis
        await redisClient.set(verificationCode, email, 60 * 60); // Expire in 1h (3600 seconds)

        // Send verification email with the short code
        sendVerificationEmail(email, verificationCode);
        console.log(">> NEW VERIFICATION CODE: ", verificationCode);

        req.logger.info('New verification code sent successfully');
        return res.status(200).json({
            success: true,
            message: 'New verification code sent successfully',
        });

    } catch (error) {
        req.logger.error('Error sending new verification code:', error.message);
        console.error('Error sending new verification code:', error.message);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};

exports.verifyEmail = async (req, res) => {
    const verificationCode = req.params.code;

    try {
        // Retrieve verification code from Redis
        const email = await redisClient.get(verificationCode);

        if (!email) {
            return res.status(404).json({
                success: false,
                error: 'Invalid verification code.',
            });
        }

        // Update the user's status to verified
        await db.query('UPDATE users SET "isVerified" = true WHERE email = $1', [email]);

        req.logger.info('Email verified successfully');
        return res.status(200).json({
            success: true,
            message: 'Email verified successfully',
        });
    } catch (error) {
        req.logger.error('Error verifying email:', error.message);
        console.log('Error verifying email:', error.message);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};


exports.updateUserLocation = async (req, res) => {
    const { latitude, longitude } = req.body;
    const userId = req.user.id; // Assuming you have user information in req.user

    try {

        validateLocationFormat([longitude, latitude]);

        // Update user's location in the database
        await db.query('UPDATE users SET location = ST_GeomFromText($1, 4326) WHERE id = $2', [`POINT(${longitude} ${latitude})`, userId]);

        req.logger.info('User location updated successfully');
        return res.status(200).json({
            success: true,
            message: 'User location updated successfully',
        });
    } catch (error) {
        req.logger.error('Error updating user location:', error.message);
        console.error('Error updating user location:', error.message);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};

exports.passwordResetRequest = async (req, res) => {
    const { email } = req.body;

    try {
        // check if email exists in database
        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (!user.rows[0]) {
            return res.status(404).json({
                success: false,
                error: 'Email not found',
            })
        }

        // Generate and store a reset token in Redis
        const resetToken = generateShortCode();

        // Store verification code in Redis
        if (!redisClient.isAlive()) {
            throw new Error('Redis client not connected');
        }

        // Check if there's an existing token for the email
        const existingCode = await redisClient.get(email);

        // If there's an existing code, delete it
        if (existingCode) {
            await redisClient.del(existingCode);
        }

        // Store the new reset token in Redis
        await redisClient.set(resetToken, email, 60 * 60); // Expire in 1h (3600 seconds)

        // Send password reset email with the short code
        sendPasswordResetEmail(email, resetToken);

        req.logger.info('Password reset email sent successfully');
        return res.status(200).json({
            success: true,
            message: 'Password reset email sent successfully',
        });
    } catch (error) {
        req.logger.error('Error sending password reset email:', error.message);
        console.error('Error sending password reset email:', error.message);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
}


exports.resetPassword = async (req, res) => {
    const { code, password } = req.body;

    try {
        // Retrieve verification code from Redis
        const email = await redisClient.get(code);
        if (!email) {
            return res.status(404).json({
                success: false,
                error: 'Invalid verification code.',
            });
        }

        // hash the password
        const hashedPassword = await hash(password, 10);

        // Update the user's password in the database
        await db.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, email]);

        req.logger.info('Password reset successfully');
        return res.status(200).json({
            success: true,
            message: 'Password reset successfully',
        });
    } catch (error) {
        req.logger.error('Error resetting password:', error.message);
        console.error('Error resetting password:', error.message);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
}

// Function to generate a random short code (5 digits)
const generateShortCode = () => {
    const min = 10000; // Minimum 5-digit number
    const max = 99999; // Maximum 5-digit number
    return Math.floor(min + Math.random() * (max - min + 1)).toString();
};