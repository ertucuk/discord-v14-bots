const { Schema, model } = require("mongoose");

const schema = Schema({
  guildID: String,
  messageListID: {type: String, default: ""},
  voiceListID: {type: String, default: ""}
});

module.exports = model("leaderboard", schema);
