const { check } = require('express-validator');
const db = require('../db');
const { compare } = require('bcryptjs');

// password validation
const password = check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters');

// email validation
const email = check('email').isEmail().withMessage('Invalid Email');

// check if email exists
const emailExist = check('email').custom(async (email) => {
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (rows.length > 0) {
        throw new Error('A User with this email already exists');
    }
})

// check if username exists
const usernameExist = check('username').custom(async (username) => {
    const { rows } = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    if (rows.length > 0) {
        throw new Error('A User with this username already exists');
    }
})

// Login validation
const loginFieldsCheck = check('email').custom(async (value, { req }) => {
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [value]);
    if (rows.length === 0) {
        throw new Error('Invalid email');
    }

    const validPassword = await compare(req.body.password, rows[0].password);
    if (!validPassword) {
        throw new Error('Wrong password');
    }

    req.user = rows[0];
})

module.exports = {
    registerValidation: [email, password, emailExist, usernameExist],
    loginValidation: [loginFieldsCheck],
    resetPasswordValidation: [password],
}