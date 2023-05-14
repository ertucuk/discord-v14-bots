

const joinedAt = require("../../schemas/voiceJoinedAt");
const voiceUser = require("../../schemas/voiceUser");
const voiceGuild = require("../../schemas/voiceGuild");
const voiceGuildChannel = require("../../schemas/voiceGuildChannel");
const voiceUserChannel = require("../../schemas/voiceUserChannel");
const voiceUserParent = require("../../schemas/voiceUserParent");
const { EmbedBuilder, Events } = require("discord.js");
const coin = require("../../schemas/coin");
const ertum = require("../../Settings/Setup.json");
const dolar = require("../../schemas/dolar")
const ertucuk = require("../../Settings/System");
const client = global.client;
const moment = require("moment");

client.on("voiceStateUpdate", async (oldState, newState) => {
    if((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;

    if(!oldState.channelId && newState.channelId) await joinedAt.findOneAndUpdate({ userID: newState.id }, { $set: { date: Date.now() } }, { upsert: true });

    let joinedAtData = await joinedAt.findOne({ userID: oldState.id });

    if(!joinedAtData) await joinedAt.findOneAndUpdate({ userID: newState.id }, { $set: { date: Date.now() } }, { upsert: true });
    joinedAtData = await joinedAt.findOne({ userID: newState.id });
    const vData = Date.now() - joinedAtData.date;

    if(oldState.channelId && !newState.channelId){
        await saveData(oldState, oldState.channel, vData);
        await joinedAt.deleteOne({ userID: oldState.id });
        oldState.member.send(`${oldState.guild.name} sunucusunda <#${oldState.channelId}> kanalında **${moment(vData).format("m [dakika] s [saniye]")}** boyunca seste kaldın.`).catch(() => console.log("dm kapalı"));            
    } else if(oldState.channelId && newState.channelId){
        await saveDatas(oldState, oldState.channel, vData);
        await joinedAt.findOneAndUpdate({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
    }

    if(!oldState.streaming && newState.streaming) await joinedAt.findOneAndUpdate({ userID: newState.id }, { $set: { streamDate: Date.now() }}, { upsert: true });

    if(oldState.streaming && !newState.streaming) {
        let streamData = await joinedAt.findOne({ userID: oldState.id });
        if(!streamData) return;
        let calculatedData = Date.now() - streamData.streamDate;
        await voiceUser.findOneAndUpdate({ guildID: ertucuk.ServerID, userID: oldState.id }, {
            $inc: {
                streamStat: calculatedData
            }
        }, { upsert: true });
        client.channels.cache.get("1082067471688810517").send({ content: `c${moment.duration(calculatedData).asSeconds()}` })
        await joinedAt.deleteOne({ userID: oldState.id, streamDate: streamData.streamDate  });
    }
    
    async function saveData(user, channel, data) {
        await voiceUser.findOneAndUpdate({ guildID: ertucuk.ServerID, userID: user.id }, { $inc: { topStat: data, dailyStat: data, weeklyStat: data, twoWeeklyStat: data } }, { upsert: true });
        await voiceGuild.findOneAndUpdate({ guildID: ertucuk.ServerID }, { $inc: { topStat: data, dailyStat: data, weeklyStat: data, twoWeeklyStat: data } }, { upsert: true });
        await voiceUserChannel.findOneAndUpdate({ guildID: ertucuk.ServerID, channelID: channel.id }, { $inc: { channelData: data } }, { upsert: true });
        if (channel.parent) await voiceUserParent.findOneAndUpdate({ guildID: ertucuk.ServerID, userID: user.id, parentID: channel.parentId }, { $inc: { parentData: data } }, { upsert: true });
      
        await client.checkLevel(user.id, ertucuk.ServerID, "ses")
        levelVoiceXP(user.id, channel.id, data, data / 1000, channel.parentId);
      
        if (channel.parent && ertum.PublicRoomsCategory.includes(channel.parentId)) {
            if (data >= (1000 * 60) * ertucuk.Moderation.voiceCount) await dolar.findOneAndUpdate({ guildID: ertucuk.ServerID, userID: user.id }, { $inc: { dolar: ertucuk.Moderation.voiceDolar * parseInt(data/1000/60) } }, { upsert: true });
          } else if (data >= (1000 * 60) * ertucuk.Moderation.voiceCount) await dolar.findOneAndUpdate({ guildID: ertucuk.ServerID, userID: user.id }, { $inc: { dolar: ertucuk.Moderation.voiceDolar * parseInt(data/1000/60) } }, { upsert: true });
      }

    async function saveDatas(user, channel, data) {
        if (ertum.StaffManagmentRoles.some(x => user.member.roles.cache.has(x))) {
        if (channel.parent && ertum.PublicRoomsCategory.includes(channel.parentId)) {
            if (data >= (1000 * 60) * ertucuk.Moderation.voiceCount) await coin.findOneAndUpdate({ guildID: user.guild.id, userID: user.id }, { $inc: { coin: Math.floor(parseInt(data/1000/60) / ertucuk.Moderation.voiceCount) * ertucuk.Moderation.publicCoin } }, { upsert: true });
        } else if (data >= (1000 * 60) * ertucuk.Moderation.voiceCount) await coin.findOneAndUpdate({ guildID: user.guild.id, userID: user.id }, { $inc: { coin: Math.floor(parseInt(data/1000/60) / ertucuk.Moderation.voiceCount) * ertucuk.Moderation.voiceCoin } }, { upsert: true });
        }
    }
});
