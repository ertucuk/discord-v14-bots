const { ApplicationCommandType } = require("discord.js");

module.exports = {
    name: "",
    type: ApplicationCommandType.User,
    enabled: false,
    cooldown: 0,

    async onRequest(client, interaction) { },
  };
  