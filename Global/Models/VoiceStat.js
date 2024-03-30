const { Schema, model } = require("mongoose");

const voiceStat = Schema({
  guildID: String,
  userID: String,
  TotalStat: { type: Number, default: 0 },
  DailyStat: { type: Number, default: 0 },
  WeeklyStat: { type: Number, default: 0 },
  MonthlyStat: { type: Number, default: 0 },
});

module.exports = model("VoiceStat", voiceStat);