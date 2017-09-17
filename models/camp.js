var mongoose = require("mongoose");

var campSchema = new mongoose.Schema({
    name: String,
    image: String,
    desc: String,
    price: String,
    location: {
        lat: Number,
        lng: Number,
        address: String
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});
module.exports = mongoose.model("Camp", campSchema);
