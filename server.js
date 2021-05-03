// add required packages for the server
const express = require('express');
const passport = require("passport");
const app = express();
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const mongoose = require("mongoose")

// adding/importing routes
const auth = require('./routes/userAuth');
const posts = require('./routes/posts');
const marketplace = require('./routes/marketplace');

// adding constants
const PORT = process.env.PORT || 3001;
// not a good practice to hardcode the MONGO_URI, but this is for demo purposes
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://admin:ShopifyDevChallenge@cluster.p19lv.mongodb.net/shopify?retryWrites=true&w=majority"

// connecting to mongodb
mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
.then(console.log("MongoDB is connected"))
.catch(error => console.log(error));

// initialize parsing of JSON bodies
app.use(express.json())
app.use(express.urlencoded({extended: true}));

// intiailize session storage
app.use(
    session({
        secret: 'secret key here',
        resave: false,
        saveUninitialized: true,
        // using MongoDB for storing user sessions
        // alternative: Redis for faster retrievals of session data
        store: new MongoStore({mongooseConnection: mongoose.connection, collection: 'sessions'})
    })
)

// initialize template rendering using .ejs under /views
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));

// initialize passport.js
app.use(passport.initialize());
app.use(passport.session());

// initilize API routes
app.use(auth)
app.use(posts)
app.use(marketplace)

// starting the server
module.exports = app.listen(PORT, () => {
    console.log(`Server listening on localhost:${PORT}`);
});
