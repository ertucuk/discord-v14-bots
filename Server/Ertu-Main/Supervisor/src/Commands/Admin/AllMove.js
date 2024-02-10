const { ApplicationCommandOptionType,PermissionsBitField,ChannelType } = require("discord.js");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const {red , green} = require("../../../../../../Global/Settings/Emojis.json");

module.exports = {
    name: "toplutaşı",
    description: "",
    category: "ADMIN",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["toplutası","toplutasi","allmove"],
      usage: ".toplutaşı <taşıyacağınız-kanal>", 
    },

    onLoad: function (client) { },

    onCommand: async function (client, message, args, ertuembed) { 

      if(!ertum.OwnerRoles.some(ertucum => message.member.roles.cache.has(ertucum)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
      { 
      message.react(`${client.emoji("ertu_carpi")}`)
      message.reply({ content:`Yeterli yetkin yok!`}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
      return }

      const mevcutKanal = message.member.voice.channel;
      const tasiyacaginkanalamk = message.guild.channels.cache.find((a) => a.type === ChannelType.GuildVoice && a.id === args[0]);

      if (!mevcutKanal) return message.reply({ content: "Toplu taşıma işlemi uygulamadan önce bir ses kanalına bağlı olmalısın!" });  
      if (!tasiyacaginkanalamk) return message.reply({ content: "Üyeleri hangi kanala taşımak istiyorsunuz?" });

      mevcutKanal.members.forEach((member) => {
        member.voice.setChannel(tasiyacaginkanalamk);
      });

      message.react(`${client.emoji("ertu_onay")}`);
      await message.reply({ content: `Mevcut kanaldaki üyeler **${tasiyacaginkanalamk.name}** kanalına taşındı` });

    },

  };