const { Schema, model } = require("mongoose");

const ch = new Schema({
    guildId: { type: String, default: "" },
    type: { type: String, default: "" },
    channelID: { type: String, default: "" },
    name: { type: String, default: "" },
    position: { type: Number, default: 0 },
    writes: { type: Array, default: [] },
    nsfw: { type: Boolean, default: false },
    parentID: { type: String, default: "" },
    rateLimit: { type: Number, default: 0 },
    bitrate: { type: Number, default: 0 },
    userLimit: { type: Number, default: 0 },
});

module.exports = model("channelBackupSchema", ch);