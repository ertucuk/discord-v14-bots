const { Schema, model } = require("mongoose");

const schema = Schema({
	guildID: { type: String, default: "" },
	userID: { type: String, default: "" },
	names: { type: Array, default: [] },
	yetkili: {type: String, default: ""},
	sebep: {type: String, default: ""}
});

module.exports = model("names", schema);