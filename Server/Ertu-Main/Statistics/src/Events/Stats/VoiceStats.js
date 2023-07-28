const joinedAt = require("../../../../Supervisor/src/schemas/voiceJoinedAt");
const voiceUser = require("../../../../Supervisor/src/schemas/voiceUser");
const voiceGuild = require("../../../../Supervisor/src/schemas/voiceGuild");
const guildChannel = require("../../../../Supervisor/src/schemas/voiceGuildChannel");
const userChannel = require("../../../../Supervisor/src/schemas/voiceUserChannel");
const userParent = require("../../../../Supervisor/src/schemas/voiceUserParent");
const coin = require("../../../../Supervisor/src/schemas/coin");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const dolar = require("../../../../Supervisor/src/schemas/dolar")
const ertucuk = require("../../../../../../Global/Settings/System");
const client = global.client;

client.on("voiceStateUpdate", async (oldState, newState) => {
  
if ((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;

if (!oldState.channelId && newState.channelId) await joinedAt.findOneAndUpdate({ userID: newState.id }, { $set: { date: Date.now() } }, { upsert: true });
let joinedAtData = await joinedAt.findOne({ userID: oldState.id });
if (!joinedAtData) await joinedAt.findOneAndUpdate({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
joinedAtData = await joinedAt.findOne({ userID: oldState.id });
const data = Date.now() - joinedAtData.date;

if (oldState.channelId && !newState.channelId) {
    await saveData(oldState, oldState.channel, data);
    await joinedAt.deleteOne({ userID: oldState.id });
  } else if (oldState.channelId && newState.channelId) {
    await saveData(oldState, oldState.channel, data);
    await joinedAt.updateOne({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
  }

if (oldState.channelId && !newState.channelId) {
    await saveDatas(oldState, oldState.channel, data);
    await joinedAt.deleteOne({ userID: oldState.id });
} else if (oldState.channelId && newState.channelId) {
    await saveDatas(oldState, oldState.channel, data);
    await joinedAt.findOneAndUpdate({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
}

async function saveData(user, channel, data) {
    await voiceUser.findOneAndUpdate({ guildID: ertucuk.ServerID, userID: user.id }, { $inc: { topStat: data, dailyStat: data, weeklyStat: data, twoWeeklyStat: data } }, { upsert: true });
    await voiceGuild.findOneAndUpdate({ guildID: ertucuk.ServerID }, { $inc: { topStat: data, dailyStat: data, weeklyStat: data, twoWeeklyStat: data } }, { upsert: true });
    await guildChannel.findOneAndUpdate({ guildID: ertucuk.ServerID, channelID: channel.id }, { $inc: { channelData: data } }, { upsert: true });
    await userChannel.findOneAndUpdate({ guildID: ertucuk.ServerID, userID: user.id, channelID: channel.id }, { $inc: { channelData: data } }, { upsert: true });
    if (channel.parent) await userParent.findOneAndUpdate({ guildID: ertucuk.ServerID, userID: user.id, parentID: channel.parentId }, { $inc: { parentData: data } }, { upsert: true });
  
  
    if (channel.parent && ertum.PublicRoomsCategory.includes(channel.parentId)) {
      if (data >= (1000 * 60) * ertucuk.Mainframe.voiceCount) await dolar.findOneAndUpdate({ guildID: ertucuk.ServerID, userID: user.id }, { $inc: { dolar: ertucuk.Mainframe.voiceDolar * parseInt(data/1000/60) } }, { upsert: true });
    } else if (data >= (1000 * 60) * ertucuk.Mainframe.voiceCount) await dolar.findOneAndUpdate({ guildID: ertucuk.ServerID, userID: user.id }, { $inc: { dolar: ertucuk.Mainframe.voiceDolar * parseInt(data/1000/60) } }, { upsert: true });
  }
  
  async function saveDatas(user, channel, data) {
    let member = await client.guilds.cache.get(ertucuk.ServerID).members.fetch(user.id).then(m => m).catch(() => undefined);
    if(!member) return;
  
    if (ertum.Authorities.some(x => member.roles.cache.has(x)) && !ertum.OwnerRoles.some(x => member.roles.cache.has(x))) {
      if (channel.parent && ertum.PublicRoomsCategory.includes(channel.parentId)) {
        if (data >= (1000 * 60) * ertucuk.Mainframe.voiceCount) await coin.findOneAndUpdate({ guildID: user.guild.id, userID: user.id }, { $inc: { coin: Math.floor(parseInt(data/1000/60) / ertucuk.Mainframe.voiceCount) * ertucuk.Mainframe.publicCoin } }, { upsert: true });
      } else if (data >= (1000 * 60) * ertucuk.Mainframe.voiceCount) await coin.findOneAndUpdate({ guildID: user.guild.id, userID: user.id }, { $inc: { coin: Math.floor(parseInt(data/1000/60) / ertucuk.Mainframe.voiceCount) * ertucuk.Mainframe.voiceCoin } }, { upsert: true });
      const coinData = await coin.findOne({ guildID: user.guild.id, userID: user.id });
      if (coinData && client.ranks.some((x) => x.coin >= coinData.coin)) {
        let newRank = client.ranks.filter((x) => coinData.coin >= x.coin);
        newRank = newRank[newRank.length-1];
        if (newRank && Array.isArray(newRank.role) && !newRank.role.some(x => member.roles.cache.has(x)) || newRank && !Array.isArray(newRank.role) && !member.roles.cache.has(newRank.role)) {
          member.roles.add(newRank.role);
          const oldRoles = client.ranks.filter((x) => coinData.coin < x.coin && member.hasRole(x.role));
          oldRoles.forEach((x) => x.role.forEach((r) => member.roles.remove(r)));
          client.channels.cache.find(x => x.name == "rank_log").send({ content:`${member.toString()} üyesi **${coinData.coin}** coin hedefine ulaştı ve **${Array.isArray(newRank.role) ? newRank.role.map(x => `${user.guild.roles.cache.get(x).name}`).join(", ") : `${user.guild.roles.cache.get(newRank.role).name}`}** rolü verildi! :tada: :tada:`});
        }
      }
    }
  }
});