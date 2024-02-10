const ertucuk = require("../../../../../Global/Settings/System");
const mainleaderboard = require("../../../../../Global/Schemas/mainleaderboard");
const { MessageStat, MessageUserChannel, VoiceStat, VoiceUserChannel, StreamerStat, StreamerUserChannel, CameraStat, CameraUserChannel } = require("../../../../../Global/Models")



const moment = require("moment");

const canvafy = require('canvafy')

class Tasks {
    constructor(client) {
        this.client = client;
    }

    async updateLeaderboards() {
        const guild = this.client.guilds.cache.get(ertucuk.ServerID);

        if (!guild) return
        
        const data = await mainleaderboard.findOne({ guildID: guild.id })

        if (!data) return;

        const channel = guild.channels.cache.get(data.messageChannel)

        if (!channel) return await mainleaderboard.deleteOne({ guildID: guild.id });

        await channel.messages.fetch()

        const messageBoard = channel.messages.cache.get(data.messageListID)
        const voiceBoard = channel.messages.cache.get(data.voiceListID)

        if (!messageBoard || !voiceBoard) return await mainleaderboard.deleteOne({ guildID: guild.id });

        const voiceUsersData = await VoiceStat.find( {guildID: message.guild.id}).sort({ TotalStat: -1 });
        const messageUsersData = await MessageStat.find({guildID: message.guild.id}).sort({ TotalStat: -1 });
        
        const messageUsers = messageUsersData.splice(0, 10).filter(x => x.TotalStat > 0 && guild.members.cache.get(x.userID))
        const voiceUsers = voiceUsersData.splice(0, 10).filter(x => x.TotalStat > 0 && guild.members.cache.get(x.userID))

        const messageTop = await new canvafy.Top()
            .setOpacity(0.6)
            .setScoreMessage("Mesaj:")
            .setabbreviateNumber(false)
            .setBackground("color", "#5A5A5A")
            .setColors({ box: '#212121', username: '#ffffff', score: '#ffffff', firstRank: '#f7c716', secondRank: '#9e9e9e', thirdRank: '#94610f' })
            .setUsersData(messageUsers.map((x, i) => {
                const member = guild.members.cache.get(x.userID)
                
                if (!member) {
                    return
                }
                
                return { top: i + 1,  avatar: member.user.avatar !== null ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png` : "https://cdn.discordapp.com/attachments/1102669633372311675/1116873769823256596/0oO5sAneb9lJP6l8c6DH4aj6f85qNpplQVHmPmbbBxAukDnlO7DarDW0b-kEIHa8SQ.png", tag: member.nickname !== null ? member.nickname : member.user.username, score: Number(x.TotalStat) || 0 }
            }))
            .build();

         const voiceTop = await new canvafy.Top()
            .setOpacity(0.6)
            .setScoreMessage("Süre:") 
            .setabbreviateNumber(false)
            .setBackground("color", "#5A5A5A")
            .setColors({ box: '#212121', username: '#ffffff', score: '#ffffff', firstRank: '#f7c716', secondRank: '#9e9e9e', thirdRank: '#94610f' })
            .setUsersData(voiceUsers.map((x, i) => {
                const member = guild.members.cache.get(x.userID)

                if (!member) {
                    return
                }

                return { top: i + 1,  avatar: member.user.avatar !== null ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png` : "https://cdn.discordapp.com/attachments/1102669633372311675/1116873769823256596/0oO5sAneb9lJP6l8c6DH4aj6f85qNpplQVHmPmbbBxAukDnlO7DarDW0b-kEIHa8SQ.png", tag: member.nickname !== null ? member.nickname : member.user.username, score: `${moment.duration(x.TotalStat).format("D [Gün], H [sa], m [dk]")}` || 0 } 
            }))
            .build();

            try {
                await messageBoard.edit({ content: `Mesaj sıralaması <t:${Math.floor(Date.now() / 1000)}:R> güncellendi.`, files: [{ attachment: messageTop, name: `messageTop.png` }] })
                await voiceBoard.edit({ content: `Ses sıralaması <t:${Math.floor(Date.now() / 1000)}:R> güncellendi.`, files: [{ attachment: voiceTop, name: `voiceTop.png` }] })
            } catch (e) {
                console.log(e)
            }
            

    }
}

module.exports = {
    Tasks
}