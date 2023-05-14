const { Schema, model } = require("mongoose");

const schema = Schema({
  guildID: { type: String, default: "" },
  userID: { type: String, default: "" },
  kayit: { type: Number, default: 0 },
});

module.exports = model("kayitgorev", schema);