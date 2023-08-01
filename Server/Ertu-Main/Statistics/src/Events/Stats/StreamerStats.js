const client = global.client;
const ertucuk = require("../../../../../../Global/Settings/System");
const ertum = require("../../../../../../Global/Settings/Setup.json")
const joinedAt = require("../../../../../../Global/Schemas/streamerJoinedAt");
const streamerUserChannel = require("../../../../../../Global/Schemas/streamerUserChannel");
const streamerUser = require("../../../../../../Global/Schemas/streamerUser");   
const streamerGuild = require("../../../../../../Global/Schemas/streamerGuild");

client.on("voiceStateUpdate", async(oldState, newState) => {

if (oldState.channelId && !oldState.streaming && newState.channelId && newState.streaming) await joinedAt.findOneAndUpdate({ userID: newState.id }, { $set: { date: Date.now() } }, { upsert: true });
let joinedAtData2 = await joinedAt.findOne({ userID: oldState.id });
if (!joinedAtData2) await joinedAt.findOneAndUpdate({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
joinedAtData2 = await joinedAt.findOne({ userID: oldState.id });
const data2 = Date.now() - joinedAtData2.date;
    
if (oldState.streaming && !newState.streaming) {
await saveData(oldState, oldState.channel, data2);
await joinedAt.deleteOne({ userID: oldState.id });
} else if (oldState.channelId && oldState.streaming && newState.channelId && newState.streaming) {
await saveData(oldState, oldState.channel, data2);
await joinedAt.updateOne({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
}

async function saveData(user, channel, data2) {
await streamerUser.findOneAndUpdate({ guildID: ertucuk.ServerID, userID: user.id }, { $inc: { topStat: data2, dailyStat: data2, weeklyStat: data2 } }, { upsert: true });
await streamerUserChannel.findOneAndUpdate({ guildID: ertucuk.ServerID, userID: user.id, channelID: channel.id }, { $inc: { channelData: data2 } }, { upsert: true });
await streamerGuild.findOneAndUpdate({ guildID: ertucuk.ServerID }, { $inc: { topStat: data2, dailyStat: data2, weeklyStat: data2 } }, { upsert: true });
}

})