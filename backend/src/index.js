const express = require('express');
const { PORT, CLIENT_URL } = require('./constants');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const cors = require('cors');
const helmet = require('helmet');
const app = express();


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

const appStart = () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
}

appStart();