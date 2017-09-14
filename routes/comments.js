var express = require('express'),
    router = express.Router({ mergeParams: true });
var Camp = require('../models/camp'),
    Comment = require('../models/comment'),
    middleware = require('../middleware');

// Comment NEW 
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Camp.findById(req.params.id).populate("comments").exec(function(err, found) {
        if (err)
            res.render('back', { error: err.message });
        else {
            res.render("comments/new", { camp: found });
        }
    });
});

// Comments CREATE
router.post("/", middleware.isLoggedIn, function(req, res) {
    // get data from form & add to comments
    Camp.findById(req.params.id, function(err, found) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("/campgrounds");
        }
        else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    req.flash("error", "Something went wrong.");
                    res.redirect("back");
                }
                else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    found.comments.push(comment);
                    found.save();
                    req.flash("success", "Comment added!");
                    res.redirect("/campgrounds/" + found._id);
                }
            });
        }
    });
});

// Comment EDIT
router.get("/:comment_id/edit", middleware.isAuthComment, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, found) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        }
        else {
            if (!found) {
                req.flash("error", "Item not found.");
                return res.redirect("back");
            }
            res.render('comments/edit', { comment: found, camp_id: req.params.id });
        }
    });
});

// Comment UPDATE
router.put("/:comment_id", middleware.isAuthComment, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, found) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        }
        else {
            req.flash("success", "Comment updated!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Comment DESTROY
router.delete("/:comment_id", middleware.isAuthComment, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        }
        else {
            req.flash("success", "Comment deleted!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


module.exports = router;
