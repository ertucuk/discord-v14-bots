const { Schema, model } = require("mongoose");

const schema = Schema({
user: String,
kanallar: Array
});

module.exports = model("channelsChangeData", schema);