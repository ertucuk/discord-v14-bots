const { Schema, model } = require("mongoose");

const guardSchema = new Schema({
    guildId:        { type: String, default: "" },
    whitelist:      { type: Array, default: [] },
    roleGuard:      { type: Boolean, default: true },
    channelGuard:   { type: Boolean, default: true },
    botGuard:       { type: Boolean, default: true },
    guildGuard:     { type: Boolean, default: true },
    webGuard:       { type: Boolean, default: true },
    emojiGuard:     { type: Boolean, default: true },
    stickerGuard:   { type: Boolean, default: true },
    otherGuard:     { type: Boolean, default: true },
    everyoneGuard:  { type: Boolean, default: true },
    urlGuard:       { type: Boolean, default: true },
});

module.exports = model("guardSchemaDeneme", guardSchema);