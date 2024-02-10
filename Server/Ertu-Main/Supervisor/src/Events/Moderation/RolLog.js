const { EmbedBuilder, AuditLogEvent, Events } = require('discord.js');
const roller = require('../../../../../../Global/Schemas/rolveridb');
var moment = require('moment-timezone');
moment().tz('Europe/Istanbul').format('LL');
const client = global.client;

client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
    const kanal = newMember.guild.channels.cache.find((x) => x.name == 'rol_log');
    await newMember.guild
        .fetchAuditLogs({
            type: AuditLogEvent.MemberRoleUpdate,
        })
        .then(async (audit) => {
            let ayar = audit.entries.first();
            let hedef = ayar.target;
            let yapan = ayar.executor;
            if (yapan.bot) return;

            newMember.roles.cache.forEach(async (role) => {
                if (!oldMember.roles.cache.has(role.id)) {
                    const emed = new EmbedBuilder()
                        .setAuthor({
                            name: hedef.tag,
                            iconURL: hedef.displayAvatarURL({
                                dynamic: true,
                            }),
                        })
                        .setDescription(
                            `
                        **Rol Eklenen kişi**\n ${hedef} - **${hedef.id}** `
                        )
                        .addFields([
                            {
                                name: `Rolü Ekleyen Kişi`,
                                value: `${yapan} - **${yapan.id}**`,
                            },
                        ])
                        .addFields([
                            {
                                name: `Eklenen Rol`,
                                value: `${role} - **${role.id}**`,
                            },
                        ])
                        .setFooter({
                            text: yapan.tag,
                            iconURL: yapan.displayAvatarURL({
                                dynamic: true,
                            }),
                        })
                        .setTimestamp();
                    kanal.send({ embeds: [emed] });

                    await roller.findOneAndUpdate(
                        { user: hedef.id },
                        {
                            $push: {
                                roller: {
                                    rol: role.id,
                                    mod: yapan.id,
                                    tarih: Date.parse(new Date()),
                                    state: 'Ekleme',
                                },
                            },
                        }, 
                        { upsert: true }
                    );
                }
            });
            oldMember.roles.cache.forEach(async (role) => {
                if (!newMember.roles.cache.has(role.id)) {
                    const emeed = new EmbedBuilder()
                        .setAuthor({
                            name: hedef.tag,
                            iconURL: hedef.displayAvatarURL({
                                dynamic: true,
                            }),
                        })
                        .setDescription(
                            `
                        **Rolü Alınan kişi** \n${hedef} - **${hedef.id}**`
                        )
                        .addFields([
                            {
                                name: `Rolü Alan Kişi`,
                                value: `${yapan} - **${yapan.id}**`,
                            },
                        ])
                        .addFields([
                            {
                                name: `Alınan Rol`,
                                value: `${role} - **${role.id}**`,
                            },
                        ])
                        .setFooter({
                            text: yapan.tag,
                            iconURL: yapan.displayAvatarURL({
                                dynamic: true,
                            }),
                        })
                        .setTimestamp();
                    kanal.send({ embeds: [emeed] });

                    await roller.findOneAndUpdate(
                        { user: hedef.id },
                        {
                            $push: {
								tarih: moment(Date.now()).format("LLL"),
                                roller: {
                                    rol: role.id,
                                    mod: yapan.id,
                                    tarih: Date.parse(new Date()),
                                    state: 'Çıkarma',
                                },
                            },
                        }, 
                        { upsert: true }
                    );
                }
            });
        });
});

module.exports.conf = {
    name: 'guildMemberUpdate',
};
