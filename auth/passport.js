const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User')
const helper = require('./helper')

passport.serializeUser((user, callback) => {
    // user.id is stored in the session
    callback(null, user.id);
});

passport.deserializeUser((id, callback) => {
    // uses user.id stored in the session to retrieve the entire user object
    User.findById(id, (error, user) => {
        callback(error, user);
    });
});

passport.use(
    new LocalStrategy({
        usernameField: 'email'
    }, async function (email, password, callback) {
        user = await User.findOne({email: email});
        if (!user) {
            return callback(null, false, { message: 'Incorrect username.' })
        }
        
        helper.checkPassword(password, user.password, function (isValidated) {
            if (isValidated) {
                return callback(null, user);
            }
            else {
                return callback(null, false, { message: 'Incorrect password.' });
            }
        });
    })
);

module.exports = passport;