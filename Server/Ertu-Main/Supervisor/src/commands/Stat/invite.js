const { ApplicationCommandOptionType,EmbedBuilder,PermissionsBitField } = require("discord.js");
const inviterSchema = require("../../schemas/inviter");
const inviteMemberSchema = require("../../schemas/inviteMember");
const conf = require("../../../../../../Global/Settings/Setup.json")
const kanal = require("../../../../../../Global/Settings/AyarName");

module.exports = {
    name: "invite",
    description: "Davet sayınızı gösterir.",
    category: "STAT",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["inv","invrank","davet","davetlerim"],
      usage: ".invite",
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

      let kanallar = kanal.KomutKullanımKanalİsim;
      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        const inviterData = await inviterSchema.findOne({ guildID: message.guild.id, userID: member.user.id });
        const total = inviterData ? inviterData.total : 0;
        const regular = inviterData ? inviterData.regular : 0;
        const bonus = inviterData ? inviterData.bonus : 0;
        const leave = inviterData ? inviterData.leave : 0;
        const fake = inviterData ? inviterData.fake : 0;  
        const invMember = await inviteMemberSchema.find({ guildID: message.guild.id, inviter: member.user.id });
        const davetettigim = invMember ? invMember.filter(ertu => message.guild.members.cache.get(ertu.userID)).slice(0, 10).map((ertu, index) => message.guild.members.cache.get(ertu.userID)).join(", ") : "Veri Yok"
        const daily = invMember ? message.guild.members.cache.filter((m) => invMember.some((x) => x.userID === m.user.id) && Date.now() - m.joinedTimestamp < 1000 * 60 * 60 * 24).size : 0;
        const weekly = invMember ? message.guild.members.cache.filter((m) => invMember.some((x) => x.userID === m.user.id) && Date.now() - m.joinedTimestamp < 1000 * 60 * 60 * 24 * 7).size : 0;
        let tagged;
        if (conf.ServerTag && conf.ServerTag.length > 0) tagged = invMember ? message.guild.members.cache.filter((m) => invMember.some((x) => x.userID === m.user.id) && m.user.displayName.includes(conf.ServerTag)).size : 0;
        else tagged = 0;
    
        const embed = new EmbedBuilder()
          .setAuthor({ name: member.user.username, iconURL:  member.user.displayAvatarURL({ dynamic: true }) })
          .setThumbnail(member.user.avatarURL({ dynamic: true, size: 2048 }))
          .setDescription(`
     Toplam **${total}** davet.
      \` ${regular} gerçek \`
      \` ${bonus} bonus \`
      \` ${leave} ayrılmış \`
      \` ${fake} fake \`

     Günlük: \`${daily}\`, Haftalık: \`${weekly}\`

     **❯ Davet ettiği tüm kişiler;**
     ${davetettigim ? `${davetettigim}` : 'Veri Yok'}`);
    
        message.channel.send({ embeds: [embed]});
      },
    onSlash: async function (client, interaction) { },
  };