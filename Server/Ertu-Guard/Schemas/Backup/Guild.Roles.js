const mongoose = require('mongoose');

const Roles = mongoose.model("Role", mongoose.Schema({
  roleID: String,
  name: String,
  color: String,
  hoist: Boolean,
  position: Number,
  permissions: String,
  mentionable: Boolean,
  date: Number,
  members: Array,
  channelOverwrites: Array
}))
module.exports = Roles