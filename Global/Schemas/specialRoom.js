const { Schema, model } = require("mongoose");

const schema = Schema({
  guildID: { type: String, default: "" },
  userID: { type: String, default: "" },
  only : {type:Boolean,default:false},
  channelID:{type:String,default:undefined},
  lastQuit: {type: Number, default: null},
  date: { type: Number, default: Date.now() }
});

module.exports = model("special-room", schema);