const { Schema, model } = require("mongoose");

const schema = Schema({
  guildID: { type: String, default: "" },
  userID: { type: String, default: "" },
  yetkis: { type: Array, default: [] }
});

module.exports = model("yetkis", schema);
