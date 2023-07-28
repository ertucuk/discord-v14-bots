const { ApplicationCommandOptionType,EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,PermissionsBitField } = require("discord.js");
const coin = require("../../schemas/coin");
const taggeds = require("../../schemas/taggeds");
const tagli = require("../../schemas/taggorev");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const ertucuk = require("../../../../../../Global/Settings/System");
const kanal = require("../../../../../../Global/Settings/AyarName");

module.exports = {
    name: "tagaldır",
    description: "tag aldırır",
    category: "RANK",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["tag-aldır"],
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

      let kanallar = kanal.KomutKullanımKanalİsim;
      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

      if (!ertum.ConfirmerRoles.some(ertucum => message.member.roles.cache.has(ertucum)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) 
        {
        
        message.channel.send({ content:"Bir üye belirtmeyi unuttun!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
        if (!member.user.displayName.includes(ertum.ServerTag)) 
        { 
      
        message.channel.send({ content:"Bu üyede tagımız bulunmuyor!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
        const taggedData = await taggeds.findOne({ guildID: message.guild.id, userID: message.author.id });
        if (taggedData && taggedData.taggeds.includes(member.user.id)) 
        {
        
        message.channel.send({ content:"Bu üyeye zaten daha önce tag aldırmışsın!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
    
        
        const taglıembed = new EmbedBuilder() 
        .setFooter({text: ertucuk.SubTitle})
        .setDescription(`${member.toString()} üyesi ${message.member.toString()} tarafından taglı olarak işaretlendi.`)
        const msg = await message.reply({ embeds: [taglıembed]});
        await coin.findOneAndUpdate({ guildID: ertucuk.ServerID, userID: message.author.id }, { $inc: { coin: ertucuk.Mainframe.taggedCoin } }, { upsert: true });
        await tagli.findOneAndUpdate({ guildID: ertucuk.ServerID, userID: message.author.id }, { $inc: { tagli: 1 } }, { upsert: true });
        await taggeds.findOneAndUpdate({guildID:message.guild.id,userID:message.member.id},{$inc:{count:1},$push:{users:{memberId:member.id,date:Date.now()}}},{upsert:true})

        },

    onSlash: async function (client, interaction) { },
  };