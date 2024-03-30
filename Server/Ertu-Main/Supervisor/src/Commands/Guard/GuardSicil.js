const { Client, ApplicationCommandType, PermissionsBitField, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRow, ActionRowBuilder, Formatters } = require("discord.js");
const guardSicil = require("../../../../../Ertu-Guard/Schemas/guardPenalty");

module.exports = {
  name: "guardsicil",
  description: "Sunucu denetimi",
  category: "OWNER",
  cooldown: 0,
  command: {
    enabled: true,
    aliases: ["guard-sicil", "gs"],
    usage: ".guardsicil",
  },


  onLoad: function (client) { },

  onCommand: async function (client, message, args, ertuembed) {

    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!user) return message.reply({ content: `Bir kullanıcı etiketle!` })

    const data = await guardSicil.findOne({ guildID: message.guild.id, OrusbuEvladı: user.id });
    if (!data || (data && data.işlemler.length == 0)) return message.reply({ content: `**Kişinin yaptığı işlemler yok veya bulunamadı!**`, ephemeral: true })
    message.reply({ embeds: [new EmbedBuilder().setDescription(`${data.işlemler.map(x => `\`İşlem  :\` ${x.işlem}\n\`Tarih  :\` <t:${(x.Tarih / 1000).toFixed()}> (<t:${(x.Tarih / 1000).toFixed()}:R>)`).join("\n")}`)], ephemeral: true })

  },

};