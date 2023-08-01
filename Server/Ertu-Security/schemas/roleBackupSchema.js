const { Schema, model } = require("mongoose");

const n = new  Schema({
    guildId: { type: String, default: "" },
    id: { type: String, default: "" },
    name: { type: String, default: "" },
    color: { type: String, default: "" },
    permissionOverwrites: { type: Array, default: [] },
    members: { type: Array, default: [] },
    permissions: { type: Number, default: 0 },
    position: { type: Number, default: 0 },
    hoist: { type: Boolean, default: false }, 
    mentionable: { type: Boolean, default: false }
});

module.exports = model("roleBackupSchema", n);