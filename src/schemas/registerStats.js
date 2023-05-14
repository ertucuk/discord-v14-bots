const { Schema, model } = require("mongoose");

const schema = Schema({
	userID: { type: String, default: "" },
	guildID: { type: String, default: "" },
	top: { type: Number, default: 0 },
	topGuild24: { type: Number, default: 0 },
	topGuild7: { type: Number, default: 0 },
	top24: { type: Number, default: 0 },
	top7: { type: Number, default: 0 },
	top14: { type: Number, default: 0 },
	erkek: { type: Number, default: 0 },
	erkek24: { type: Number, default: 0 },
	erkek7: { type: Number, default: 0 },
	erkek14: { type: Number, default: 0 },
	kız: { type: Number, default: 0 },
	kız24: { type: Number, default: 0 },
	kız7: { type: Number, default: 0 },
	kız14: { type: Number, default: 0 },
        tagMode: Boolean,
});

module.exports = model("registerStats", schema);
