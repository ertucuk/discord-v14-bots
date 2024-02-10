const { ActivityType, Events, EmbedBuilder,PresenceUpdateStatus } = require('discord.js');
const System = require('../../../../../../Global/Settings/System');
const ertum = require('../../../../../../Global/Settings/Setup.json');
const penals = require('../../../../../../Global/Schemas/penals');
const userTask = require('../../../../../../Global/Schemas/userTask');
const tasks = require('../../../../../../Global/Schemas/tasks');
const client = global.client;

(module.exports = async (client) => {
    client.guilds.cache.forEach((guild) => {
        guild.invites.fetch().then((invites) => {
            const codeUses = new Map();
            invites.each((inv) => codeUses.set(inv.code, inv.uses));
            client.invites.set(guild.id, codeUses);
        });
    });
}),
    client.on('ready', async () => {
        const getType = (type) => {
            switch (type) {
                case 'COMPETING':
                    return ActivityType.Competing;

                case 'LISTENING':
                    return ActivityType.Listening;

                case 'PLAYING':
                    return ActivityType.Playing;

                case 'WATCHING':
                    return ActivityType.Watching;

                case 'STREAMING':
                    return ActivityType.Streaming;
            }
        };

        setInterval(async () => {
            const data = await userTask.find({ 'completeds.message': true, 'completeds.voice': true, 'completeds.register': true, 'completeds.invite': true, 'completeds.tag': true, 'completeds.staff': true })

            if (data) {
                data.forEach(async (x) => {
                    const task = await tasks.findOne({ currentRole: x.roleId });

                    if (task && task.endOfMissionRole) {
                        const guild = client.guilds.cache.get(task._id)

                        if (!guild) return;

                        const member = guild.members.cache.get(x.userId)

                        await userTask.findOneAndUpdate(
                            { userId: x.userId },
                            { $set: { 'completeds.message': false, 'completeds.voice': false, 'completeds.register': false, 'completeds.invite': false, 'completeds.tag': false, 'completeds.staff': false} },
                            { upsert: true, new: true }
                        )

                        if (member) {
                            await member.roles.add(task.endOfMissionRole)
                        }
                    }

                })
            }
        }, 60000)

        setInterval(async () => {
            const voice = require('@discordjs/voice');
            const channel = client.channels.cache.get(System.BotVoiceChannel);
            voice.joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
                selfMute: true,
                selfDeaf: true,
            });

        }, 1000 * 3);

        await global.startDistributors()

        setInterval(async () => {
            client.user.setPresence({
                status: PresenceUpdateStatus.Idle,
                activities: [
                    {
                        name: System.Presence.Message,
                        type: getType(System.Presence.Type),
                        url: 'https://www.twitch.tv/ertucuk',
                    },
                ],
            });

            const penalsData = await penals.find({ finishDate: { $lte: Date.now() }, active: true });

            penalsData.forEach(async (data) => {
                const guild = client.guilds.cache.get(data.guildID);

                if (!guild) return;

                const member = guild.members.cache.get(data.userID);

                if (!member) return;

                const cezaBittiLog = new EmbedBuilder()
                        .setAuthor({
                            name: member.displayName,
                            iconURL: member.user.avatarURL({ dynamic: true }),
                        })
                        .setTimestamp()

                if (data.type == 'Chat-Mute') {
                    await member.roles.remove(ertum.MutedRole);

                    let logChannel = client.channels.cache.find((x) => x.name === 'mute_log');

                    cezaBittiLog.setDescription(`${member} adlı üyenin chat mute süresi bitti.`)

                    if (logChannel) {
                        await logChannel.send({ embeds: [cezaBittiLog] })
                    }
                
                }

                if (data.type == 'Voice-Mute') {
                    await member.roles.remove(ertum.VMutedRole);
                    if (member.voice.channelId && member.voice.serverMute) member.voice.setMute(false);

                    let logChannel = client.channels.cache.find((x) => x.name === 'vmute_log');
                    cezaBittiLog.setDescription(`${member} adlı üyenin ses mute süresi bitti.`)

                    if (logChannel) {
                        await logChannel.send({ embeds: [cezaBittiLog] })
                    }
                }

                if (data.type == 'Jail') {
                     await member.roles.remove(ertum.JailedRoles);
                    let logChannel = client.channels.cache.find((x) => x.name === 'jail_log');

                    cezaBittiLog.setDescription(`${member} adlı üyenin jail süresi bitti.`)

                    if (logChannel) {
                        await logChannel.send({ embeds: [cezaBittiLog] })
                    }
                    
                }

                await penals.findByIdAndUpdate(
                    data._id,
                    {
                        $set: {
                            active: false
                        }
                    },
                    { upsert: true}
                )
            });
        }, 10000);

        setInterval(() => {
            const guild = client.guilds.cache.get(System.ServerID);
            const ROLE_NAMES = ['1 Ay', '3 Ay', '6 Ay', '9 Ay'];

            if (!guild) {
                console.log('Sunucu yok orospcoıcpcuıg.');
                return;
            }

            guild.members.cache.forEach(async (member) => {
                const joinDate = member.joinedAt;
                const currentDate = new Date();
                const differenceInDays = Math.floor((currentDate - joinDate) / (1000 * 60 * 60 * 24));
    
                let appliedRoles = [];
    
                for (const roleName of ROLE_NAMES) {
                    const role = guild.roles.cache.find(r => r.name === roleName);
                    if (role && differenceInDays >= scat(roleName)) {
                        appliedRoles.push(role);
                    }
                }
    
                const currentRoles = member.roles.cache.filter(role => ROLE_NAMES.includes(role.name));
                    currentRoles.forEach(role => {
                    if (!appliedRoles.includes(role)) {
                        member.roles.remove(role);
                    }
                });
                    appliedRoles.forEach(role => {
                    if (!currentRoles.has(role.id)) {
                        member.roles.add(role);
                    }
                });
            });
            console.log('Kullanıcıya rol filan verdim | ready eventi.');
        }, 24 * 60 * 60 * 1000); 

        function scat(roleName) {
            const match = roleName.match(/^(\d+) Ay$/);
            if (match) {
                return parseInt(match[1]) * 30; 
            }
            return 0;
        }
    
        client.guilds.cache.forEach((guild) => {
            guild.invites.fetch().then((invites) => {
                const codeUses = new Map();
                invites.each((inv) => codeUses.set(inv.code, inv.uses));
                client.invites.set(guild.id, codeUses);
            });
        });
    });

module.exports.config = {
    Event: 'ready',
};
