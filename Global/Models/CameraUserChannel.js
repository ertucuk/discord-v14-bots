const { Schema, model } = require("mongoose");

const CameraUserChannel = Schema({
    guildID: String,
    userID: String,
    ChannelID: String,
    ChannelData: Number,
});

module.exports = model("CameraUserChannel", CameraUserChannel);
