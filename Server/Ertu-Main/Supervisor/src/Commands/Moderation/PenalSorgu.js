const { ApplicationCommandOptionType,PermissionsBitField, EmbedBuilder } = require("discord.js");
const moment = require("moment");
moment.locale("tr");
const { YamlDatabase } = require("five.db");
const db = new YamlDatabase();
const penals = require("../../../../../../Global/Schemas/penals");
const { green , red } = require("../../../../../../Global/Settings/Emojis.json")
const ertucuk = require("../../../../../../Global/Settings/System");
const kanal = require("../../../../../../Global/Settings/AyarName");
const ertum = require("../../../../../../Global/Settings/Setup.json");

module.exports = {
    name: "cezasorgu",
    description: "Sorguladığınız ceza hakkında detaylı bilgi verir.",
    category: "USER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["sorgu","ceza"],
      usage: ".ceza <CezaID>", 
    },
  

    onLoad: function (client) { },

    onCommand: async function (client, message, args) {

      let kanallar = kanal.KomutKullanımKanalİsim;
      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

      if (isNaN(args[0])) return message.channel.send({ content:"Ceza ID girmeyi unuttun!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
      const cezalar = await penals.findOne({ guildID: message.guild.id, id: args[0] });
      if (!cezalar) return message.channel.send({ content:`${args[0]} ID'li bir ceza kaydedilmemiş!`}).then((e) => setTimeout(() => { e.delete(); }, 5000));

      const user = client.users.cache.get(cezalar.userID)

      const embed = new EmbedBuilder()
      .setThumbnail(message.guild.iconURL({dynamic: true, size: 2048}))
      //.setAuthor({ name: member.user.username, iconURL: member.displayAvatarURL({ dynamic: true, size: 2048 })})
      .setDescription(`**#${args[0]}** ID'li **${cezalar.active ? 'aktif' : 'pasif'}** cezanın detayları aşağıda yer almaktadır.`)
      .addFields(
        {
          name: 'İşlem Uygulayan Yetkili',
          value: `<@${cezalar.staff}> (${cezalar.staff})`,
          inline: true
        }, 
        {
          name: 'İşlem Tipi',
          value: `${cezalar.type}`,
          inline: true
        },
        {
          name: 'İşlem Sebebi',
          value: cezalar.reason ? `${cezalar.reason.length > 1024 ? cezalar.reason.substring(0, 1022).trim() + '..' : cezalar.reason}` : 'Sebep belirtilmemiş.',
          inline: false
        },
        {
          name: 'Süre Bilgileri',
          value: `İşlem <t:${Math.floor(cezalar.date / 1000)}> tarihinde (<t:${Math.floor(cezalar.date / 1000)}:R>) uygulanmış. \n\n${cezalar.finishDate ? `Verilen ceza <t:${Math.floor(cezalar.finishDate / 1000)}> tarihinde (<t:${Math.floor(cezalar.finishDate / 1000)}:R>) sona ${cezalar.active ? 'erecek' : 'ermiş'}.` : ''}`,
          inline: false
        }
      );
      
      if (user) {
        embed.setAuthor({ iconURL: user.displayAvatarURL({ dynamic: true }), name: `Cezalı: ${user.username}` })
      } else {
        embed.setAuthor({ iconURL: message.guild.iconURL({ dynamic: true }), name: message.guild.name })
      }

      if (cezalar.proofImage) {
        embed.setImage(cezalar.proofImage)
      }
     
      message.react(`${client.emoji("ertu_onay")}`)
      message.reply({embeds: [embed]});
     },
  };