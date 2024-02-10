const { Events } = require("discord.js");
const chatFriend = require("../../../../../../Global/Schemas/chatFriend");
const MessageStat  = require("../../../../../../Global/Models/MessageStat");
const MessageUserChannel = require("../../../../../../Global/Models/MessageUserChannel");
const System = require("../../../../../../Global/Settings/System");
const ertucuk = require("../../../../../../Global/Settings/System");
const userTask = require("../../../../../../Global/Schemas/userTask");
const tasks = require("../../../../../../Global/Schemas/tasks");

client.on(Events.MessageCreate, async (message) => {
if (message.author.bot || !message.guild || message.content.startsWith(...System.Mainframe.Prefixs)) return;

const check = await userTask.findOne({ userId: message.author.id });

if (!check) {
    new userTask({
        userId: message.author.id,
        roleId: message.member.roles.highest.id
    }).save()
}

const data = await userTask.findOne({ userId: message.author.id });

if (data) {
    const activeTask = await tasks.findOne({ currentRole: data.roleId })
    
    if (activeTask) {
        if (!data.completeds?.message && data.counts?.message > activeTask.requiredCounts.message) {
            await userTask.findOneAndUpdate(
                { userId: message.author.id },
                { $set: {'counts.message': 0, 'completeds.message': true} },
                { upsert: true, new: true }
            )
        } else {
            await userTask.findOneAndUpdate(
                { userId: message.author.id },
                { $inc: { 'counts.message': 1 } },
                { upsert: true, new: true }
            )
        }
    }
}

const repliedMessage = message.reference?.messageId ? message.channel.messages.cache.get(message.reference.messageId) : null;
if (repliedMessage) {
const repliedUserID = repliedMessage.author.id;
const userId = repliedUserID;
await chatFriend.findOneAndUpdate({ userID: userId, repliedUser: message.author.id },{ $inc: { yanitSayi: 1 } }, { new: true, upsert: true })
}
await MessageStat.findOneAndUpdate({ guildID: ertucuk.ServerID, userID: message.author.id }, { $inc: { TotalStat: 1, DailyStat: 1, WeeklyStat: 1, MonthlyStat: 1 } },  { upsert: true })
await MessageUserChannel.findOneAndUpdate({ guildID: ertucuk.ServerID, userID: message.author.id, ChannelID: message.channel.id, ChannelName: message.channel.name }, { $inc: { ChannelData: 1 } },{upsert: true });
});
