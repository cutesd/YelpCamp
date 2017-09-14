var mongoose = require('mongoose');
var mongoosepass = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(mongoosepass);
module.exports = mongoose.model("User", userSchema);
