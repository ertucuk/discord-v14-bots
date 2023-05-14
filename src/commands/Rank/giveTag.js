const { ApplicationCommandOptionType,EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const coin = require("../../schemas/coin");
const taggeds = require("../../schemas/taggeds");
const tagli = require("../../schemas/taggorev");
const ertum = require("../../Settings/setup.json");
const ertucuk = require("../../Settings/System")
module.exports = {
    name: "tagaldır",
    description: "tag aldırır",
    category: "NONE",
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
        if (!ertum.StaffManagmentRoles.some(x => message.member.roles.cache.has(x))) return 
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) 
        {
        
        message.channel.send({ content:"Bir üye belirtmeyi unuttun!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
        if (!member.user.username.includes(ertum.ServerTag)) 
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
        .setDescription(`Başarıyla ${member.toString()} üyesine ${message.member.toString()} tarafından taglı olarak işaretlendi.  `)
        const msg = await message.reply({ embeds: [taglıembed]});

      const tagData = await tagli.findOne({ guildID: message.guild.id, userID: message.author.id });
      if (tagData)
      {
      await tagli.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { tagli: 1 } }, { upsert: true });
      }
      await taggeds.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $push: { taggeds: member.user.id } }, { upsert: true });
        },

    onSlash: async function (client, interaction) { },
  };