const { ApplicationCommandOptionType,EmbedBuilder } = require("discord.js");
const ertum = require("../../../../../../Global/Settings/System");
const messageUser = require("../../../../../../Global/Schemas/messageUser");
const voiceUser = require("../../../../../../Global/Schemas/voiceUser");
const leaderboard = require("../../../../../../Global/Schemas/mainleaderboard");
const moment = require('moment')
require('moment-duration-format')
const canvafy = require('canvafy')

module.exports = {
    name: "leaderboard",
    description: "Top 10 Mesaj Sıralamayı gösterir",
    category: "OWNER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: [],
      usage: ".leaderboard",
    },

    onLoad: function (client) { },

    onCommand: async function (client, message, args) {

        const messageUsersData = await messageUser.find({ guildID: ertum.ServerID }).sort({ topStat: -1 });
        const voiceUsersData = await voiceUser.find({ guildID: ertum.ServerID }).sort({ topStat: -1 });

        let voiceUsers = voiceUsersData.splice(0, 10).filter(x => Number(x.topStat) > 0 && message.guild.members.resolve(x.userID))
        let messageUsers = messageUsersData.splice(0, 10).filter(x => x.topStat > 0 && message.guild.members.resolve(x.userID))

        const top = await new canvafy.Top()
        .setOpacity(0.6)
        .setScoreMessage("Mesaj:")
        .setabbreviateNumber(false)
        .setBackground("color", "#5A5A5A")
        .setColors({ box: '#212121', username: '#ffffff', score: '#ffffff', firstRank: '#f7c716', secondRank: '#9e9e9e', thirdRank: '#94610f' })
        .setUsersData(messageUsers.map((x, i) => {
        let user = message.guild.members.cache.get(x.userID)
        return { top: i+1,  avatar: user.user.avatar !== null ? `https://cdn.discordapp.com/avatars/${user.user.id}/${user.user.avatar}.png` : "https://cdn.discordapp.com/attachments/1102669633372311675/1116873769823256596/0oO5sAneb9lJP6l8c6DH4aj6f85qNpplQVHmPmbbBxAukDnlO7DarDW0b-kEIHa8SQ.png", tag: user.nickname !== null ? user.nickname : user.user.username, score: Number(x.topStat) || 0 }
        }))
        .build();

        const top2 = await new canvafy.Top()
        .setOpacity(0.6)
        .setScoreMessage("Süre:") 
        .setabbreviateNumber(false)
        .setBackground("color", "#5A5A5A")
        .setColors({ box: '#212121', username: '#ffffff', score: '#ffffff', firstRank: '#f7c716', secondRank: '#9e9e9e', thirdRank: '#94610f' })
        .setUsersData(voiceUsers.map((x, i) => {
        let user = message.guild.members.cache.get(x.userID)
        return { top: i+1,  avatar: user.user.avatar !== null ? `https://cdn.discordapp.com/avatars/${user.user.id}/${user.user.avatar}.png` : "https://cdn.discordapp.com/attachments/1102669633372311675/1116873769823256596/0oO5sAneb9lJP6l8c6DH4aj6f85qNpplQVHmPmbbBxAukDnlO7DarDW0b-kEIHa8SQ.png", tag: user.nickname !== null ? user.nickname : user.user.username, score: `${moment.duration(x.topStat).format("D [Gün], H [sa], m [dk]")}` || 0 } 
        }))
        .build();

        let msg1 = await message.channel.send({ content: `Mesaj sıralaması <t:${Math.floor(Date.now() / 1000)}:R> güncellendi.`, files: [{ attachment: top, name: `messageTop.png` }] })
        let msg2 = await message.channel.send({ content: `Ses sıralaması <t:${Math.floor(Date.now() / 1000)}:R> güncellendi.`, files: [{ attachment: top2, name: `voiceTop.png` }] })
        
        await leaderboard.findOneAndUpdate({ guildID: message.guild.id }, { $set: { messageChannel: message.channel.id, voiceListID: msg2.id, messageListID: msg1.id}}, { upsert: true })

    

     },

    onSlash: async function (client, interaction) { },  
  };