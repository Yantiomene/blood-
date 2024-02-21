const winston = require('winston');

// Initialize Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
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
