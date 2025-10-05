const passport = require('passport');
const { Strategy } = require('passport-jwt');
const { SECRET } = require('../constants');
const db = require('../db');


const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['token'];
    }
    return token;
}

const opts = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: SECRET
}

passport.use(
    new Strategy(opts, async ({ id }, done) => {
        try {
            const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
            
            if (!rows.length) {
                throw new Error('401 not authorized');
            }
            const user = { 
                id: rows[0].id, 
                username: rows[0].username, 
                email: rows[0].email, 
                location: rows[0].location,
                contactNumber: rows[0].contactNumber,
                bloodType: rows[0].bloodType,
                isDonor: rows[0].isDonor,
                // include verification status so routes can enforce gating
                isVerified: rows[0].isVerified,
            };
            return await done(null, user);
        } catch (error) {
            console.log(error.message);
            done(null, false);
        }
    })
)