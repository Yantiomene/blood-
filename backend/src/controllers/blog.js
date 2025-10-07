// Import necessary modules
const db = require('../db'); // Import your database connection module
const { generateBlogHTMLFromTitle } = require('../utils/ai');
const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');


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
        const { title, content, image } = req.body;

        // Check if the 'image' field is provided
        const values = image ? [title, content, image] : [title, content];

        // Build the SQL query dynamically based on the presence of the 'image' field
        const query = image
            ? 'INSERT INTO blogs (title, content, image) VALUES ($1, $2, $3) RETURNING *'
            : 'INSERT INTO blogs (title, content) VALUES ($1, $2) RETURNING *';

        const result = await db.query(query, values);

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
        const { title, content, image } = req.body;
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

        if (image) {
            updateFields.push('image');
            updateValues.push(image);
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


exports.deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the blog post with the given ID exists
        const existingBlog = await db.query('SELECT * FROM blogs WHERE id = $1', [id]);

        if (existingBlog.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Blog post not found' });
        }

        // Delete the blog post
        await db.query('DELETE FROM blogs WHERE id = $1', [id]);

        res.status(200).json({ success: true, message: 'Blog post deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog post:', error.message);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// Increment likes_count for a blog
exports.likeBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            'UPDATE blogs SET likes_count = COALESCE(likes_count, 0) + 1, updated_at = now() WHERE id = $1 RETURNING id, likes_count',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }
        res.status(200).json({ success: true, blog: result.rows[0] });
    } catch (error) {
        console.error('Error liking blog:', error.message);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// Get comments for a blog
exports.getBlogComments = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM blog_comments WHERE blog_id = $1 ORDER BY created_at DESC', [id]);
        res.status(200).json({ success: true, comments: result.rows });
    } catch (error) {
        console.error('Error fetching comments:', error.message);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// Add a comment to a blog
exports.createBlogComment = async (req, res) => {
    try {
        const { id } = req.params; // blog id
        const { content, parentId } = req.body;
        if (!content || !content.trim()) {
            return res.status(400).json({ success: false, message: 'Content is required' });
        }
        const userId = req.user ? req.user.id : null;
        if (parentId) {
            // Ensure parent comment exists and belongs to same blog
            const parent = await db.query('SELECT * FROM blog_comments WHERE id = $1 AND blog_id = $2', [parentId, id]);
            if (parent.rows.length === 0) {
                return res.status(400).json({ success: false, message: 'Invalid parent comment' });
            }
        }
        const result = await db.query(
            'INSERT INTO blog_comments (blog_id, user_id, content, parent_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [id, userId, content.trim(), parentId || null]
        );
        res.status(201).json({ success: true, comment: result.rows[0] });
    } catch (error) {
        console.error('Error creating comment:', error.message);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// Delete a comment (admin only)
exports.deleteBlogComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const existing = await db.query('SELECT * FROM blog_comments WHERE id = $1', [commentId]);
        if (existing.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Comment not found' });
        }
        await db.query('DELETE FROM blog_comments WHERE id = $1', [commentId]);
        res.status(200).json({ success: true, message: 'Comment deleted' });
    } catch (error) {
        console.error('Error deleting comment:', error.message);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// Like a comment
exports.likeBlogComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const result = await db.query(
            'UPDATE blog_comments SET likes_count = COALESCE(likes_count, 0) + 1 WHERE id = $1 RETURNING id, likes_count, blog_id',
            [commentId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Comment not found' });
        }
        res.status(200).json({ success: true, comment: result.rows[0] });
    } catch (error) {
        console.error('Error liking comment:', error.message);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// Admin-only: generate blog content with AI by title and save
exports.generateBlogContentAI = async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await db.query('SELECT * FROM blogs WHERE id = $1', [id]);
        if (existing.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }
        const blog = existing.rows[0];
        const title = blog.title;
        if (!title || !title.trim()) {
            return res.status(400).json({ success: false, message: 'Blog title is required to generate content' });
        }

        const { content, provider } = await generateBlogHTMLFromTitle(title);

        const updateRes = await db.query(
            'UPDATE blogs SET content = $1, updated_at = now() WHERE id = $2 RETURNING *',
            [content, id]
        );

        return res.status(200).json({ success: true, blog: updateRes.rows[0], provider });
    } catch (error) {
        console.error('Error generating blog content:', error.message);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// Upload blog image (admin only) and return accessible URL
exports.uploadBlogImage = async (req, res) => {
    try {
        const { imageBase64, filename } = req.body || {};
        if (!imageBase64 || !filename) {
            return res.status(400).json({ success: false, message: 'Missing imageBase64 or filename' });
        }

        // Validate extension
        const ext = path.extname(filename).toLowerCase();
        if (!['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext)) {
            return res.status(400).json({ success: false, message: 'Unsupported file type' });
        }

        // Strip data URL prefix if present
        const base64Data = imageBase64.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, '');

        const uploadsDir = path.resolve(__dirname, '..', '..', 'uploads', 'blog_images');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const safeBase = path.basename(filename, ext).replace(/[^a-z0-9-_]+/gi, '_');
        const finalName = `${Date.now()}_${safeBase}${ext}`;
        const filePath = path.join(uploadsDir, finalName);
        fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

        const publicUrl = `/uploads/blog_images/${finalName}`;
        return res.status(200).json({ success: true, url: publicUrl });
    } catch (error) {
        console.error('Error uploading image:', error.message);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

