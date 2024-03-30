const { ApplicationCommandOptionType,ActionRowBuilder,ButtonBuilder,ButtonStyle } = require("discord.js");
const children = require("child_process");

module.exports = {
    name: "restart",
    description: "botu baştan başlatır",
    category: "OWNER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["reload","res"],
      usage: ".reload",
    },


    onLoad: function (client) { },

    onCommand: async function (client, message, args) {
  
        await message.reply({ content: `🔃 Bot Yeniden Başlatılıyor...`})
        process.exit(1)
    
    }, 
  };