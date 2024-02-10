const { Schema, model } = require("mongoose");

const schema = Schema({
	userID: { type: String, default: "" },
	guildID: { type: String, default: "" },
	top: { type: Number, default: 0 },
	kayitlar: { type: Array, default: [] },
	erkek: { type: Number, default: 0 },
	kız: { type: Number, default: 0 },
	tagMode:{ type: Boolean, default: false },
});

module.exports = model("registerStats", schema);
