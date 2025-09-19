const logger = require('../logger');

// Function to handle WebSocket messages
exports.handleWebSocketMessages = (ws) => {

    ws.on('error', (error) => {
        logger.error(`WebSocket error: ${error.message}`);
    });

    ws.on('message', (message) => {
        // Validate message size and content
        if (message.length > 1024) {
            logger.warn(`Message too large: ${message.length} bytes`);
            ws.send('Error: Message too large');
            return;
        }
        
        logger.info(`Received message from client (length: ${message.length})`);
        // Send acknowledgment instead of echoing raw content
        ws.send('Message received successfully');
    });

    ws.on('close', () => {
        logger.info('WebSocket Client disconnected');
    });
}