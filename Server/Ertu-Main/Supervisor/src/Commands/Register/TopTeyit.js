const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder,ButtonStyle } = require("discord.js");
const kanal = require("../../../../../../Global/Settings/AyarName");
const regstats = require("../../../../../../Global/Schemas/registerStats");

module.exports = {
    name: "topteyit",
    description: "En fazla teyit yapan kullanıcılar",
    category: "REGISTER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["teyitsiralama","teyitsıralama"],
      usage: ".topteyit", 
    },
  

    onLoad: function (client) { },

    onCommand: async function (client, message, args, ertuembed) {

    let kanallar = kanal.KomutKullanımKanalİsim;
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 
    let load = await message.reply({content: `${message.guild.name} sunucusuna ait teyit sıralaması yükleniyor. Lütfen bekleyin!`})
    let data = await regstats.find({ guildID: message.guild.id }).sort({ top: -1 }); 
    let kayit = data.filter((x) => message.guild.members.cache.has(x.userID)).splice(0, 20).map((x, i) => `${x.userID === message.author.id ? `${client.sayıEmoji(i == 0 ? `1` : `${i + 1}`)} <@${x.userID}>: \` ${x.top} Kayıt \` **(Siz)**` : ` ${client.sayıEmoji(i == 0 ? `1` : `${i + 1}`)} <@${x.userID}>: \` ${x.top} Kayıt \``}`).join("\n"); 
    const embed = new EmbedBuilder() 
    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
    .setDescription(`Aşağı da **${message.guild.name}** sunucusunun en iyi kayıt yapanların sıralaması belirtilmiştir.\n\n${kayit} `, false) 
    load.edit({embeds: [embed]}); 
     },
  };
