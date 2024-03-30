const { Events } = require("discord.js");
const { JoinedAt, VoiceStat, VoiceUserChannel  } = require("../../../../../../Global/Models");
const System = require("../../../../../../Global/Settings/System");
const tasks = require("../../../../../../Global/Schemas/tasks");
const userTask = require("../../../../../../Global/Schemas/userTask");

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
if ((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;

if (!oldState.channelId && newState.channelId) await JoinedAt.findOneAndUpdate({ userID: newState.id },{ $set: { Date: Date.now() } },  { upsert: true });

let joinedAtData = await JoinedAt.findOne({ userID: oldState.id });
if (!joinedAtData) await JoinedAt.findOneAndUpdate({ userID: oldState.id },{ $set: { Date: Date.now() } },  { upsert: true });
joinedAtData = await JoinedAt.findOne({ userID: oldState.id });
const data = Date.now() - joinedAtData.Date;

if (oldState.channelId && !newState.channelId) {
await DbSave(oldState, oldState.channel, data);
await JoinedAt.deleteOne({ userID: oldState.id });

// Görev 

const checkForTask = await userTask.findOne({ userId: oldState.id });

const member = oldState.guild.members.cache.get(oldState.id);

if (!checkForTask) {
    new userTask({
        userId: oldState.id,
        roleId: member.roles.highest.id
    }).save()
}

const dataForTask = await userTask.findOne({ userId: oldState.id });

if (dataForTask) {
    const activeTask = await tasks.findOne({ currentRole: dataForTask.roleId })
    
    if (activeTask) {
        if (!dataForTask.completeds?.voice && dataForTask.counts?.voice > activeTask.requiredCounts.voice) {
            await userTask.findOneAndUpdate(
                { userId: oldState.id },
                { $set: {'counts.voice': 0, 'completeds.voice': true} },
                { upsert: true, new: true }
            )
        } else {
            await userTask.findOneAndUpdate(
                { userId: oldState.id },
                { $inc: { 'counts.voice': data } },
                { upsert: true, new: true }
            )
        }
    }
}

// Görev

} else if (oldState.channelId && newState.channelId) {
await DbSave(oldState, oldState.channel, data);
await JoinedAt.updateOne({ userID: oldState.id },{ $set: { Date: Date.now() } },  { upsert: true });
// Görev 

const checkForTask = await userTask.findOne({ userId: oldState.id });

const member = oldState.guild.members.cache.get(oldState.id);

if (!checkForTask) {
    new userTask({
        userId: oldState.id,
        roleId: member.roles.highest.id
    }).save()
}

const dataForTask = await userTask.findOne({ userId: oldState.id });

if (dataForTask) {
    const activeTask = await tasks.findOne({ currentRole: dataForTask.roleId })
    
    if (activeTask) {
        if (!dataForTask.completeds?.voice && dataForTask.counts?.voice > activeTask.requiredCounts.voice) {
            await userTask.findOneAndUpdate(
                { userId: oldState.id },
                { $set: {'counts.voice': 0, 'completeds.voice': true} },
                { upsert: true, new: true }
            )
        } else {
            await userTask.findOneAndUpdate(
                { userId: oldState.id },
                { $inc: { 'counts.voice': data } },
                { upsert: true, new: true }
            )
        }
    }
}

// Görev

}

async function DbSave(user, channel, data) {
await VoiceStat.findOneAndUpdate({ guildID: System.ServerID, userID: user.id },{ $inc: { TotalStat: data, DailyStat: data, WeeklyStat: data, MonthlyStat: data } }, { upsert: true });
await VoiceUserChannel.findOneAndUpdate({ guildID: System.ServerID, userID: user.id, ChannelID: channel.id}, { $inc: { ChannelData: data } }, { upsert: true });
}
});

