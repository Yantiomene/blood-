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


// function to get all messages in a conversation
exports.getMessagesByConversation = async (req, res) => {
    const { conversationId } = req.params;

    try {
        // Check if conversation exists
        const conversation = await db.query('SELECT * FROM conversations WHERE id = $1', [conversationId]);

        if (!conversation.rows.length) {
            return res.status(400).json({ success: false, error: 'Conversation does not exist' });
        }

        // Get all messages in the conversation
        const messages = await db.query('SELECT * FROM messages WHERE "conversationId" = $1', [conversationId]);

        if (!messages.rows.length) {
            return res.status(404).json({ success: false, error: 'No messages found' });
        }

        req.logger.info(`Messages retrieved for conversation: ${conversationId}`);
        res.status(200).json({ success: true, messages: messages.rows });
    } catch (error) {
        req.logger.error("Error getting messages: ", error.message);
        console.log("Error getting messages: ", error.message);
        res.status(500).json({success: false, error: error.message });
    }
}


// function to get all conversations for a user
exports.getConversationsByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        // Check if user exists
        const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);

        if (!user.rows.length) {
            return res.status(400).json({ success: false, error: 'User does not exist' });
        }

        // Get all conversations for the user
        const conversations = await db.query('SELECT * FROM conversations WHERE "senderId" = $1 OR "receiverId" = $1', [userId]);

        if (!conversations.rows.length) {
            return res.status(404).json({ success: false, error: 'No conversations found' });
        }

        req.logger.info(`Conversations retrieved for user: ${userId}`);
        res.status(200).json({ success: true, conversations: conversations.rows });
    } catch (error) {
        req.logger.error("Error getting conversations: ", error.message);
        console.log("Error getting conversations: ", error.message);
        res.status(500).json({success: false, error: error.message });
    }
}

// function to get all messages for a user
exports.getMessagesByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        // Check if user exists
        const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);

        if (!user.rows.length) {
            return res.status(400).json({ success: false, error: 'User does not exist' });
        }

        // Get all messages for the user
        const messages = await db.query(`
            SELECT * FROM messages 
            WHERE "senderId" = $1 OR "recipientId" = $1
            ORDER BY "updated_at" DESC
        `, [userId]);

        if (!messages.rows.length) {
            return res.status(404).json({ success: false, error: 'No messages found' });
        }

        req.logger.info(`Messages retrieved for user: ${userId}`);
        res.status(200).json({ success: true, messages: messages.rows });
    } catch (error) {
        req.logger.error("Error getting messages: ", error.message);
        console.log("Error getting messages: ", error.message);
        res.status(500).json({success: false, error: error.message });
    }
}


// function to update a message
exports.updateMessage = async (req, res) => {
    const { messageId } = req.params;

    const { content, messageType, status, metadata, event } = req.body;

    try {
        // check if the message exists
        const message = await db.query('SELECT * FROM messages WHERE id = $1', [messageId]);
        if (!message.rows.length) {
            return res.status(404).json({ success: false, error: 'Message not found' });
        }

        const updateFields = [];
        const updateValues = [];

        if (content) {
            updateFields.push('content');
            updateValues.push(content);
        }

        if (messageType) {
            updateFields.push('messageType');
            updateValues.push(messageType);
        }

        if (status) {
            updateFields.push('status');
            updateValues.push(status);
        }

        if (metadata) {
            updateFields.push('metadata');
            updateValues.push(metadata);
        }

        if (event) {
            updateFields.push('event');
            updateValues.push(event);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No fields provided to update'
            });
        }

        updateValues.push(messageId);

        // Update the message
        const updatedMessage = await db.query(`
            UPDATE messages
            SET ${updateFields.map((field, index) => `"${field}" = ${index + 1}`).join(', ')}
            WHERE id = ${updateValues.length}
            RETURNING *;
        `, updateValues);

        req.logger.info(`Message updated: ${messageId}`);
        res.status(200).json({ success: true, message: updatedMessage.rows[0] });
    } catch (error) {
        req.logger.error("Error updating message: ", error.message);
        console.log("Error updating message: ", error.message);
        res.status(500).json({success: false, error: error.message });
    }
}

// function to delete a message
exports.deleteMessage = async (req, res) => {
    const { messageId } = req.params;

    try {
        // check if the message exists
        const message = await db.query('SELECT * FROM messages WHERE id = $1', [messageId]);
        if (!message.rows.length) {
            return res.status(404).json({ success: false, error: 'Message not found' });
        }

        // Delete the message
        await db.query('DELETE FROM messages WHERE id = $1', [messageId]);

        req.logger.info(`Message deleted: ${messageId}`);
        res.status(200).json({ success: true, message: 'Message deleted' });
    } catch (error) {
        req.logger.error("Error deleting message: ", error.message);
        console.log("Error deleting message: ", error.message);
        res.status(500).json({success: false, error: error.message });
    }
}