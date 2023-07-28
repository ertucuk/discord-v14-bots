const { ApplicationCommandOptionType, EmbedBuilder,PermissionsBitField } = require("discord.js");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const ertucuk = require("../../../../../../Global/Settings/System");

module.exports = {
    name: "say",
    description: "Sunucudaki kullanıcılar hakkında bilgi verir.",
    category: "STAFF",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: [],
      usage: ".say",
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
    let tag = (message.guild.members.cache.filter(u => ertus.some(tag => u.user.displayName.includes(tag))).size)

    const ertu = new EmbedBuilder()
    .setFooter({text: ertucuk.SubTitle})
    .setURL("https://github.com/ertucuk")
    .setTitle(message.guild.name)
    .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))
    .setDescription(`
    > Şu anda toplam **${VoiceMember - BotVoice}** (**+${BotVoice || "0"} bot**) kişi ses kanallarında aktif.
    > Sunucuda şuan da **${TotalMember}** üye var (**${OnlineMember}** Aktif)
    > Sunucuda tagımızı almış **${tag}** kişi var!
    > Sunucumuza ${Boost} takviye yapılmış!
    `)

  let msg = await message.channel.send({ embeds: [ertu]})

    },// allah yoksa bunu da acıklasınlar ateistler ben nasıl yazıyorum 



    onSlash: async function (client, interaction) { },
  };