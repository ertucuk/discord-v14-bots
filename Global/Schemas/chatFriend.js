const { Schema, model } = require("mongoose");

const schema = Schema({
  userID: { type: String, default: "" },
  repliedUser: { type: String, default: "" },
  yanitSayi: { type: Number, default: 0 },
});

module.exports = model("chatFriend", schema);
