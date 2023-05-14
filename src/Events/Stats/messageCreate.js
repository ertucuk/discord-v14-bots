const ertum = require("../../Settings/Setup.json");
const ertucuk = require("../../Settings/System")
const messageUser = require("../../schemas/messageUser");
const messageGuild = require("../../schemas/messageGuild");
const guildChannel = require("../../schemas/messageGuildChannel");
const userChannel = require("../../schemas/messageUserChannel");
const coin = require("../../schemas/coin");
const client = global.client;
const nums = new Map();
const mesaj = require("../../schemas/mesajgorev");
const dolar = require("../../schemas/dolar");
const { Events } = require("discord.js")


client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild || message.content.startsWith(ertucuk.Moderation.Prefixs)) return;
    if (ertum.StaffManagmentRoles.some(x => message.member.roles.cache.has(x))) {
      const num = nums.get(message.author.id);
      if (num && (num % ertucuk.Moderation.messageCount) === 0) {
        nums.set(message.author.id, num + 1);
        await coin.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: ertucuk.Moderation.messageCoin } }, { upsert: true });
      } else nums.set(message.author.id, num ? num + 1 : 1);
    }
  
    await messageUser.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { topStat: 1, dailyStat: 1, weeklyStat: 1, twoWeeklyStat: 1 } }, { upsert: true });
    await messageGuild.findOneAndUpdate({ guildID: message.guild.id }, { $inc: { topStat: 1, dailyStat: 1, weeklyStat: 1, twoWeeklyStat: 1 } }, { upsert: true });
    await guildChannel.findOneAndUpdate({ guildID: message.guild.id, channelID: message.channel.id }, { $inc: { channelData: 1 } }, { upsert: true });
    await userChannel.findOneAndUpdate({ guildID: message.guild.id,  userID: message.author.id, channelID: message.channel.id }, { $inc: { channelData: 1 } }, { upsert: true });
    if(dolar) {
    if(message.channel.id !== ertum.ChatChannel) return;
    await dolar.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { dolar: ertucuk.Moderation.messageDolar } }, { upsert: true });
    }
  const mesajData = await mesaj.findOne({ guildID: message.guild.id, userID: message.author.id });
  if(mesajData){
  if(message.channel.id !== ertum.ChatChannel ) return;
  await mesaj.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { mesaj: 1 } }, { upsert: true });
  }
})
  