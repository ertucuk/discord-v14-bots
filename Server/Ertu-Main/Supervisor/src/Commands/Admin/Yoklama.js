const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder,ButtonStyle } = require("discord.js");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const ertucuk = require("../../../../../../Global/Settings/System");
module.exports = {
    name: "yoklama",
    description: "Toplantıda bulunan kişilere katıldı permi verir.",
    category: "ADMIN",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["yoklama", "katıldı"],
      usage: ".yoklama", 
    },
  

    onLoad: function (client) { },

    onCommand: async function (client, message, args, ertuembed) {

    if (!ertum.OwnerRoles.some(ertucum => message.member.roles.cache.has(ertucum)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return message.reply({ content: `Yetkin bulunmamakta dostum.` }).then((e) => setTimeout(() => { e.delete(); }, 5000));

    if (!message.member.voice.channel || message.member.voice.channel.id != ertum.MeetingChannel) return message.reply({content:"Bu komutu başlatabilmek için toplantı kanalında olmalısın."});
    

    const confirmerRole = message.guild.roles.cache.get(ertum.ConfirmerRoles[0]);

    if (!confirmerRole) {
      return console.log("Belirtilen rol bulunamadı.");
    }
    
    let yetkili = [
      ...message.guild.members.cache.filter(
        (member) => !member.user.bot && member.roles.highest.position >= confirmerRole.position
      ).values()
    ];

const joinedMeetingMembers = yetkili.filter((member) => {
    return (
      member.voice.channel &&
      member.voice.channel.id === ertum.MeetingChannel &&
      !member.roles.cache.has(ertum.JoinedRole)
    );
  });
  
  await Promise.all(
    joinedMeetingMembers.map((member) => {
      return member.roles.add(ertum.JoinedRole);
    })
  );
  
  const leftMeetingMembers = yetkili.filter((member) => {
    return (
      (!member.voice.channel && member.roles.cache.has(ertum.JoinedRole)) ||
      (member.voice.channel &&
        member.voice.channel.id !== ertum.JoinedRole &&
        member.roles.cache.has(ertum.JoinedRole))
    );
  });
  
  await Promise.all(
    leftMeetingMembers.map((member) => {
    return member.roles.remove(ertum.JoinedRole);
    })
  );
  
 message.channel.send({
content: `Toplantıda bulunan ${joinedMeetingMembers.length} yetkililere katıldı rolü veriliyor.
  
Toplantıda bulunmayan ${leftMeetingMembers.length} yetkiliden katıldı rolü alınıyor.`,
});
},
};