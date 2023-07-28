const ertucuk = require("../../../../../../Global/Settings/System");
const messageUser = require("../../schemas/messageUser");
const voiceUser = require("../../schemas/voiceUser");
const moment = require("moment");
const { EmbedBuilder } = require("discord.js");
const client = global.client;
var CronJob = require('cron').CronJob;
const canvafy = require('canvafy')
const mainleaderboard = require("../../schemas/mainleaderboard");

client.on("ready", async () => {

  let guild = client.guilds.resolve(ertucuk.ServerID)
  if(!guild) return;
  let voiceLeader, messageLeader;

  try {

    let ldb = await mainleaderboard.findOne({ guildID: guild.id })
    if(!ldb) return;

    let channel = guild.channels.resolve(ldb?.messageChannel)
    if(!channel) return;

    voiceLeader = await channel?.messages?.fetch(ldb?.voiceListID), messageLeader = await channel?.messages?.fetch(ldb?.messageListID)
        if(!voiceLeader || !messageLeader) return;
        } catch(err) {
            await mainleaderboard.deleteOne({ guildID: guild.id }, { upsert: true })
        }

        let voiceUsersData = await messageUser.find({ guildID: guild.id }).sort({ topStat: -1 })
        let messageUsersData = await voiceUser.find({ guildID: guild.id }).sort({ topStat: -1 })

        let voiceUsers = voiceUsersData.splice(0, 10).filter(x => Number(x.topStat) > 0 && guild.members.resolve(x.userID))
        let messageUsers = messageUsersData.splice(0, 10).filter(x => x.topStat > 0 && guild.members.resolve(x.userID))
        
        setInterval(() => {
        messageLeaderBoard()
        voiceLeaderBoard()
        }, 30000);  

        async function messageLeaderBoard() {

          const top = await new canvafy.Top()
          .setOpacity(0.6)
          .setScoreMessage("Mesaj:")
          .setabbreviateNumber(false)
          .setBackground("color", "#5A5A5A")
          .setColors({ box: '#212121', username: '#ffffff', score: '#ffffff', firstRank: '#f7c716', secondRank: '#9e9e9e', thirdRank: '#94610f' })
          .setUsersData(messageUsers.map((x, i) => {
          let user = guild.members.cache.get(x.userID)
          return { top: i+1,  avatar: user.user.avatar !== null ? `https://cdn.discordapp.com/avatars/${user.user.id}/${user.user.avatar}.png` : "https://cdn.discordapp.com/attachments/1102669633372311675/1116873769823256596/0oO5sAneb9lJP6l8c6DH4aj6f85qNpplQVHmPmbbBxAukDnlO7DarDW0b-kEIHa8SQ.png", tag: user.nickname !== null ? user.nickname : user.user.username, score: Number(x.topStat) || 0 }
          }))
          .build();

          await messageLeader.edit({ content: `Mesaj sıralaması <t:${Math.floor(Date.now() / 1000)}:R> güncellendi.`, files: [{ attachment: top, name: `messageTop.png` }] })
      }
      async function voiceLeaderBoard() {

          const top2 = await new canvafy.Top()
          .setOpacity(0.6)
          .setScoreMessage("Süre:") 
          .setabbreviateNumber(false)
          .setBackground("color", "#5A5A5A")
          .setColors({ box: '#212121', username: '#ffffff', score: '#ffffff', firstRank: '#f7c716', secondRank: '#9e9e9e', thirdRank: '#94610f' })
          .setUsersData(voiceUsers.map((x, i) => {
          let user = guild.members.cache.get(x.userID)
          return { top: i+1,  avatar: user.user.avatar !== null ? `https://cdn.discordapp.com/avatars/${user.user.id}/${user.user.avatar}.png` : "https://cdn.discordapp.com/attachments/1102669633372311675/1116873769823256596/0oO5sAneb9lJP6l8c6DH4aj6f85qNpplQVHmPmbbBxAukDnlO7DarDW0b-kEIHa8SQ.png", tag: user.nickname !== null ? user.nickname : user.user.username, score: `${moment.duration(x.topStat).format("D [Gün], H [sa], m [dk]")}` || 0 } 
          }))
          .build();

          await voiceLeader.edit({ content: `Ses sıralaması <t:${Math.floor(Date.now() / 1000)}:R> güncellendi.`, files: [{ attachment: top2, name: `voiceTop.png` }] })
      }
});