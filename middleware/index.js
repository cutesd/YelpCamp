var Camp = require('../models/camp'),
    Comment = require('../models/comment');
//
module.exports = {
    isLoggedIn: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash("error", "Please Login First!");
        res.redirect("/login");
    },

    //
    isAuthCamp: function(req, res, next) {
        Camp.findById(req.params.id, function(err, found) {
            if (err || !found) {
                console.log(err);
                req.flash("error", "Campground not found.");
                res.redirect("back");
            }
            else if (found.author.id.equals(req.user._id) || req.user.isAdmin) {
                req.camp = found;
                next();
            }
            else {
                req.flash("error", "Permission denied.");
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
    },
    //
    isAuthComment: function(req, res, next) {
        Comment.findById(req.params.comment_id,
            function(err, found) {
                if (err || !found) {
                    console.log(err);
                    req.flash("error", "Comment not found.");
                    res.redirect("back");
                }
                else if (found.author.id.equals(req.user._id) || req.user.isAdmin) {
                    req.comment = found
                    next();
                }
                else {
                    req.flash("error", "Permission denied.");
                    res.redirect("back");
                }
            });
    },
    //
    isAdmin: function(req, res, next) {
        if (req.user.isAdmin) {
            next();
        }
        else {
            req.flash('error', 'This site is now read only thanks to spam and trolls.');
            res.redirect('back');
        }
    },
    //
    isSafe: function(req, res, next) {
        if (req.body.image.match(/^https:\/\/images\.unsplash\.com\/.*/)) {
            next();
        }
        else {
            req.flash('error', 'Only images from images.unsplash.com allowed.\nSee https://youtu.be/Bn3weNRQRDE for how to copy image urls from unsplash.');
            res.redirect('back');
        }
    },

    //
    capitalize: function(str) {
        return str.replace(/\w\S*/g, function(txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    }

}
