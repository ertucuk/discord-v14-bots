const { Schema, model } = require("mongoose");

const schema = Schema({
  guildID: { type: String, default: "" },
  userID: { type: String, default: "" },
  ısaretlenenID: { type: String, default: "" },
  yetkis: { type: Array, default: [] },
  users:{ type: Array, default: [] },
  count:{ type: Number, default: 0 },
});

module.exports = model("yetki-aldir", schema);
