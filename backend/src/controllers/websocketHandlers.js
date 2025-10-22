const logger = require('../logger');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../constants');
const db = require('../db');

// Store authenticated connections by userId
const userConnections = new Map();

// Function to authenticate WebSocket connection using JWT from query params
const authenticateWebSocket = async (url) => {
    try {
        const urlObj = new URL(url, 'ws://localhost');
        const token = urlObj.searchParams.get('token');
        
        if (!token) {
            throw new Error('No token provided');
        }

        const decoded = jwt.verify(token, SECRET);
        const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
        
        if (!rows.length) {
            throw new Error('User not found');
        }

        return {
            id: rows[0].id,
            username: rows[0].username,
            email: rows[0].email,
            isVerified: rows[0].isVerified
        };
    } catch (error) {
        logger.error(`WebSocket authentication failed: ${error.message}`);
        return null;
    }
};

// Broadcast unread count update to specific user
const broadcastUnreadUpdate = (userId, unreadCounts) => {
    const connections = userConnections.get(userId);
    if (connections && connections.size > 0) {
        const message = JSON.stringify({
            type: 'unread_update',
            payload: unreadCounts
        });
        
        connections.forEach(ws => {
            if (ws.readyState === 1) { // WebSocket.OPEN
                ws.send(message);
            }
        });
        
        logger.info(`Broadcasted unread update to user ${userId}: ${connections.size} connections`);
    }
};

// Broadcast presence update to all connected users
const broadcastPresenceUpdate = (userId, status) => {
    const payload = JSON.stringify({
        type: 'presence_update',
        payload: { userId, status }
    });
    let total = 0;
    userConnections.forEach((conns) => {
        conns.forEach((ws) => {
            if (ws.readyState === 1) {
                ws.send(payload);
                total++;
            }
        });
    });
    logger.info(`Broadcasted presence ${status} for user ${userId} to ${total} sockets`);
};

// Broadcast a payload to a set of userIds
const broadcastToUsers = (userIds, type, data) => {
    const msg = JSON.stringify({ type, payload: data });
    userIds.forEach((uid) => {
        const conns = userConnections.get(uid);
        if (conns && conns.size > 0) {
            conns.forEach((ws) => {
                if (ws.readyState === 1) {
                    ws.send(msg);
                }
            });
        }
    });
};

// Function to handle WebSocket messages
exports.handleWebSocketMessages = (ws, req) => {
    let authenticatedUser = null;

    // Authenticate the connection
    authenticateWebSocket(req.url).then(user => {
        if (!user) {
            ws.send(JSON.stringify({ type: 'error', message: 'Authentication failed' }));
            ws.close();
            return;
        }

        authenticatedUser = user;
        
        // Add connection to user's connection set
        if (!userConnections.has(user.id)) {
            userConnections.set(user.id, new Set());
        }
        userConnections.get(user.id).add(ws);
        
        logger.info(`WebSocket authenticated for user ${user.id} (${user.username})`);
        
        // Send authentication success
        ws.send(JSON.stringify({ 
            type: 'auth_success', 
            message: 'Connected successfully',
            userId: user.id 
        }));

        // Broadcast presence online for this user
        broadcastPresenceUpdate(user.id, 'online');

        // Send snapshot of current online users to this socket
        try {
            const snapshot = Array.from(userConnections.keys());
            ws.send(JSON.stringify({ type: 'presence_snapshot', payload: { onlineUserIds: snapshot } }));
        } catch (e) {
            logger.warn(`Failed to send presence snapshot: ${e.message}`);
        }

    }).catch(error => {
        logger.error(`WebSocket authentication error: ${error.message}`);
        ws.send(JSON.stringify({ type: 'error', message: 'Authentication failed' }));
        ws.close();
    });

    ws.on('error', (error) => {
        logger.error(`WebSocket error: ${error.message}`);
    });

    ws.on('message', (message) => {
        // Validate message size and content
        if (message.length > 1024) {
            logger.warn(`Message too large: ${message.length} bytes`);
            ws.send(JSON.stringify({ type: 'error', message: 'Message too large' }));
            return;
        }
        
        try {
            const data = JSON.parse(message);
            
            // Handle different message types
            switch (data.type) {
                case 'subscribe_unread':
                    // Client is subscribing to unread count updates
                    ws.send(JSON.stringify({ 
                        type: 'subscribed', 
                        message: 'Subscribed to unread updates' 
                    }));
                    break;
                case 'subscribe_presence':
                    ws.send(JSON.stringify({ type: 'subscribed', message: 'Subscribed to presence updates' }));
                    break;
                case 'ping':
                    // Heartbeat
                    ws.send(JSON.stringify({ type: 'pong' }));
                    break;
                default:
                    logger.info(`Received message from client: ${data.type}`);
                    ws.send(JSON.stringify({ 
                        type: 'ack', 
                        message: 'Message received successfully' 
                    }));
            }
        } catch (error) {
            logger.warn(`Invalid JSON message: ${error.message}`);
            ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
        }
    });

    ws.on('close', () => {
        if (authenticatedUser) {
            // Remove connection from user's connection set
            const connections = userConnections.get(authenticatedUser.id);
            if (connections) {
                connections.delete(ws);
                if (connections.size === 0) {
                    userConnections.delete(authenticatedUser.id);
                    // Broadcast offline when last connection is gone
                    broadcastPresenceUpdate(authenticatedUser.id, 'offline');
                }
            }
            logger.info(`WebSocket disconnected for user ${authenticatedUser.id}`);
        } else {
            logger.info('WebSocket Client disconnected (unauthenticated)');
        }
    });
};

// Export the broadcast functions for use in other modules
exports.broadcastUnreadUpdate = broadcastUnreadUpdate;
exports.broadcastPresenceUpdate = broadcastPresenceUpdate;
exports.broadcastToUsers = broadcastToUsers;