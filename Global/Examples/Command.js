const { EmbedBuilder,PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle ,VoiceChannel,AttachmentBuilder,StringSelectMenuBuilder} = require("discord.js");
const kanal = require("../../../../../../Global/Settings/AyarName");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const ertucuk = require("../../../../../../Global/Settings/System");

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

    onCommand: async function (client, message, args, ertuembed) { },

  };