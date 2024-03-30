const mongoose = require('mongoose');

const VoiceChannels = mongoose.model("Voice", mongoose.Schema({
    channelID: String,
    name: String,
    bitrate: Number,
    parentID: String,
    position: Number,
    userLimit: Number,
    overwrites: Array,
}));

module.exports = VoiceChannels