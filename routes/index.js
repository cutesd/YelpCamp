var express = require('express'),
    passport = require('passport'),
    router = express.Router();
var User = require('../models/user');

// root
router.get("/", function(req, res) {
    res.render('landing');
});

// ========== AUTH ==================//
// Register SHOW
router.get("/register", function(req, res) {
    res.render('register');
});

// Register CREATE
router.post("/register", function(req, res) {
    User.register(new User({ username: req.body.username }), req.body.password, function(err, user) {
        if (err) {
            return res.render('register', { error: err.message });
        }
        // authenticate using local strategy
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to Yelp Camp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// LogIn SHOW
router.get("/login", function(req, res) {
    res.render('login');
});

// LogIn CREATE
router.post('/login', passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/register"
}), function(req, res) {});

// LogOut SHOW
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "You successfully signed out!");
    res.redirect("/campgrounds");
});


module.exports = router;
