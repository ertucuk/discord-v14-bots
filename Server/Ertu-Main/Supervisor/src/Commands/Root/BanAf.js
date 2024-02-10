const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder,ButtonStyle } = require("discord.js");
const kanal = require("../../../../../../Global/Settings/AyarName");

module.exports = {
    name: "af",
    description: "Sunucudaki tüm banları kaldırırsınız.",
    category: "OWNER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["banaf","afkaldır","banaffı","ban-affı"],
      usage: ".af", 
    },

    onLoad: function (client) { },

    onCommand: async function (client, message, args, ertuembed) {
    const bans = await message.guild.bans.fetch();
    bans.forEach(async (banInfo) => {
        const user = banInfo.user;
        await message.guild.bans.remove(user);
    });
    
    await message.reply('Sunucudaki tüm yasaklar kaldırıldı.');
     },
  };