const { Schema, model } = require("mongoose");

const schema = Schema({
  user: String,
  roller: Array,
});

module.exports = model("roles", schema);