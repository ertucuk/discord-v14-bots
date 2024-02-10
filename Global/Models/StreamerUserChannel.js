const { Schema, model } = require("mongoose");

const StreamerUserChannel = Schema({
    guildID: String,
    userID: String,
    ChannelID: String,
    ChannelData: Number,
});

module.exports = model("StreamerUserChannel", StreamerUserChannel);