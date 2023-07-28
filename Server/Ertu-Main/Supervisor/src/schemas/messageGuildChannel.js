const { Schema, model } = require("mongoose");

const schema = Schema({
  guildID: String,
  channelID: String,
  channelData: { type: Number, default: 0 },
});

module.exports = model("messageGuildChannel", schema);
