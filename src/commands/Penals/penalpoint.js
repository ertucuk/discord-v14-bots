const { ApplicationCommandOptionType, PermissionsBitField } = require("discord.js");
const cezapuan = require("../../schemas/cezapuan")
const ceza = require("../../schemas/ceza")
const moment = require("moment");
moment.locale("tr");
const ertum = require("../../Settings/Setup.json");
const { red, green } = require("../../Settings/Emojis.json");
const ertucuk = require("../../Settings/System");

module.exports = {
    name: "cezapuan",
    description: "",
    category: "NONE",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["cezapoint","cp"],
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
    const cezapuanData = await cezapuan.findOne({ userID: member.user.id });
    message.react(green)
    message.reply({ content:`${member} kişisinin toplamda \`${cezapuanData ? cezapuanData.cezapuan : 0}\` ceza puanı ve (Toplam **${cezaData ? cezaData.ceza.length : 0}** Ceza) olarak gözükmekte!`})
     },

    onSlash: async function (client, interaction) { },
  };