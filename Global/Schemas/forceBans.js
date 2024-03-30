const { Schema, model } = require("mongoose");

const schema = Schema({
  guildID: { type: String, default: "" },
  userID: { type: String, default: "" },
  staff: { type: String, default: "" }
});

module.exports = model("forceBans", schema);
