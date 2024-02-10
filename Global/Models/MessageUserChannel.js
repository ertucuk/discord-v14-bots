const { Schema, model } = require("mongoose");

const MessageUserChannel = Schema({
    guildID: String,
    userID: String,
    ChannelID: String,
    ChannelName: String,
    ChannelData: { type: Number, default: 0 },
});

module.exports = model("MessageUserChannel", MessageUserChannel);