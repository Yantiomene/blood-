const db = require('../db');

// function to create a new message
exports.createMessage = async (req, res) => {
    const { conversationId, senderId, receiverId, content, messageType, metadata, event } = req.body;

    try {

        // Check if required fields are provided
        if (!receiverId || !senderId || !content || !messageType) {
            return res.status(400).json({ success: false, error: 'receiverId, senderId, content and messageType are required' });
        }

        // Check if senderId and receiverId correspond to existing users
        const sender = await db.query('SELECT * FROM users WHERE id = $1', [senderId]);
        const receiver = await db.query('SELECT * FROM users WHERE id = $1', [receiverId]);

        // If either senderId or receiverId does not correspond to an existing user, return error
        if (!sender.rows.length || !receiver.rows.length) {
            return res.status(400).json({ success: false, error: 'Sender or Receiver does not exist' });
        }

        let newConversationId = conversationId; // Initialize with provided conversation ID

        // If conversation ID provided, check if it belongs to an existing conversation
        if (conversationId) {
            const conversationExists = await db.query('SELECT * FROM conversations WHERE id = $1', [conversationId]);
            if (!conversationExists.rows.length) {
                return res.status(400).json({ success: false, error: 'Conversation does not exist' });
            }
        } else {
            // If conversation ID not provided, create a new conversation
            const conversation = await db.query('INSERT INTO conversations ("senderId", "receiverId") VALUES ($1, $2) RETURNING *', [senderId, receiverId]);
            newConversationId = conversation.rows[0].id;
        }

        // Insert message into messages table
        const message = await db.query(`
            INSERT INTO messages ("conversationId", "senderId", "recipientId", content, "messageType", metadata, event) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *;
        `, [newConversationId, senderId, receiverId, content, messageType, metadata, event]);

        req.logger.info(`Message created: ${message.rows[0].id}`);
        res.status(201).json({ success: true, message: message.rows[0], conversationId: newConversationId });
    } catch (error) {
        req.logger.error("Error creating message: ", error.message);
        console.log("Error creating message: ", error.message);
        res.status(500).json({success: false, error: error.message });
    }
}