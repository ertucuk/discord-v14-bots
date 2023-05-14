const { Schema, model } = require("mongoose");

const schema = Schema({
  guildID: { type: String, default: "" },
  userID: { type: String, default: "" },
  coin: { type: Number, default: 0 }
});

module.exports = model("coin", schema);
