const { ApplicationCommandOptionType, EmbedBuilder,PermissionsBitField } = require("discord.js");
const ertum = require("../../Settings/Setup.json");
const ertucuk = require("../../Settings/System");

module.exports = {
    name: "say",
    description: "sayar",
    category: "NONE",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: [],
      usage: "",
    },
    slashCommand: {
      enabled: true,
      options: [
        {
            name: "say",
            description: "sayar",
            type: ApplicationCommandOptionType.Subcommand,
        },
      ],
    },

    onLoad: function (client) { },

    onCommand: async function (client, message, args) { 

    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;   

    let ertus = ertum.ServerTag;

    let TotalMember = (message.guild.memberCount)
    let OnlineMember = (message.guild.members.cache.filter(m => m.presence && m.presence.status !== "offline").size)
    let VoiceMember = (message.guild.members.cache.filter((x) => x.voice.channel).size)
    let Boost = (message.guild.premiumSubscriptionCount)
    let BotVoice = message.guild.members.cache.filter(x => x.voice.channel && x.user.bot).size
    let tag = (message.guild.members.cache.filter(u => ertus.some(tag => u.user.tag.includes(tag))).size)

    const ertu = new EmbedBuilder()
    .setDescription(`
     Şu anda toplam **${VoiceMember - BotVoice}** (**+${BotVoice || "0"} bot**) kişi ses kanallarında aktif.
     Sunucuda şuan da **${TotalMember}** adet üye var (**${OnlineMember}** Aktif)
     Sunucuda tagımızı almış **${tag}** kişi var!
     Sunucumuza ${Boost} takviye yapılmış!
    `)

  let msg = await message.channel.send({ embeds: [ertu]})

    },// allah yoksa bunu da acıklasınlar ateistler ben nasıl yazıyorum 



    onSlash: async function (client, interaction) { },
  };