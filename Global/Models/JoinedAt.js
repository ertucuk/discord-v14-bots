const { Schema, model } = require("mongoose");

const VoiceJoinedAt = Schema({
  userID: String,
  Date: Number,
});

module.exports = model("VoiceJoinedAt", VoiceJoinedAt);