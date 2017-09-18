var express = require('express'),
    parser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require('connect-flash'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    goosepass = require('passport-local-mongoose'),
    methodor = require('method-override'),
    exSanitizer = require('express-sanitizer'),
    Camp = require('./models/camp'),
    Comment = require('./models/comment'),
    User = require('./models/user'),
    seedDB = require('./seeds');

// ROUTES
var commentRoutes = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes = require('./routes/index');

console.log(process.env.DATABASEURL);

// DB CONFIG
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASEURL, { useMongoClient: true });

// APP CONFIG
var app = express();
app.use(parser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(parser.urlencoded({ extended: true }));
app.use(methodor("_method"));
app.use(exSanitizer());
app.use(flash());
app.set('view engine', 'ejs');
// SEED THE DB //seedDB();
app.locals.moment = require('moment');


// PASSPORT CONFIG
app.use(require("express-session")({
    // decoder value (can be anything)
    secret: "i know my chicken you got to know your chicken",
    resave: false,
    saveUninitialized: false
}));
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


// USE ROUTES
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);



// 
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("server is running");
});
