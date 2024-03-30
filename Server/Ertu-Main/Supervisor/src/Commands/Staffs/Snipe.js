const { ApplicationCommandOptionType, EmbedBuilder,PermissionsBitField, AuditLogEvent } = require("discord.js");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const snipe = require("../../../../../../Global/Schemas/snipe");
const ertucuk = require("../../../../../../Global/Settings/System");
const moment = require("moment")
module.exports = {
    name: "snipe",
    description: "Son silinen mesajı gösterir.",
    category: "ADMIN",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["sn"],
      usage: ".snipe",
    },
  

    onLoad: function (client) { },
    
    onCommand: async function (client, message, args) {

    if(!ertum.ConfirmerRoles.some(ertucum => message.member.roles.cache.has(ertucum)) && !ertum.OwnerRoles.some(ertucum => message.member.roles.cache.has(ertucum)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;
    const data = await snipe.findOne({ guildID: message.guild.id, channelID: message.channel.id });
    if (!data) return message.channel.send({ content:"Bu kanalda silinmiş bir mesaj bulunmuyor!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 

    const embed = new EmbedBuilder()
    .setAuthor({name: message.member.displayName, iconURL: message.author.displayAvatarURL({dynamic: true})})
    .setColor('Random')
    .setFooter({text: ertucuk.SubTitle})
    .setDescription(`
    Atan Kişi: <@${data.userID}> - ${data.userID}
    Yazılma Tarihi: <t:${Math.floor(data.createdDate / 1000)}:R>
    Silinme Tarihi: <t:${Math.floor(data.deletedDate / 1000)}:R>

    **Silinen Mesaj**
    ${data.messageContent}

    `); message.channel.send({ embeds: [embed] });

     },

  };