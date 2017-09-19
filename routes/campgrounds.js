var express = require('express');
var router = express.Router();
var geocoder = require('geocoder');
var Camp = require('../models/camp');
var Comment = require('../models/comment');
var middleware = require('../middleware');
var { isLoggedIn, isAuthCamp, isAuthComment, isAdmin, isSafe } = middleware;

// Define escapeRegex function for search feature
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

// Campgrounds INDEX
router.get("/", function(req, res) {
    if (req.query.search && req.xhr) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all campgrounds from DB
        Camp.find({ name: regex }, function(err, found) {
            if (err) {
                console.log(err);
            }
            else {
                res.status(200).json(found);
            }
        });
    }
    else {
        Camp.find({}, function(err, db) {
            if (err || !db) {
                console.log(err);
                req.flash("error", err.message);
                res.redirect("back");
            }
            else
                res.render("campgrounds/index", { page: 'campgrounds', campgrounds: db, currentUser: req.user });
        });
    }
});

// Campgrounds CREATE
router.post("/", isLoggedIn, isSafe, function(req, res) {
    // get data from form & add to campgrounds arr
    geocoder.geocode(req.body.loc, function(err, data) {
        if (err) {}
        var geoObj = {
            lat: data.results[0].geometry.location.lat,
            lng: data.results[0].geometry.location.lng,
            address: data.results[0].formatted_address
        };
        var author = { id: req.user._id, username: req.user.username };
        var newCamp = { name: middleware.capitalize(req.body.name), image: req.body.image, desc: req.body.desc, price: req.body.price, location: geoObj, author: author };
        Camp.create(newCamp, function(err, db) {
            if (err || !db) {
                console.log(err);
                req.flash("error", err.message);
                res.redirect("back");
            }
            else {
                req.flash("success", "Campground successfully created!");
                res.redirect("/campgrounds");
            }
        });
    });
});

// Campgrounds NEW 
router.get("/new", isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// Campgrounds SHOW 
router.get("/:id", function(req, res) {
    Camp.findById(req.params.id).populate("comments").exec(function(err, found) {
        if (err || !found) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        }
        else {
            res.render("campgrounds/show", { camp: found });
        }
    });
});

// Campgrounds EDIT
router.get("/:id/edit", isLoggedIn, isAuthCamp, function(req, res) {
    Camp.findById(req.params.id, function(err, found) {
        if (err || !found) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("/campgrounds");
        }
        else {
            res.render('campgrounds/edit', { camp: found });
        }
    });
});

// Campgrounds UPDATE
router.put("/:id", isLoggedIn, isAuthCamp, isSafe, function(req, res) {
    geocoder.geocode(req.body.loc, function(err, data) {
        if (err) {}
        var geoObj = {
            lat: data.results[0].geometry.location.lat,
            lng: data.results[0].geometry.location.lng,
            address: data.results[0].formatted_address
        };
        var newData = { name: middleware.capitalize(req.body.name), image: req.body.image, desc: req.body.desc, price: req.body.price, location: geoObj };
        Camp.findByIdAndUpdate(req.params.id, { $set: newData }, function(err, found) {
            if (err || !found) {
                console.log(err);
                req.flash("error", err.message);
                res.redirect("/campgrounds");
            }
            else {
                req.flash("success", "Campground updated!");
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
    });
});

// Campgrounds DESTROY
router.delete("/:id", isLoggedIn, isAuthCamp, function(req, res) {
    Comment.remove({
        _id: {
            $in: req.camp.comments
        }
    }, function(err) {
        if (err) {
            req.flash('error', err.message);
            res.redirect('/');
        }
        else {
            req.camp.remove(function(err) {
                if (err) {
                    req.flash('error', err.message);
                    return res.redirect('/');
                }
                req.flash('error', 'Campground deleted!');
                res.redirect('/campgrounds');
            });
        }
    });
    // Camp.findByIdAndRemove(req.params.id, function(err) {
    //     if (err) {
    //         req.flash("error", err.message);
    //         res.redirect("/campgrounds");
    //     }
    //     else {
    //         req.flash("success", "Campground successfully deleted!");
    //         res.redirect("/campgrounds");
    //     }
    // });
});



module.exports = router;
