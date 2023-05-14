const { ApplicationCommandOptionType,EmbedBuilder } = require("discord.js");
const client = global.bot;

module.exports = {
    name: "ping",
    description: "",
    category: "OWNER",
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

    onCommand: async function (client, message, args) {

    message.reply({ embeds: [new EmbedBuilder().setImage('https://dummyimage.com/2000x500/2b2d31/ffffff&text=' + client.ws.ping + '%20ms')] });
    
  },

    onSlash: async function (client, interaction) { },
  };