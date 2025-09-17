const logger = require('../logger');

// Function to handle WebSocket messages
exports.handleWebSocketMessages = (ws) => {

    ws.on('message', (message) => {
        logger.info(`Received message from client: ${message}`);
        ws.send(`Received message: ${message}`)
    });

    ws.on('close', () => {
        logger.info('WebSocket Client disconnected');
    });
}