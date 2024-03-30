const { ApplicationCommandOptionType,PermissionsBitField } = require("discord.js");
const ertucuk = require("../../../../../../Global/Settings/System");

module.exports = {
    name: "url",
    description: "sunucu özel url kullanımı",
    category: "OWNER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["link"],
      usage: ".link",
    },
   

    onLoad: function (client) { },

    onCommand: async function (client, message, args) {

    if(!message.guild.vanityURLCode) return message.reply({ content:"Sunucuda özel url bulunmuyor."});

    const link = await message.guild.fetchVanityData();

    message.reply({ content: `discord.gg/${message.guild.vanityURLCode}\n**Url Kullanımı:** **${link.uses}**`})
     },

  };