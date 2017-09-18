var middlewareObj = {};
var Camp = require('../models/camp'),
    Comment = require('../models/comment');
//
middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
}

//
middlewareObj.isAuthCamp = function(req, res, next) {
    if (req.isAuthenticated()) {
        Camp.findById(req.params.id, function(err, found) {
            if (err) {
                req.flash("error", "Campground not found.");
                res.redirect("back");
            }
            else {
                if (!found) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
                //
                if (found.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                }
                else {
                    req.flash("error", "Permission denied.");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash("error", "You must be logged in.");
        res.redirect("back");
    }
}
//
middlewareObj.isAuthComment = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id,
            function(err, found) {
                if (err) {
                    res.redirect("back")
                    req.flash("error", "Comment not found.");
                }
                else {
                    if (!found) {
                        req.flash("error", "Item not found.");
                        return res.redirect("back");
                    }
                    //
                    if (found.author.id.equals(req.user._id) || req.user.isAdmin) {
                        next();
                    }
                    else {
                        req.flash("error", "Permission denied.");
                        res.redirect("back");
                    }
                }
            });
    }
    else {
        req.flash("error", "Authentication failed.");
        res.redirect("back");
    }
}

//
middlewareObj.capitalize = function(str) {
    return str.replace(/\w\S*/g, function(txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}


module.exports = middlewareObj;
