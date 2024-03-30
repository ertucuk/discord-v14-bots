const { Schema, model } = require("mongoose");

const schema = Schema({
  guildID: { type: String, default: "" },
  userID: { type: String, default: "" },
  ısaretlenenID: { type: String, default: "" },
  taggeds: { type: Array, default: [] },
  users:{type:Array,default:[]},
  count:{type:Number,default:0}
});

module.exports = model("taggeds", schema);
