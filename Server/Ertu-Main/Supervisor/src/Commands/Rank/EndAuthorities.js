const { ApplicationCommandOptionType,PermissionsBitField } = require("discord.js");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const ertucuk = require("../../../../../../Global/Settings/System");
const { red } = require("../../../../../../Global/Settings/Emojis.json");
const kanal = require("../../../../../../Global/Settings/AyarName");

module.exports = {
    name: "yetkibitir",
    description: "Kişinin yetkisini çekersiniz.",
    category: "STAT",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: [],
      usage: ".yetkibitir", 
    },
  

    onLoad: function (client) { },

    onCommand: async function (client, message, args, ertuembed) {

       let kanallar = kanal.KomutKullanımKanalİsim;
       if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

        if(!ertum.OwnerRoles.some(ertuu => message.member.roles.cache.has(ertuu)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
        {
        message.react(`${client.emoji("ertu_carpi")}`)
        message.reply({ content:`Yeterli yetkin yok!`}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) 
        {
        message.channel.send({ content:"Bir üye belirtmeyi unuttun!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }

        let roller = await member.roles.cache.filter(x=> x.id != message.guild.id && [...ertum.ManRoles,...ertum.GirlRoles,ertum.BoosterRole].some(y=> y == x.id)).map(x=> `${x.id}`);
        await member.roles.set(roller)
        message.reply({content:`${member} Kullanıcısının yetkileri başarı ile alındı`})
     },

  };