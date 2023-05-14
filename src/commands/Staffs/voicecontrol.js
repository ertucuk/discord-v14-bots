const { ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField } = require("discord.js");
const { red, green } = require("../../Settings/Emojis.json");
const ertum = require("../../Settings/Setup.json");
const voice = require("../../schemas/voiceInfo");
const moment = require("moment");
const ertucuk = require("../../Settings/System");

module.exports = {
    name: "nerede",
    description: "",
    category: "NONE",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["seskontrol","n"],
      usage: "", 
    },
    slashCommand: {
      enabled: true,
      options: [
        {
            name: "ertu",
            description: "ertu",
            type: ApplicationCommandOptionType.Subcommand,
        },
      ],
    },

    onLoad: function (client) { },

    onCommand: async function (client, message, args) { 

    if(!ertum.ConfirmerRoles.some(oku => message.member.roles.cache.has(oku)) && !ertum.sahipRolu.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
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

      voiceChannel.createInvite().then(invite =>
message.reply({ embeds: [new EmbedBuilder().setFooter({text: ertucuk.SubTitle}).setDescription(`
${member.toString()} kişisi <#${member.voice.channel.id}> kanalında. **Mikrofonu ${member.voice.mute ? `Kapalı` : `Açık`}**, **Kulaklığı ${member.voice.deaf ? `Kapalı` : `Açık`}** Kanala gitmek için [tıklaman](https://discord.gg/${invite.code}) yeterli
\`\`\`\nAktif Bilgiler:\n\`\`\`
<#${member.voice.channel.id}> kanalındaki üye durumu \`${voiceChannel.members.size}/${limit}\` 
`).setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) }).setFooter({ text: `${moment(Date.now()).format("LLL")}`})]}));

    }

    },

    onSlash: async function (client, interaction) { },
  };