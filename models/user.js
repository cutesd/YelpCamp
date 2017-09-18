var mongoose = require('mongoose');
var mongoosepass = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: { type: Boolean, default: false }
});

userSchema.plugin(mongoosepass);
module.exports = mongoose.model("User", userSchema);
