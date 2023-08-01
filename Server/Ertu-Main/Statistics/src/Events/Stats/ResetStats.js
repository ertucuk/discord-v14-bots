const { CronJob } = require("cron");
const client = global.client;
const messageUser = require("../../../../../../Global/Schemas/messageUser");
const voiceUser = require("../../../../../../Global/Schemas/voiceUser");
const messageGuild = require("../../../../../../Global/Schemas/messageGuild");
const voiceGuild = require("../../../../../../Global/Schemas/voiceGuild");

const gorev = require("../../../../../../Global/Schemas/invite");
const kayitg = require("../../../../../../Global/Schemas/kayitgorev");
const mesaj = require("../../../../../../Global/Schemas/mesajgorev");
const tagli = require("../../../../../../Global/Schemas/taggorev");

const conf = require("../../../../../../Global/Settings/System")

client.on("ready", async () => {

  const gorevler = new CronJob("0 0 * * *", () => {
    client.guilds.cache.forEach(async (guild) => {
      guild.members.cache.forEach(async (member) => {
        await gorev.findOneAndUpdate({ guildID: conf.ServerID, userID: member.user.id }, { $set: { invite: 0 } }, { upsert: true });
        await kayitg.findOneAndUpdate({ guildID: conf.ServerID, userID: member.user.id }, { $set: { kayit: 0 } }, { upsert: true });
        await mesaj.findOneAndUpdate({ guildID: conf.ServerID, userID: member.user.id }, { $set: { mesaj: 0 } }, { upsert: true });
        await tagli.findOneAndUpdate({ guildID: conf.ServerID, userID: member.user.id }, { $set: { tagli: 0 } }, { upsert: true });
        });
      console.log(`Sunucudaki ${client.guilds.cache.get(conf.ServerID).memberCount} üyenin günlük görevleri başarıyla yüklendi. [00:00]`)
    });
  }, null, true, "Europe/Istanbul");
  gorevler.start();

    const daily = new CronJob("0 0 * * *", () => {
        client.guilds.cache.forEach(async (guild) => {
          guild.members.cache.forEach(async (member) => {
          await messageGuild.findOneAndUpdate({ guildID: conf.ServerID }, { $set: { dailyStat: 0 } });
          await voiceGuild.findOneAndUpdate({ guildID: conf.ServerID }, { $set: { dailyStat: 0 } });
          await messageUser.findOneAndUpdate({ guildID: conf.ServerID, userID: member.user.id }, { $set: { dailyStat: 0 } }, { upsert: true });
          await voiceUser.findOneAndUpdate({ guildID: conf.ServerID, userID: member.user.id }, { $set: { dailyStat: 0 } }, { upsert: true });
              });
     });
      }, null, true, "Europe/Istanbul");
      daily.start();
    
      const weekly = new CronJob("0 0 * * 0", () => {
        client.guilds.cache.forEach(async (guild) => {
          guild.members.cache.forEach(async (member) => {
          await messageGuild.findOneAndUpdate({ guildID: conf.ServerID }, { $set: { weeklyStat: 0 } });
          await voiceGuild.findOneAndUpdate({ guildID: conf.ServerID }, { $set: { weeklyStat: 0 } });
          await messageUser.findOneAndUpdate({ guildID: conf.ServerID, userID: member.user.id }, { $set: { weeklyStat: 0 } }, { upsert: true });
          await voiceUser.findOneAndUpdate({ guildID: conf.ServerID, userID: member.user.id }, { $set: { weeklyStat: 0 } }, { upsert: true });
            });
     });
    }, null, true, "Europe/Istanbul");
    weekly.start();

})