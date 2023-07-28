const { Schema, model } = require("mongoose");

const schema = Schema({
  guildID: { type: String, default: "" },
  userID: { type: String, default: "" },
  toplams: { type: Array, default: [] }
});

module.exports = model("toplams", schema);
