const { Schema, model } = require("mongoose");

const schema = Schema({
  guildID: { type: String, default: "" },
  user: { type: String, default: "" },
  roller: { type: Array, default: [] },
  mod: { type: String, default: "" },
});

module.exports = model("roles", schema);