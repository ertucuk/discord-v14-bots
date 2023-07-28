const { CronJob } = require("cron");
const client = global.client;
const messageUser = require("../../../../Supervisor/src/schemas/messageUser");
const voiceUser = require("../../../../Supervisor/src/schemas/voiceUser");
const messageGuild = require("../../../../Supervisor/src/schemas/messageGuild");
const voiceGuild = require("../../../../Supervisor/src/schemas/voiceGuild");
const conf = require("../../../../../../Global/Settings/System")

client.on("ready", async () => {

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