const { ApplicationCommandOptionType,PermissionsBitField } = require("discord.js");
const levels = require("../../../../../../Global/Schemas/level");
const canvafy = require("canvafy");
const { profileImage } = require('discord-arts');
const kanal = require("../../../../../../Global/Settings/AyarName");

module.exports = {
    name: "level",
    description: "Levelinizi gösterir",
    category: "STAT",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["levelim"],
      usage: ".level", 
    },
  

    onLoad: function (client) { },

    onCommand: async function (client, message, args, ertuembed) {

      let kanallar = kanal.KomutKullanımKanalİsim;
if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

    const member =  message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

    const ertu = await levels.findOne({ guildID: message.guild.id, userID: member.user.id })
    let status;

    if(member.presence && member.presence.status === "dnd") status = "#ff0000"
    if(member.presence && member.presence.status === "idle") status = "#ffff00"
    if(member.presence && member.presence.status === "online") status = "#00ff00"
    if(member.presence && member.presence.status === "offline") status = "#808080"

    const buffer = await profileImage(member.id, {
    borderColor: '#087996',
    presenceStatus: member.presence ? member.presence.status : 'offline',
    badgesFrame: true,
    rankData: {
      currentXp: ertu ? ertu.xp : 1,
      requiredXp: ertu ? ertu.gerekli : 500,
      level: ertu ? ertu.level : 1,
      barColor: '0b7b95'
}
})

return message.reply({files: [{name: "ertu.png", attachment: buffer}]})



     },

  };