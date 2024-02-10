const mongoose = require("mongoose");

const Web = mongoose.model("web", mongoose.Schema({
  guildID: { type: String, default: "" },
  roles: { type: Array , default: []  },
  userID: { type: String, default: "" }
}));

module.exports = Web