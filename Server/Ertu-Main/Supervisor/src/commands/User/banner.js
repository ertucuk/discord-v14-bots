const { ApplicationCommandOptionType, ButtonStyle, ActionRowBuilder, ButtonBuilder, EmbedBuilder,PermissionsBitField} = require("discord.js");
const axios = require('axios');
const { DiscordBanners } = require('discord-banners');
const kanal = require("../../../../../../Global/Settings/AyarName");

module.exports = {
    name: "banner",
    description: "Kullanıcının bannerini gösterir",
    category: "USER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: [],
      usage: ".banner",
    },
  

    onLoad: function (client) { },

    onCommand: async function (client, message, args) {
      let kanallar = kanal.KomutKullanımKanalİsim;
      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

    const member = args.length > 0 ? message.mentions.users.first() || await client.users.fetch(args[0]) || message.author : message.author
    async function ertuBanner(user, client) {
        const response = await axios.get(`https://discord.com/api/v9/users/${user}`, { headers: { 'Authorization': `Bot ${client.token}` } });
        if(!response.data.banner) return `Kullanıcının bannerini bulunmamaktadır!`
        if(response.data.banner.startsWith('a_')) return `https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.gif?size=512`
        else return(`https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.png?size=512`)
      }

      let banner = await ertuBanner(member.id, client)

      let msg = await message.channel.send({ content: `${banner}`})

  
     },

  };