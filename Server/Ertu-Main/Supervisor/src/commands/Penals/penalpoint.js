const { ApplicationCommandOptionType, PermissionsBitField } = require("discord.js");
const cezapuan = require("../../../../../../Global/Schemas/cezapuan")
const ceza = require("../../../../../../Global/Schemas/ceza")
const moment = require("moment");
const { YamlDatabase } = require("five.db");
const db = new YamlDatabase();
moment.locale("tr");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const { red, green } = require("../../../../../../Global/Settings/Emojis.json");
const kanal = require("../../../../../../Global/Settings/AyarName");

module.exports = {
    name: "cezapuan",
    description: "Kullanıcının cezapuanını gösterir.",
    category: "PENAL",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["cezapoint","cp"],
      usage: ".cezapuan",
    },


    onLoad: function (client) { },

    onCommand: async function (client, message, args) {

      let kanallar = kanal.KomutKullanımKanalİsim;
      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers) &&  !ertum.BanHammer.some(x => message.member.roles.cache.has(x))) { message.channel.send({ content:"Yeterli yetkin bulunmuyor!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
    message.react(red)
    return 
    }
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    if (!member) { message.channel.send({ content:"Böyle bir kullanıcı bulunamadı!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
    message.react(red)
    return 
    }
    const cezaData = await ceza.findOne({ guildID: ertum.ServerID, userID: member.id });
    const ertu = db.get(`kullanıcı_${member.id}`)
    var data = db.has("cezapuan",true)
    const cezapuanData = await cezapuan.findOne({ userID: member.user.id });
    message.react(green)
    message.reply({ content:`${member} kişisinin toplamda \`${cezapuanData ? cezapuanData.cezapuan : 0}\` ceza puanı gözükmekte!`})
     },

  };