const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
    name: "uptime",
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

    onCommand: async function (client, message, args) {

    message.reply({ embeds: [new EmbedBuilder().setDescription(`**Client Uptime; \`${moment.duration(client.uptime).format('D [gün], H [saat], m [dakika], s [saniye]')}\`**`)] });


     },

    onSlash: async function (client, interaction) { },
  };