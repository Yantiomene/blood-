const express = require('express');
const { PORT, CLIENT_URL } = require('./constants');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./logger');
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


// Log errors
app.use((err, req, res, next) => {
    req.logger.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Export the app object
//module.exports = app;

const appStart = () => {
    try {
        const server = app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });

        app.server = server;
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
}

appStart();

// Start the server only if this file is the main module
/*if (require.main === module) {
    try {
        const server = app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });

        app.server = server;
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
  }*/