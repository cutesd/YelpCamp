var express = require('express'),
    app = express(),
    parser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require('passport'),
    cookieParser = require('cookie-parser'),
    LocalStrategy = require('passport-local'),
    flash = require('connect-flash'),
    Camp = require('./models/camp'),
    Comment = require('./models/comment'),
    User = require('./models/user'),
    seedDB = require('./seeds'),
    methodor = require('method-override');

// config dotenv
require('dotenv').load();

// routes
var commentRoutes = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes = require('./routes/index');

// database
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASEURL, { useMongoClient: true })
    .then(() => console.log(process.env.DATABASEURL + ': Database connected'))
    .catch(err => console.log('Database connection error: ${err.message}'));

// app config
app.use(parser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(methodor("_method"));
app.use(cookieParser('secret'));

// require moment
app.locals.moment = require('moment');
//seedDB();// seed the database


// PASSPORT CONFIG
app.use(require("express-session")({
    // decoder value (can be anything)
    secret: "i know my chicken you got to know your chicken",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


// 
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("server is running");
});
