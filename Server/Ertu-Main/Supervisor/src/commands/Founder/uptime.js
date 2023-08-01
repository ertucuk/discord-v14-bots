const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
    name: "uptime",
    description: "Botun Uptime Süresi",
    category: "OWNER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: [],
      usage: ".uptime", 
    },


    onLoad: function (client) { },

    onCommand: async function (client, message, args) {

    message.reply({ embeds: [new EmbedBuilder().setDescription(`**Client Uptime; \`${moment.duration(client.uptime).format('D [gün], H [saat], m [dakika], s [saniye]')}\`**`)] });
     },

  };