const { Schema, model } = require("mongoose");

const StreamerJoinedAt = Schema({
  userID: String,
  Date: Number,
});

module.exports = model("StreamerJoinedAt", StreamerJoinedAt);