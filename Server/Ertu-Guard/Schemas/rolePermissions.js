const { Schema, model } = require("mongoose");

const schema = Schema({
roleID:String,
BitField:String
});

module.exports = model("role-Permissions", schema);
