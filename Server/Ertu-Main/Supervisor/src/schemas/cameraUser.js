const { Schema, model } = require("mongoose");

const schema = Schema({
  guildID: String,
  userID: String,
  topStat: { type: Number, default: 0 },
});

module.exports = model("cameraUser", schema);
