const { ApplicationCommandOptionType, ButtonStyle, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const axios = require('axios');
const { DiscordBanners } = require('discord-banners');
const ertucuk = require("../../Settings/System");

module.exports = {
    name: "banner",
    description: "kullanıcının bannerini gösterir",
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
            name: "ertu",
            description: "ertu",
            type: ApplicationCommandOptionType.Subcommand,
        },
      ],
    },

    onLoad: function (client) { },

    onCommand: async function (client, message, args) {
        const member = args.length > 0 ? message.mentions.users.first() || await client.users.fetch(args[0]) || message.author : message.author
        const discordBanners = new DiscordBanners(client);
        const banner = await discordBanners.getBanner(member.id, { size: 2048, format: "png", dynamic: true })
        if(banner){   
        let Link = new ActionRowBuilder({components:[new ButtonBuilder({label:"Tarayıcıda Aç", style:ButtonStyle.Link, url: banner})]})
        await message.reply({ embeds: [ new EmbedBuilder().setFooter({text: ertucuk.SubTitle}).setColor("#2b2d31").setImage(`${banner}`)] , components:[Link] })}
     },

    onSlash: async function (client, interaction) { },
  };