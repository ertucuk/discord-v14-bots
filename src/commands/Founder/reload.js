const { ApplicationCommandOptionType } = require("discord.js");
const settings = require("../../Settings/System");

module.exports = {
    name: "restart",
    description: "botu baştan başlatır",
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
            name: "reload",
            description: "botu baştan başlatır",
            type: ApplicationCommandOptionType.Subcommand,
        },
      ],
    },

    onLoad: function (client) { },

    onCommand: async function (client, message, args) {

        if (!args[0]) {
            await message.reply({ content: `**Bot** Başarıyla Yeniden Bağlandı!`})
            process.exit(1)
          }

     },

    onSlash: async function (client, interaction) {

    await interaction.channel.send({ content: `**Bot** Başarıyla Yeniden Bağlandı!`, ephemeral: false })
    process.exit(0)
      
    
     },
  };