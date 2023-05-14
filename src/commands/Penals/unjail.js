const { ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField } = require("discord.js");
const moment = require("moment");
moment.locale("tr");
const penals = require("../../schemas/penals");
const ertum = require("../../Settings/Setup.json");
const ertucuk = require("../../Settings/System");
const { red, green} = require("../../Settings/Emojis.json")
const { BsonDatabase,JsonDatabase,YamlDatabase } = require("five.db");
const db = new YamlDatabase();

module.exports = {
    name: "unjail",
    description: "",
    category: "NONE",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["jailkaldır"],
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
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !ertum.JailHammer.some(x => message.member.roles.cache.has(x))) 
    {
    message.react(red)
    message.channel.send({ content:"Yeterli yetkin bulunmuyor!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) {
    message.react(red)
    message.channel.send({ content:"Bir üye belirtmelisin!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    if (!ertum.JailedRoles.some(x => member.roles.cache.has(x))) 
    {
    message.react(red)
    message.channel.send({ content:"Bu üye jailde değil!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && member.roles.highest.position >= message.member.roles.highest.position) 
    {
    message.react(red)
    message.channel.send({ content:"Kendinle aynı yetkide ya da daha yetkili olan birinin jailini kaldıramazsın!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    if (!member.manageable) {
    message.react(red)  
    message.channel.send({ content:"Bu üyeyi jailden çıkaramıyorum!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    let logChannel = client.channels.cache.find(x => x.name === "jail_log");
    if(!logChannel) {
      let hello = new Error("JAIL LOG KANALI AYARLANMAMIS! LUTFEN SETUPTAN KURULUMU YAPINIZ!");
      console.log(hello);
    }

    member.roles.remove(ertum.JailedRoles)
    member.roles.cache.has(ertum.BoosterRole) ? member.roles.set([ertum.BoosterRole, ertum.UnregisteredRoles[0]]) : member.roles.set(ertum.UnregisteredRoles)
    db.push(`kullanıcı`,`${member.user.id}, tarih`,`<t:${(Date.now() / 1000).toFixed()}> `)
    message.react(green)
    message.reply({ content:`${green} ${member.toString()} üyesinin jaili ${message.author} tarafından kaldırıldı!`}).then((e) => setTimeout(() => { e.delete(); }, 50000));
    if (ertucuk.Moderation.dmMessages) member.send({ content:`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından, jailiniz kaldırıldı!`}).catch(() => {});

const log = new EmbedBuilder()
.setAuthor({ name: member.user.username, iconURL:  member.user.displayAvatarURL({ dynamic: true }) })
.setDescription(`
 **${member.user.tag}** adlı kullanıcının **${message.author.tag}** tarafından Jail cezası kaldırıldı.    
`)
.addFields(
{ name: "Affedilen", value: `${member ? member.toString() : user.username}`, inline: true},
{ name: "Affeden", value: `${message.author}`, inline: true},
{ name: "Ceza Bitiş", value: `<t:${Math.floor((Date.now()) / 1000)}:R>`, inline: true},
)
.setFooter({ text:`${moment(Date.now()).format("LLL")}` })
 await logChannel.send({ embeds: [log]});
     },

    onSlash: async function (client, interaction) { },
  };