const { Schema, model } = require("mongoose");
const Guild = require("../../../Global/Settings/System");

const schema = Schema({
  guildID: String,
  database:{type:Boolean, default:false},
  serverGuard:{type:Boolean, default:false},
  rolesGuard:{type:Boolean, default:false},
  channelsGuard:{type:Boolean, default:false},
  banKickGuard:{type:Boolean, default:false},
  emojiStickersGuard:{type:Boolean, default:false},
  UrlSpammer:{type:Boolean, default:false},
  webAndofflineGuard:{type:Boolean, default:false},
  chatGuards:{type:Boolean, default:false},
  SafedMembers:{type:Array, default:Guild.BotsOwners},
  serverSafedMembers:{type:Array, default:Guild.BotsOwners},
  roleSafedMembers:{type:Array, default:Guild.BotsOwners},
  channelSafedMembers:{type:Array, default:Guild.BotsOwners},
  banKickSafedMembers:{type:Array, default:Guild.BotsOwners},
  emojiStickers:{type:Array, default:Guild.BotsOwners},
  chatGuard:{type:Array, default:Guild.BotsOwners},
});

module.exports = model("Guard", schema);
