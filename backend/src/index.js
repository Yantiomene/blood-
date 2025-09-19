const express = require('express');
const { PORT, CLIENT_URL } = require('./constants');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./logger');
const { WebSocketServer } = require('ws');
const { handleWebSocketMessages } = require('./controllers/websocketHandlers');
const http = require('http');
const app = express();


// Log incoming requests
app.use((req, res, next) => {
    req.logger = logger;
    req.logger.info(`Request: ${req.method} ${req.url}`);
    next();
});

// Import validations middleware
require('./middlewares/validations-middleware');

// import passport middleware
require('./middlewares/passport-middleware');

// impoort routes
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogsRoute');
const messageRoutes = require('./routes/messagesRoute');

//initialize middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}))
app.use(helmet());
app.use(passport.initialize());

// initialize routes
app.use('/api', authRoutes);
app.use('/blogs', blogRoutes);
app.use('/api', messageRoutes);


// Log errors
app.use((err, req, res, next) => {
    req.logger.error(err.stack);
    res.status(500).send('Something went wrong!');
});


// Handle not found routes
app.use((req, res) => {
    res.status(404).send('Route not found');
});


// Create HTTP server using Express app
const server = http.createServer(app);

// Initialize WebSocket server (skip in test env)
let wss = null;
if (process.env.NODE_ENV !== 'test') {
  wss = new WebSocketServer({ server });
  
  wss.on('error', (error) => {
    logger.error('WebSocket Server error:', error);
  });
  
  wss.on('connection', (ws) => {
      logger.info('WebSocket Client connected');
      
      ws.on('error', (error) => {
        logger.error('WebSocket connection error:', error);
      });

      // Handle WebSocket messages
      handleWebSocketMessages(ws);
  });
}

// Start the server (skip in test environment to avoid port conflicts)
if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
  });
}

// Expose server on app for tests and export app for supertest
app.server = server;
module.exports = app;

/*const appStart = () => {
    try {
        const server = app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });

        app.server = server;
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
}

appStart();*/
