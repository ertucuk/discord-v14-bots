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


    onLoad: function (client) { },

    onCommand: async function (client, message, args) {
        if(!args[0]) return 
        message.delete();
        message.channel.send({ content: args.join(' ')});
     },

  };