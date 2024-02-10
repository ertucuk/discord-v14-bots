const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const ertucuk = require("../../../../../../Global/Settings/System");
const ertum = require("../../../../../../Global/Settings/Setup.json");

module.exports = {
    name: "nerede",
    description: "Belirttiğiniz kullanıcının hangi ses kanalında olduğu hakkında bilgi verir.",
    category: "ADMIN",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["seskontrol","n"],
      usage: ".nerede", 
    },
  

    onLoad: function (client) { },

    onCommand: async function (client, message, args, ertuembed) { 

    if(!ertum.ConfirmerRoles.some(ertucum => message.member.roles.cache.has(ertucum)) && !ertum.OwnerRoles.some(ertucum => message.member.roles.cache.has(ertucum)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    message.react(`${client.emoji("ertu_carpi")}`)
    return
    }

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    const channel = member.voice.channel
    if (!channel) return message.reply({ embeds: [ertuembed.setDescription(`Belirtilen Kullanıcı Bir Ses Kanalında Bulunmamakta!`)]}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 

    if (!member.voice.channel) return message.channel.send({ content:`${client.emoji("ertu_carpi")} ${member.toString()} üyesi herhangi bir ses kanalında bulunmuyor!`});

    message.react(`${client.emoji("ertu_onay")}`)
    let voiceChannel = member.voice.channel
    let sestekiler = message.guild.channels.cache.get(voiceChannel.id).members.size >= 20 ? "Kanalda 20 Kişiden Fazla User Bulunmakta!" : message.guild.channels.cache.get(voiceChannel.id).members.map(x => x.user).join(",");
    let microphone = member.voice.selfMute ? "Kapalı" : "Açık";
    let headphones = member.voice.selfDeaf ? "Kapalı" : "Açık";
    let invite = voiceChannel.createInvite();
    message.reply({ embeds: [ new EmbedBuilder().setFooter({ text: ertucuk.SubTitle }).setDescription(`**${member} kişisi <#${member.voice.channel.id}> adlı kanalda!**\n**Mikrofon: ${microphone}**\n**Kulaklık: ${headphones}**\n**Sesteki Kullanıcılar:**\n ${sestekiler}\n\nKanala gitmek için [tıkla!](https://discord.gg/${invite.code})`)]})
     
    },
  };