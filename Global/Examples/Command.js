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
  

    onLoad: function (client) { },

    onCommand: async function (client, message, args) { },

  };