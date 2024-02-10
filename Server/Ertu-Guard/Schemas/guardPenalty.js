const { Schema, model } = require("mongoose");

const schema = Schema({
  guildID: String,
  OrusbuEvladı: {type: String, default: undefined },
  işlemler: { type: Array, default: [] }

});

module.exports = model("Guard-penalty", schema);
