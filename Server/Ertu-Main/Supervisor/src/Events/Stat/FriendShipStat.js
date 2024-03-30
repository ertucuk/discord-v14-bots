const friendShip = require("../../../../../../Global/Schemas/friendShip");
const ertucuk = require("../../../../../../Global/Settings/System");
const { Collection, Events } = require('discord.js');
const client = global.client;

const voiceStats = new Collection()

async function addStat(member, channelId, diff) {
    await friendShip.findOneAndUpdate(
        { id: member.id },
        { $inc: { [`voices.channels.${channelId}`]: diff, 'voices.total': diff } },
        { upsert: true, new: true }
    );

    const channel = member.guild.channels.cache.get(channelId);

    const voiceFriends = channel.members.filter((m) => !m.user.bot && m.user.id != member.id);

    if (voiceFriends.size < 1) return;

    for (const [id] of voiceFriends) {
        await friendShip.findOneAndUpdate(
            { id: member.id },
            { $inc: { [`voiceFriends.${id}`]: diff } },
            { upsert: true, new: true }
        );
    }
};

client.on(Events.ClientReady, async (client) => {
    const guild = client.guilds.cache.get(ertucuk.ServerID)

    if (!guild) return;

    const members = await guild.members.fetch()

    members
        .filter((member) => member.voice && member.voice.channelId && !member.user.bot)
        .forEach((member) =>
            voiceStats.set(member.id, {
                channelId: member.voice.channelId,
                joinedAt: Date.now(),
                updateAt: Date.now(),
            })
        );

    setInterval(() => {
        if (!voiceStats.size) return;

        voiceStats.forEach(async (v, k) => {
            voiceStats.set(k, { ...v, updateAt: Date.now() });

            const diff = Date.now() - v.updateAt;

            if (diff > 0) {
                const member = guild.members.cache.get(k);

                if (!member) return voiceStats.delete(k);

                addStat(member, v.channelId, diff);

            }
        });
    }, 1000 * 30);
})

client.on(Events.VoiceStateUpdate, (oldState, newState) => {
    if (!oldState.member || !oldState.guild || oldState.channelId == newState.channelId) return;

    const defaultQuery = {
        channelId: oldState.channelId || newState.channelId,
        joinedAt: Date.now(),
        updateAt: Date.now(),
    };

    if (!oldState.channelId && newState.channelId) {
        return voiceStats.set(oldState.id, defaultQuery);
    }

    const cache = voiceStats.get(oldState.id) || defaultQuery;

    voiceStats.set(oldState.id, cache);

    const diff = Date.now() - cache.updateAt;

    if (oldState.channelId && !newState.channelId) {
        voiceStats.delete(oldState.id);

        if (diff > 0) addStat(oldState.member, oldState.channelId, diff);
    } else if (
        oldState.channelId &&
        newState.channelId &&
        oldState.channelId !== newState.channelId
    ) {
        voiceStats.set(oldState.id, {
            channelId: newState.channelId,
            joinedAt: Date.now(),
            updateAt: Date.now(),
        });

        if (diff > 0) addStat(oldState.member, oldState.channelId, diff);
    }
});
