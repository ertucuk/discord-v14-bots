const { Events } = require("discord.js");
const { JoinedAt3, CameraStat, CameraUserChannel  } = require("../../../../../../Global/Models");
const System = require("../../../../../../Global/Settings/System");

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
if ((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;

if (oldState.channelId && !oldState.selfVideo && newState.channelId && newState.selfVideo) await JoinedAt3.findOneAndUpdate({ userID: newState.id },{ $set: { Date: Date.now() } },  { upsert: true });
let joinedAtData2 = await JoinedAt3.findOne({ userID: oldState.id });
if (!joinedAtData2) await JoinedAt3.findOneAndUpdate( { userID: oldState.id },{ $set: { Date: Date.now() } },  { upsert: true });
joinedAtData2 = await JoinedAt3.findOne({ userID: oldState.id });
const data2 = Date.now() - joinedAtData2.Date;
    
if (oldState.selfVideo && !newState.selfVideo) {
await DbSave(oldState, oldState.channel, data2);
await JoinedAt3.deleteOne( { userID: oldState.id }); 
} else if (oldState.channelId && oldState.selfVideo && newState.channelId && newState.selfVideo) {
await DbSave(oldState, oldState.channel, data2);
await JoinedAt3.updateOne( { userID: oldState.id },{ $set: { Date: Date.now() } },  { upsert: true });
}

async function DbSave(user, channel, data) {
await CameraStat.findOneAndUpdate({ guildID: System.ServerID, userID: user.id },{ $inc: { TotalStat:data, DailyStat: data, WeeklyStat: data, MonthlyStat: data } },  { upsert: true });
await CameraUserChannel.findOneAndUpdate({ guildID: System.ServerID, userID: user.id, ChannelID: channel.id}, { $inc: { ChannelData: data } }, { upsert: true });
}
});
