const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const moment = require("moment");
moment.locale("tr");
const { YamlDatabase } = require("five.db");
const db = new YamlDatabase();
const penals = require("../../schemas/penals");
const { green , red } = require("../../Settings/Emojis.json")
const ertucuk = require("../../Settings/System");

module.exports = {
    name: "sicil",
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
      var member = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.member;
      if(member) {
      const ertu = db.get(`kullanıcı_${member.id}`)
      var data = db.has("cezapuan",true)
      if(!ertu) return message.reply({ embeds: [Sex = new EmbedBuilder().setColor("#2b2d31").setDescription(`${green} Bu Kullanıcının sicil kaydı bulunmamakta.`)] }).then(x=> setTimeout(() => {x.delete()}, 5000))
      message.reply({ embeds: [Sicil = new EmbedBuilder().setFooter({text: ertucuk.SubTitle}).setColor("#2b2d31").setDescription(`${ertu.map((x,i) => `${i+1}). ${x}`).join("\n")}`)]});
       }
     },

    onSlash: async function (client, interaction) { },
  };