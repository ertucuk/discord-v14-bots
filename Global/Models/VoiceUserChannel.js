const { Schema, model } = require("mongoose");

const VoiceUserChannel = Schema({
    guildID: String,
    userID: String,
    ChannelID: String,
    ChannelData: { type: Number, default: 0 },
});

module.exports = model("VoiceUserChannel", VoiceUserChannel);