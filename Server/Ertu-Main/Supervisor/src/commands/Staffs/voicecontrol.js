const { ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField } = require("discord.js");
const { red, green } = require("../../../../../../Global/Settings/Emojis.json");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const voice = require("../../../../../../Global/Schemas/voiceInfo");
const moment = require("moment");
const ertucuk = require("../../../../../../Global/Settings/System");

module.exports = {
    name: "nerede",
    description: "Belirttiğiniz kullanıcının hangi ses kanalında olduğu hakkında bilgi verir.",
    category: "STAFF",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["seskontrol","n"],
      usage: ".nerede", 
    },
  

    onLoad: function (client) { },

    onCommand: async function (client, message, args) { 

    if(!ertum.ConfirmerRoles.some(ertucum => message.member.roles.cache.has(ertucum)) && !ertum.OwnerRoles.some(ertucum => message.member.roles.cache.has(ertucum)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
    {message.react(red)
    return
    }
    const channel = message.guild.channels.cache.get(args[0]);
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    if (channel) {
    const data = await voice.find({}).sort({ date: -1 });
    message.reply({embeds: [ new EmbedBuilder().setDescription(`
\`${channel.name}\` adlı kanaldaki üyelerin ses bilgileri:

${channel.members.map((x) => `${x.toString()}: \`${data.find((u) => u.userID === x.user.id) ? moment.duration(Date.now() - data.find((u) => u.userID === x.user.id).date).format("H [saat], m [dakika], s [saniyedir]") : "Bulunamadı!"} seste.\``).join("\n")}
      `)]});
    } else {
      if (!member.voice.channel) return message.channel.send({ content:`${red} ${member.toString()} üyesi herhangi bir ses kanalında bulunmuyor!`});

      const data = await voice.findOne({ userID: member.user.id });
      message.react(green)
      let voiceChannel = member.voice.channel
      let limit = member.voice.channel.userLimit || "0";
      let sestekiler = message.guild.channels.cache.get(voiceChannel.id).members.size >= 20 ? "Kanalda 20 Kişiden Fazla User Bulunmakta!" : message.guild.channels.cache.get(voiceChannel.id).members.map(x => x.user).join(",");

      voiceChannel.createInvite().then(invite =>
message.reply({ embeds: [new EmbedBuilder().setFooter({text: ertucuk.SubTitle}).setDescription(`
**${member.toString()} kişisi <#${member.voice.channel.id}> adlı kanalda!**\n**Mikrofon: ${member.voice.mute ? `Kapalı` : `Açık`}**\n**Kulaklık: ${member.voice.deaf ? `Kapalı` : `Açık`}**\n**Sesteki Kullanıcılar:**\n ${sestekiler}\n\nKanala gitmek için [tıkla!](https://discord.gg/${invite.code}) 
`).setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) }).setFooter({ text: `${moment(Date.now()).format("LLL")}`})]}));

    }

    },

  };