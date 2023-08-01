const { Schema, model } = require("mongoose");

const schema = Schema({
  id: { type: Number, default: 0 },
  userID: { type: String, default: "" },
  guildID: { type: String, default: "" },
  type: { type: String, default: "" },
  active: { type: Boolean, default: true },
  staff: { type: String, default: "" },
  reason: { type: String, default: "" },
  temp: { type: Boolean, default: false },
  finishDate: Number,
  removed: { type: Boolean, default: false },
  date: { type: Number, default: Date.now() }
});

module.exports = model("penals", schema);
