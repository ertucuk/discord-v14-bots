const { Schema, model } = require("mongoose");

const schema = Schema({
  userID: String,
  date: Number,
  streamDate: { type: Number, default: Date.now() }
});

module.exports = model("voiceJoinedAt", schema);
