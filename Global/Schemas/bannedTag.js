const { Schema, model } = require("mongoose");

const schema = Schema({
	guildID: { type: String, default: "" },
	taglar: { type: Array, default: [] }
});

module.exports = model("bannedTag", schema);
 
