const db = require('../db');
const { hash } = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const { SECRET } = require('../constants');

exports.getUsers = async (req, res) => {
    try {
        const users = await db.query('SELECT id, username, email FROM users');
        return res.status(200).json({
            success: true,
            users: users.rows || [] // Return an empty array if users.rows is falsy
        });
    } catch (error) {
        console.error("Could not get users:", error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

exports.register = async (req, res) => {
    const { username, email, password, blood_type } = req.body;
    try {
        const hashedPassword = await hash(password, 10);
        await db.query('INSERT INTO users (username, email, password, blood_type) VALUES ($1, $2, $3, $4) RETURNING *', [username, email, hashedPassword, blood_type]);
        return res.status(201).json({
            success: true,
            message: 'User created successfully'
        })
    } catch (error) {
        console.log("Could not create new user:", error.message);
        return res.status(500).json({
            error: error.message,
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
        return res.status(200).cookie('token', token, { httpOnly: true }).json({
            success: true,
            message: 'Logged in successfully',
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error: error.message,
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
        return res.status(200).clearCookie('token', { httpOnly: true }).json({
            success: true,
            message: 'Logged out successfully'
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error: error.message,
        })
    }
}