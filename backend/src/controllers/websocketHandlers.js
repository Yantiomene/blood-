const logger = require('../logger');

// Function to handle WebSocket messages
exports.handleWebSocketMessages = (ws) => {

    ws.on('error', (error) => {
        logger.error(`WebSocket error: ${error.message}`);
    });

    ws.on('message', (message) => {
        // Be careful logging messages - they might contain sensitive data
        logger.info(`Received message from client (length: ${message.length})`);
        ws.send(`Received message: ${message}`)
    });

    ws.on('close', () => {
        logger.info('WebSocket Client disconnected');
    });
}