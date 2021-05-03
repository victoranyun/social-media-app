const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passportconfig = require('../auth/passport');

// POST /register
// registering account into mongodb
router.post('/register', (req, res, next) => {
    const registeredUser = new User({
        email: req.body.email,
        password: req.body.password,
        name: req.body.name
    });
    bcrypt.genSalt(12, (error, salt) => {
        if (error) {
            throw error;
        }
        bcrypt.hash(registeredUser.password, salt, (error, hash) => { // hashing the password
            if (error) {
                throw error;
            }
            else {
                registeredUser.password = hash;
            }
            registeredUser.save().then(user => {
            }).catch(error => {console.log(error)});
        });
    });
    res.redirect('/login');
});

// POST /login
// logging in via passport.js, stores user in session
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/', failureRedirect: '/login', failureFlash: false
    })(req, res, next);
});

// GET /login
// renders the login page
router.get('/login', (req, res, next) => {
    if (req.user != null) {
        res.redirect('/');
    } else {
        res.render('login');
    }
});

// GET /logout
// clears the session and redirects back to the login page
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

module.exports = router;