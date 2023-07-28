const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "yaz",
    description: "istediğin kelime ve cümleleri yazar.",
    category: "OWNER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: [],
      usage: ".yaz [yazı]",
    },
    slashCommand: {
      enabled: true,
      options: [
        {
            name: "yaz",
            description: "yazar",
            type: ApplicationCommandOptionType.Subcommand,
        },
      ],
    },

    onLoad: function (client) { },

    onCommand: async function (client, message, args) {
        if(!args[0]) return 
        message.delete();
        message.channel.send({ content: args.join(' ')});
     },

    onSlash: async function (client, interaction) { },
  };