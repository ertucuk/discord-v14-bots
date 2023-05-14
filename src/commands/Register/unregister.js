const { ApplicationCommandOptionType,PermissionsBitField, EmbedBuilder } = require("discord.js");
const ertum = require("../../Settings/setup.json");
const { red, green } = require("../../Settings/Emojis.json");
const ertucuk = require("../../Settings/System");

module.exports = {
    name: "unregister",
    description: "belirttiğiniz üyeyi kayıtsıza atar.",
    category: "NONE",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["ks","kayıtsız","kayitsiz"],
      usage: "",
    },
    slashCommand: {
      enabled: true,
      options: [
        {
            name: "kayıtsız",
            description: "kayıtsıza atar",
            type: ApplicationCommandOptionType.Subcommand,
        },
      ],
    },

    onLoad: function (client) { },

    onCommand: async function (client, message, args) {
        if(!ertum.ConfirmerRoles.some(rol => message.member.roles.cache.has(rol)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
        {
        message.react(red)
        message.reply({ content:`Yeterli yetkin yok!`}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) 
        {
        message.react(red)
        message.reply({ content:"bir kullanıcı etiketlemelisin ya da ID'sini girmelisin."}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
        if (!message.member.permissions.has(8n) && member.roles.highest.position >= message.member.roles.highest.position) 
        {
        message.react(red) 
        message.reply({ content:"Kendinle aynı yetkide ya da daha yetkili olan birini kayıtsıza atamazsın!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
        if (!member.manageable) 
        {
        message.react(red)
        message.reply({ content: "Bu üyeyi kayıtsıza atamıyorum!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
        message.react(green)
        member.roles.set(ertum.UnRegisteredRoles);
        member.setNickname(`${ertum.ServerUntagged} İsim | Yaş`)
        message.channel.send({ embeds: [ new EmbedBuilder().setFooter({text: ertucuk.SubTitle}).setDescription(`${green} ${member} üyesi başarıyla ${message.author} tarafından kayıtsıza atıldı.`)]}).then((e) => setTimeout(() => { e.delete(); }, 5000));
      
     },

    onSlash: async function (client, interaction) { },
  };