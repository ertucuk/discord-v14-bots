const mongoose = require('mongoose');

const channel = mongoose.model("Category", mongoose.Schema({
    channelID: String,
    name: String,
    position: Number,
    overwrites: Array,
}));

module.exports = channel