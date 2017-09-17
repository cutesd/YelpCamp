var express = require('express');
var router = express.Router();
var geocoder = require('geocoder');
var Camp = require('../models/camp');
var Comment = require('../models/comment');
var middleware = require('../middleware');

// Campgrounds INDEX
router.get("/", function(req, res) {
    Camp.find({}, function(err, db) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        }
        else
            res.render("campgrounds/index", { page: 'campgrounds', campgrounds: db, currentUser: req.user });
    });
});

// Campgrounds CREATE
router.post("/", [middleware.isLoggedIn, geocode], function(req, res) {
    // get data from form & add to campgrounds arr
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCamp = {
        name: middleware.capitalize(req.body.name),
        image: req.body.img,
        desc: req.body.desc,
        price: req.body.price,
        location: geoObj,
        author: author
    };
    Camp.create(newCamp, function(err, db) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        }
        else {
            req.flash("success", "Campground successfully created!");
            res.redirect("/campgrounds");
        }
    });

});

// Campgrounds NEW 
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// Campgrounds SHOW 
router.get("/:id", function(req, res) {
    Camp.findById(req.params.id).populate("comments").exec(function(err, found) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        }
        else {
            if (!found) {
                req.flash("error", "Item not found.");
                return res.redirect("back");
            }
            res.render("campgrounds/show", { camp: found });
        }
    });
});

// Campgrounds EDIT
router.get("/:id/edit", middleware.isAuthCamp, function(req, res) {
    Camp.findById(req.params.id, function(err, found) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("/campgrounds");
        }
        else {
            if (!found) {
                req.flash("error", "Item not found.");
                return res.redirect("back");
            }
            res.render('campgrounds/edit', { camp: found });
        }
    });
});

// Campgrounds UPDATE
router.put("/:id", [middleware.isAuthCamp, geocode], function(req, res) {
    var newCamp = req.body.camp;
    newCamp.name = middleware.capitalize(newCamp.name);
    newCamp.location = geoObj;
    Camp.findByIdAndUpdate(req.params.id, newCamp, function(err, found) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("/campgrounds");
        }
        else {
            req.flash("success", "Campground updated!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Campgrounds DESTROY
router.delete("/:id", middleware.isAuthCamp, function(req, res) {
    Camp.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("/campgrounds");
        }
        else {
            req.flash("success", "Campground successfully deleted!");
            res.redirect("/campgrounds");
        }
    });
});

var geoObj = {};

function geocode(req, res, next) {
    geocoder.geocode(req.body.loc, function(err, data) {
        if (err) {
            console.log(err);
        }
        else {
            geoObj.lat = data.results[0].geometry.location.lat;
            geoObj.lng = data.results[0].geometry.location.lng;
            geoObj.address = data.results[0].formatted_address;
            next();
        }
    });
}


module.exports = router;
