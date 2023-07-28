const { Schema, model } = require("mongoose");

const schema = Schema({
  guildID: { type: String, default: "" },
  userID: { type: String, default: "" },
  invite: { type: Number, default: 0 },
});

module.exports = model("gorev", schema);