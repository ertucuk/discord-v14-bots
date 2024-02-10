const { ApplicationCommandOptionType, EmbedBuilder,PermissionsBitField,ChannelType } = require("discord.js");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const ertucuk = require("../../../../../../Global/Settings/System");

module.exports = {
    name: "say",
    description: "Sunucudaki kullanıcılar hakkında bilgi verir.",
    category: "ADMIN",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: [],
      usage: ".say",
    },

    onLoad: function (client) { },
    onCommand: async function (client, message, args) { 
    if (!ertum.ConfirmerRoles.some(ertucum => message.member.roles.cache.has(ertucum)) && !ertum.OwnerRoles.some(ertucum => message.member.roles.cache.has(ertucum)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return message.reply({ content: `${client.emoji("ertu_carpi")} Yeterli yetkiniz yok!` })
    let ertus = ertum.ServerTag;
    const ertu = new EmbedBuilder()
    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
    .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))
    .setDescription(`
    Sunucumuz da **${client.sayıEmoji(message.guild.memberCount)}** üye bulunmakta.
    Sunucumuz da **${client.sayıEmoji(message.guild.members.cache.filter(m => m.presence && m.presence.status !== "offline").size)}** aktif üye bulunmakta.
    Sunucumuza ${client.sayıEmoji(message.guild.premiumSubscriptionCount)} (${message.guild.premiumTier !== 'NONE' ? `\`${message.guild.premiumTier.toString().replace("Tier_1", "1").replace("Tier_2", "2").replace("Tier_3", "3")}. Lvl\`` : ''}) takviye yapılmış!
    Ses kanallarında **${client.sayıEmoji(message.guild.channels.cache.filter(channel => channel.type == ChannelType.GuildVoice).map(channel => channel.members.size).reduce((a, b) => a + b))}** (\`+${message.guild.members.cache.filter(x => x.user.bot && x.voice.channel).size} Bot\`) üye bulunmakta
    Sunucumuz da **${client.sayıEmoji(message.guild.members.cache.filter(u => ertus.some(tag => u.user.displayName.includes(tag))).size)}** taglı üye bulunmakta!
    `)
    message.react(`${client.emoji("ertu_onay")}`)
    message.channel.send({ embeds: [ertu] })
  },
};