const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "",
    description: "",
    category: "NONE",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: [],
      usage: "", 
    },
    slashCommand: {
      enabled: true,
      options: [
        {
            name: "ertu",
            description: "ertu",
            type: ApplicationCommandOptionType.Subcommand,
        },
      ],
    },

    onLoad: function (client) { },

    onCommand: async function (client, message, args) { },

    onSlash: async function (client, interaction) { },
  };