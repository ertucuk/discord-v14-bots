const { Schema, model } = require("mongoose");

const MessageStat = Schema({
guildID:String,
userID:String,
TotalStat: { type: Number, default: 0 },
DailyStat: { type: Number, default: 0 },
WeeklyStat: { type: Number, default: 0 },
MonthlyStat: { type: Number, default: 0 },
date: {type: Date, default: Date.now() },
});

module.exports = model("MessageStat", MessageStat);