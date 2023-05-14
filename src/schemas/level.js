const { Schema, model } = require("mongoose");

const voiceStatsSchema = Schema({
    guildID: { type: String, default: "" },
    userID: { type: String, default: "" },
    voiceXP: {type: Number, default: 0},
    messageXP: {type: Number, default: 0},
    voiceLevel: {type: Number, default: 1},
    messageLevel: {type: Number, default: 1},
    autoRankup: {type: Array, default: []}
});

module.exports = model("level", voiceStatsSchema);