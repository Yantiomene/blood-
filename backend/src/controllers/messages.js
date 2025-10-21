const db = require('../db');
const { broadcastUnreadUpdate } = require('./websocketHandlers');

// function to create a new message
exports.createMessage = async (req, res) => {
    const { conversationId, senderId: bodySenderId, receiverId, content, messageType, metadata, event } = req.body;

    try {
        // Enforce that the authenticated user is the sender
        const authSenderId = req.user && req.user.id;
        if (!authSenderId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }
        if (bodySenderId && bodySenderId !== authSenderId) {
            return res.status(403).json({ success: false, error: 'senderId mismatch with authenticated user' });
        }

        // Check if required fields are provided
        if (!receiverId || !content) {
            return res.status(400).json({ success: false, error: 'receiverId and content are required' });
        }

        // messageType defaults to 'text' if not provided
        const msgType = messageType || 'text';

        // Check if senderId and receiverId correspond to existing users
        const sender = await db.query('SELECT id FROM users WHERE id = $1', [authSenderId]);
        const receiver = await db.query('SELECT id FROM users WHERE id = $1', [receiverId]);

        // If either senderId or receiverId does not correspond to an existing user, return error
        if (!sender.rows.length || !receiver.rows.length) {
            return res.status(400).json({ success: false, error: 'Sender or Receiver does not exist' });
        }

        let newConversationId = conversationId; // Initialize with provided conversation ID

        // Canonicalize participant ordering to avoid duplicate conversations in reverse order
        const p1 = Math.min(authSenderId, receiverId);
        const p2 = Math.max(authSenderId, receiverId);

        // If conversation ID provided, ensure it belongs to an existing conversation
        if (conversationId) {
            const conversationExists = await db.query('SELECT id, "senderId", "receiverId" FROM conversations WHERE id = $1', [conversationId]);
            if (!conversationExists.rows.length) {
                return res.status(400).json({ success: false, error: 'Conversation does not exist' });
            }
        } else {
            // Try to find an existing conversation for these two users (in canonical order)
            const existing = await db.query('SELECT id FROM conversations WHERE "senderId" = $1 AND "receiverId" = $2', [p1, p2]);
            if (existing.rows.length) {
                newConversationId = existing.rows[0].id;
            } else {
                // If conversation ID not provided and none exists, create a new conversation in canonical order
                const conversation = await db.query('INSERT INTO conversations ("senderId", "receiverId") VALUES ($1, $2) RETURNING id', [p1, p2]);
                newConversationId = conversation.rows[0].id;
            }
        }

        // Insert message into messages table
        const message = await db.query(`
            INSERT INTO messages ("conversationId", "senderId", "recipientId", content, "messageType", metadata, event) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *;
        `, [newConversationId, authSenderId, receiverId, content, msgType, metadata || null, event || null]);

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

        // Get all conversations for the user with last message preview and ordering by most recent activity
        const conversations = await db.query(`
            SELECT c.*, lm.content AS last_message_content, lm."updated_at" AS last_message_updated_at
            FROM conversations c
            LEFT JOIN LATERAL (
                SELECT m.content, m."updated_at"
                FROM messages m
                WHERE m."conversationId" = c.id
                ORDER BY m."updated_at" DESC NULLS LAST
                LIMIT 1
            ) lm ON true
            WHERE c."senderId" = $1 OR c."receiverId" = $1
            ORDER BY COALESCE(lm."updated_at", c."updated_at", c."created_at") DESC
        `, [userId]);

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

        // Update the message using parameterized placeholders
        const updatedMessage = await db.query(`
            UPDATE messages
            SET ${updateFields.map((field, index) => `"${field}" = $${index + 1}`).join(', ')}
            WHERE id = $${updateValues.length}
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


exports.getUnreadCount = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }
        const result = await db.query(
            'SELECT COUNT(*)::int AS count FROM messages WHERE "recipientId" = $1 AND "is_read" = FALSE',
            [userId]
        );
        const count = (result.rows && result.rows[0] && (result.rows[0].count ?? 0)) || 0;
        return res.status(200).json({ success: true, count });
    } catch (error) {
        req.logger && req.logger.error && req.logger.error('Error getting unread count:', error.message);
        console.error('Error getting unread count:', error.message);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

exports.getUnreadCountsByConversation = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }
        const result = await db.query(`
            SELECT "conversationId", COUNT(*)::int AS count
            FROM messages
            WHERE "recipientId" = $1 AND "is_read" = FALSE
            GROUP BY "conversationId"
        `, [userId]);
        const rows = result.rows || [];
        return res.status(200).json({ success: true, unreadCounts: rows });
    } catch (error) {
        req.logger && req.logger.error && req.logger.error('Error getting unread counts by conversation:', error.message);
        console.error('Error getting unread counts by conversation:', error.message);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

exports.markConversationRead = async (req, res) => {
    const { id: conversationId } = req.params;

    try {
        const userId = req.user && req.user.id;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }
        if (!conversationId) {
            return res.status(400).json({ success: false, error: 'Conversation ID is required' });
        }

        // Validate conversation and membership
        const conv = await db.query('SELECT id, "senderId", "receiverId" FROM conversations WHERE id = $1', [conversationId]);
        if (!conv.rows.length) {
            return res.status(404).json({ success: false, error: 'Conversation not found' });
        }
        const row = conv.rows[0];
        const isParticipant = (row.senderId === userId) || (row.receiverId === userId);
        if (!isParticipant) {
            return res.status(403).json({ success: false, error: 'Not a participant of the conversation' });
        }

        const updated = await db.query(
            'UPDATE messages SET "is_read" = TRUE, "updated_at" = NOW() WHERE "conversationId" = $1 AND "recipientId" = $2 AND "is_read" = FALSE',
            [conversationId, userId]
        );
        const updatedCount = updated.rowCount || 0;
        req.logger && req.logger.info && req.logger.info(`Marked ${updatedCount} messages as read in conversation ${conversationId} for user ${userId}`);
        
        // Broadcast unread count update if messages were marked as read
        if (updatedCount > 0) {
            try {
                // Get updated unread counts by conversation
                const unreadResult = await db.query(`
                    SELECT "conversationId", COUNT(*)::int AS count
                    FROM messages
                    WHERE "recipientId" = $1 AND "is_read" = FALSE
                    GROUP BY "conversationId"
                `, [userId]);
                
                // Get total unread count
                const totalResult = await db.query(`
                    SELECT COUNT(*)::int AS total
                    FROM messages
                    WHERE "recipientId" = $1 AND "is_read" = FALSE
                `, [userId]);
                
                const unreadCounts = unreadResult.rows || [];
                const totalUnread = totalResult.rows[0]?.total || 0;
                
                broadcastUnreadUpdate(userId, {
                    totalUnread,
                    unreadCounts,
                    conversationId: parseInt(conversationId)
                });
            } catch (broadcastError) {
                req.logger && req.logger.error && req.logger.error('Error broadcasting unread update:', broadcastError.message);
            }
        }
        
        return res.status(200).json({ success: true, updated: updatedCount });
    } catch (error) {
        req.logger && req.logger.error && req.logger.error('Error marking conversation read:', error.message);
        console.error('Error marking conversation read:', error.message);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

exports.markAllMessagesRead = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }
        const updated = await db.query(
            'UPDATE messages SET "is_read" = TRUE, "updated_at" = NOW() WHERE "recipientId" = $1 AND "is_read" = FALSE',
            [userId]
        );
        const updatedCount = updated.rowCount || 0;
        req.logger && req.logger.info && req.logger.info(`Marked ${updatedCount} messages as read for user ${userId}`);
        
        // Broadcast unread count update if messages were marked as read
        if (updatedCount > 0) {
            try {
                broadcastUnreadUpdate(userId, {
                    totalUnread: 0,
                    unreadCounts: [],
                    allRead: true
                });
            } catch (broadcastError) {
                req.logger && req.logger.error && req.logger.error('Error broadcasting unread update:', broadcastError.message);
            }
        }
        
        return res.status(200).json({ success: true, updated: updatedCount });
    } catch (error) {
        req.logger && req.logger.error && req.logger.error('Error marking all messages read:', error.message);
        console.error('Error marking all messages read:', error.message);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};