const winston = require('winston');

// Define a custom filter function to exclude WebSocket polling requests
const excludeWebSocketPolling = winston.format((info, opts) => {
  // Check if the message is a WebSocket polling request
  if (info.message.includes('/ws/socket.io/?EIO=4&transport=polling')) {
      // Exclude the message from being logged
      return false;
  }
  return info;
});

// Initialize Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      excludeWebSocketPolling(), // Apply custom filter function
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss', // Customize timestamp format
      }),
      winston.format.json()
    ),
    defaultMeta: { service: 'Blood+_Backend' },
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
});

module.exports = logger;
