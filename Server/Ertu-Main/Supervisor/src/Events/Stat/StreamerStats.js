const { Events } = require("discord.js");
const { JoinedAt2, StreamerStat, StreamerUserChannel  } = require("../../../../../../Global/Models");
const System = require("../../../../../../Global/Settings/System");

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
if ((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;

if (oldState.channelId && !oldState.streaming && newState.channelId && newState.streaming) await JoinedAt2.findOneAndUpdate({ userID: newState.id },{ $set: { Date: Date.now() } },  { upsert: true });
let joinedAtData2 = await JoinedAt2.findOne({ userID: oldState.id });
if (!joinedAtData2) await JoinedAt2.findOneAndUpdate({ userID: oldState.id },{ $set: { Date: Date.now() } },  { upsert: true });
joinedAtData2 = await JoinedAt2.findOne({ userID: oldState.id });
const data2 = Date.now() - joinedAtData2.Date;
    
if (oldState.streaming && !newState.streaming) {
await DbSave(oldState, oldState.channel, data2);
await JoinedAt2.deleteOne({ userID: oldState.id }); 
} else if (oldState.channelId && oldState.streaming && newState.channelId && newState.streaming) {
await DbSave(oldState, oldState.channel, data2);
await JoinedAt2.updateOne({ userID: oldState.id },{ $set: { Date: Date.now() } },  { upsert: true });
}


async function DbSave(user, channel, data) {
await StreamerStat.findOneAndUpdate({ guildID: System.ServerID, userID: user.id },{ $inc: { TotalStat: data, DailyStat: data, WeeklyStat: data, MonthlyStat: data } },  { upsert: true });
await StreamerUserChannel.findOneAndUpdate({ guildID: System.ServerID, userID: user.id, ChannelID: channel.id}, { $inc: { ChannelData: data } }, { upsert: true });
}
});

