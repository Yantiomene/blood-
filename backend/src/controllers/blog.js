// Import necessary modules
const db = require('../db'); // Import your database connection module
const { validationResult } = require('express-validator');


// Define a route to get all blog articles
exports.getBlogs = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM blogs ORDER BY updated_at DESC');
        res.status(200).json({ success: true, blogs: result.rows });
    } catch (error) {
        console.error('Error fetching blogs:', error.message);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

exports.createBlog = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, content } = req.body;
        const result = await db.query('INSERT INTO blogs (title, content) VALUES ($1, $2) RETURNING *', [title, content]);
        res.status(201).json({ success: true, blog: result.rows[0] });
    } catch (error) {
        console.error('Error creating blog:', error.message);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

exports.getBlogsById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM blogs WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }
        res.status(200).json({ success: true, blog: result.rows[0] });
    } catch (error) {
        console.error('Error fetching blog:', error.message);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}


exports.updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const updateValues = [];
        const updateFields = [];

        if (title) {
            updateFields.push('title');
            updateValues.push(title);
        }

        if (content) {
            updateFields.push('content');
            updateValues.push(content);
        }

        if (updateValues.length === 0) {
            return res.status(400).json({ success: false, message: 'No updates provided' });
        }

        // Add 'updated_at' to the array of fields to be updated
        const updatedFields = [...updateFields, 'updated_at'];

        // Include the current timestamp as the value for 'updated_at'
        const updatedValues = [...updateValues, new Date()];

        const updateFieldsString = updatedFields.map((field, i) => `"${field}" = $${i + 1}`).join(', ');

        const result = await db.query(`
            UPDATE blogs
            SET ${updateFieldsString}
            WHERE id = $${updatedValues.length + 1}
            RETURNING *;
        `, [...updatedValues, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }
        res.status(200).json({ success: true, blog: result.rows[0] });
    } catch (error) {
        console.error('Error updating blog:', error.message);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}


