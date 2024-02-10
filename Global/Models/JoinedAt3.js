const { Schema, model } = require("mongoose");

const CameraJoinedAt = Schema({
  userID: String,
  Date: Number,
});

module.exports = model("CameraJoinedAt", CameraJoinedAt);