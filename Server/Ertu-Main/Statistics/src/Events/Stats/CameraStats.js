const client = global.client;
const ertucuk = require("../../../../../../Global/Settings/System");
const ertum = require("../../../../../../Global/Settings/Setup.json")
const joinedAt = require("../../../../Supervisor/src/schemas/cameraJoinedAt");
const cameraUserChannel = require("../../../../Supervisor/src/schemas/cameraUserChannel");
const cameraUser = require("../../../../Supervisor/src/schemas/cameraUser");   

client.on("voiceStateUpdate", async(oldState, newState) => {

if (!oldState.selfVideo && newState.selfVideo) await joinedAt.findOneAndUpdate({ userID: newState.id }, { $set: { date: Date.now() } }, { upsert: true });
let joinedAtData3 = await joinedAt.findOne({ userID: oldState.id });
if (!joinedAtData3) await joinedAt.findOneAndUpdate({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
joinedAtData3 = await joinedAt.findOne({ userID: oldState.id });
const data3 = Date.now() - joinedAtData3.date;
    
if (oldState.selfVideo && !newState.selfVideo) {
await saveData(oldState, oldState.channel, data3);
await joinedAt.deleteOne({ userID: oldState.id });
} else if (oldState.selfVideo && newState.selfVideo) {
await saveData(oldState, oldState.channel, data3);
await joinedAt.updateOne({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
}    

async function saveData(user, channel, data3) {
await cameraUser.findOneAndUpdate({ guildID: ertucuk.ServerID, userID: user.id }, { $inc: { topStat: data3 } }, { upsert: true });
await cameraUserChannel.findOneAndUpdate({ guildID: ertucuk.ServerID, userID: user.id, channelID: channel.id }, { $inc: { channelData: data3 } }, { upsert: true });
} 

})