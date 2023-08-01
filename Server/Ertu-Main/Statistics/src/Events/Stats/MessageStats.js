const ertum = require("../../../../../../Global/Settings/Setup.json")
const ertucuk = require("../../../../../../Global/Settings/System");
const messageUser = require("../../../../../../Global/Schemas/messageUser");
const messageGuild = require("../../../../../../Global/Schemas/messageGuild");
const guildChannel = require("../../../../../../Global/Schemas/messageGuildChannel");
const userChannel = require("../../../../../../Global/Schemas/messageUserChannel");
const coin = require("../../../../../../Global/Schemas/coin");
const client = global.client;
const nums = new Map();
const mesaj = require("../../../../../../Global/Schemas/mesajgorev");
const dolar = require("../../../../../../Global/Schemas/dolar");
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