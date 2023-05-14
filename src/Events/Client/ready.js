const { ActivityType, Events } = require("discord.js")
const client = global.client;

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
    setInterval(async () => {
        const voice = require("@discordjs/voice")
        const channel = client.channels.cache.get(system.BotVoiceChannel);
        voice.joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfMute: true,
            selfDeaf: true
        });
    }, 1000 * 3)

    let activities = system.BotStatus, i = 0;
    setInterval(() => client.user.setActivity({ name: `${activities[i++ % activities.length]}`,
      type: ActivityType.Streaming,
      url: "https://www.twitch.tv/ertucuk"}), 10000);

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
  