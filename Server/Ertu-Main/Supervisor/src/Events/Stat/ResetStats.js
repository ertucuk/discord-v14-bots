const { CronJob } = require("cron");
const {Events} = require("discord.js");
const client = global.client;
const conf = require("../../../../../../Global/Settings/System");
const { MessageStat, VoiceStat, StreamerStat, CameraStat } = require("../../../../../../Global/Models");

client.on(Events.ClientReady, async () => {

    const daily = new CronJob("0 0 * * *", () => {
        client.guilds.cache.forEach(async (guild) => {
          guild.members.cache.forEach(async (member) => {
          await MessageStat.findOneAndUpdate({ guildID: conf.ServerID, userID: member.user.id  },{ $set: { DailyStat: 0 } }, { upsert: true });
          ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          await VoiceStat.findOneAndUpdate({ guildID: conf.ServerID, userID: member.user.id  },{ $set: { DailyStat: 0 } }, { upsert: true });
          ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          await StreamerStat.findOneAndUpdate({ guildID: conf.ServerID, userID: member.user.id  },{ $set: { DailyStat: 0 } }, { upsert: true })
          ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          await CameraStat.findOneAndUpdate({ guildID: conf.ServerID, userID: member.user.id  },{ $set: { DailyStat: 0 } }, { upsert: true });
          ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
              });
     });
      }, null, true, "Europe/Istanbul");
      daily.start();
    
      const weekly = new CronJob("0 0 * * 0", () => {
        client.guilds.cache.forEach(async (guild) => {
          guild.members.cache.forEach(async (member) => {
            await MessageStat.findOneAndUpdate({ guildID: conf.ServerID, userID: member.user.id  },{ $set: { WeeklyStat: 0 } }, { upsert: true });
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            await VoiceStat.findOneAndUpdate({ guildID: conf.ServerID, userID: member.user.id  },{ $set: { WeeklyStat: 0 } }, { upsert: true });
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            await StreamerStat.findOneAndUpdate({ guildID: conf.ServerID, userID: member.user.id  },{ $set: { WeeklyStat: 0 } }, { upsert: true })
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            await CameraStat.findOneAndUpdate({ guildID: conf.ServerID, userID: member.user.id  },{ $set: { WeeklyStat: 0 } }, { upsert: true });
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            });
     });
    }, null, true, "Europe/Istanbul");
    weekly.start();

    const monthly = new CronJob("0 0 1 * *", () => {
      client.guilds.cache.forEach(async (guild) => {
        guild.members.cache.forEach(async (member) => {
            await MessageStat.findOneAndUpdate({ guildID: conf.ServerID, userID: member.user.id  },{ $set: { MonthlyStat: 0 } }, { upsert: true });
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            await VoiceStat.findOneAndUpdate({ guildID: conf.ServerID, userID: member.user.id  },{ $set: { MonthlyStat: 0 } }, { upsert: true });
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            await StreamerStat.findOneAndUpdate({ guildID: conf.ServerID, userID: member.user.id  },{ $set: { MonthlyStat: 0 } }, { upsert: true })
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            await CameraStat.findOneAndUpdate({ guildID: conf.ServerID, userID: member.user.id  },{ $set: { MonthlyStat: 0 } }, { upsert: true });
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          });
   });
  }, null, true, "Europe/Istanbul");
  monthly.start();

})