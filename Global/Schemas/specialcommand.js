const { Schema, model } = require("mongoose");

const schema = Schema({
  guildID: { type: String, default: "" },
  perms:{type:Array,default:[]}
});

module.exports = model("özelPerms", schema);