const db = require('../db');
const { hash } = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const { SECRET } = require('../constants');

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
        await db.query(
            'INSERT INTO users (username, email, password, "bloodType") VALUES ($1, $2, $3, $4) RETURNING *',
            [username, email, hashedPassword, bloodType]
        );
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
        const token = await sign(payload, SECRET);
        req.logger.info('User loged in successfully');
        return res.status(200).cookie('token', token, { httpOnly: true }).json({
            success: true,
            message: 'Logged in successfully',
        })
    } catch (error) {
        req.logger.error(`Error loging in user: ${error.message}`);
        console.error(error.message);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
        })
    }
}

exports.protected = async (req, res) => {
    try {
        return res.status(200).json({
            info: 'protected info',
        })
    } catch (error) {
        console.log(error.message);
    }
}

exports.logout = async (req, res) => {
    try {
        req.logger.info('User Loged out successfully');
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
        const userProfile = await db.query('SELECT id, username, email, "bloodType", location FROM users WHERE id = $1', [userId]);

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
    const { username, email, bloodType, location } = req.body;

    try {
        console.log(location[0], location[1]);
        // Convert coordinates to POINT format
        const locationPoint = await db.query('SELECT ST_SetSRID(ST_MakePoint($1, $2), 4326) AS location', [location[0], location[1]]);
        console.log(locationPoint.rows[0].location, typeof(locationPoint));
        await db.query(
            'UPDATE users SET username = $1, email = $2, "bloodType" = $3, location = $4 WHERE id = $5 RETURNING *',
            [username, email, bloodType, locationPoint.rows[0].location, userId]
        );
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