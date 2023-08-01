const { ActivityType, Events } = require("discord.js")
const System = require("../../../../../../Global/Settings/System");
const client = global.client;
const ertum = require("../../../../../../Global/Settings/Setup.json")

module.exports = async (client) => {

client.guilds.cache.forEach(guild => {
    guild.invites.fetch()
    .then(invites => {
      const codeUses = new Map();
      invites.each(inv => codeUses.set(inv.code, inv.uses));
      client.invites.set(guild.id, codeUses);
  })
})},

client.on("ready", async () => {
  const getType = (type) => {
    switch (type) {
      case "COMPETING":
        return ActivityType.Competing;

      case "LISTENING":
        return ActivityType.Listening;

      case "PLAYING":
        return ActivityType.Playing;

      case "WATCHING":
        return ActivityType.Watching;

      case "STREAMING":
        return ActivityType.Streaming;
    }
  };


setInterval(async () => {
    const voice = require("@discordjs/voice")
    const channel = client.channels.cache.get(System.BotVoiceChannel);
    voice.joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfMute: true,
        selfDeaf: true
    });
}, 1000 * 3)

setInterval(async () => {
    client.user.setPresence({
      status: System.Presence.Status,
      activities: [
        {
          name: System.Presence.Message[Math.floor(Math.random() * System.Presence.Message.length)],
          type: getType(System.Presence.Type),
          url: "https://www.twitch.tv/ertucuk"
        },
      ],
    });
  }, 10000);
    client.guilds.cache.forEach(guild => {
        guild.invites.fetch()
        .then(invites => {
          const codeUses = new Map();
          invites.each(inv => codeUses.set(inv.code, inv.uses));
          client.invites.set(guild.id, codeUses);
      })
    })
})

module.exports.config = {
    Event: "ready"
};
  