const ertum = require("../../../../../../Global/Settings/Setup.json")
const ertucuk = require("../../../../../../Global/Settings/System");
const messageUser = require("../../../../Supervisor/src/schemas/messageUser");
const messageGuild = require("../../../../Supervisor/src/schemas/messageGuild");
const guildChannel = require("../../../../Supervisor/src/schemas/messageGuildChannel");
const userChannel = require("../../../../Supervisor/src/schemas/messageUserChannel");
const coin = require("../../../../Supervisor/src/schemas/coin");
const client = global.client;
const nums = new Map();
const mesaj = require("../../../../Supervisor/src/schemas/mesajgorev");
const dolar = require("../../../../Supervisor/src/schemas/dolar");
const { Events } = require("discord.js")


client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild || message.content.startsWith(ertucuk.Mainframe.Prefixs)) return;
 
    await messageUser.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { topStat: 1, dailyStat: 1, weeklyStat: 1, twoWeeklyStat: 1 } }, { upsert: true });
    await messageGuild.findOneAndUpdate({ guildID: message.guild.id }, { $inc: { topStat: 1, dailyStat: 1, weeklyStat: 1, twoWeeklyStat: 1 } }, { upsert: true });
    await guildChannel.findOneAndUpdate({ guildID: message.guild.id, channelID: message.channel.id }, { $inc: { channelData: 1 } }, { upsert: true });
    await userChannel.findOneAndUpdate({ guildID: message.guild.id,  userID: message.author.id, channelID: message.channel.id, channelName: message.channel.name }, { $inc: { channelData: 1 } }, { upsert: true });
    if(dolar) {
    if(message.channel.id !== ertum.ChatChannel) return;
    await dolar.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { dolar: ertucuk.Mainframe.messageDolar } }, { upsert: true });
    }
    if(mesaj){
    if(message.channel.id !== ertum.ChatChannel) return;
    await mesaj.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { mesaj: 1 } }, { upsert: true });
    }
})