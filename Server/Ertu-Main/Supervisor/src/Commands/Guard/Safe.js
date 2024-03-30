const { Client, ApplicationCommandType, PermissionsBitField, SelectMenuBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRow, ActionRowBuilder, Formatters, seelct, StringSelectMenuBuilder } = require("discord.js");
const guard = require("../../../../../Ertu-Guard/Schemas/Guard");
const ertucuk = require("../../../../../../Global/Settings/System");
module.exports = {
    name: "güvenli",
    description: "Güvenliye eklersiniz.",
    category: "OWNER",
    cooldown: 0,
    command: {
        enabled: true,
        aliases: ["wl", "whitelist", "g"],
        usage: ".denetim",
    },


    onLoad: function (client) { },

    onCommand: async function (client, message, args, ertuembed) {

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        const menu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("güvenli")
                    .setPlaceholder("Kategori Seçin!")
                    .setOptions([
                        { label: "Full", description: "Taç sahibi seviyesinde izinlere sahip olur.", value: "full" },
                        { label: "Sunucu Ayarları", description: "URL hariç sunucu profiline tam izinli erişim.", value: "server" },
                        { label: "Rolleri Yönet", description: "Rollere tam izinli erişim ve yönetim.", value: "role" },
                        { label: "Kanalları Yönet", description: "Kanallara tam izinli erişim ve yönetim.", value: "channel" },
                        { label: "Ban ve Kick", description: "Sağ tık Yasakla/At işlemlere tam izin.", value: "bankick" },
                        { label: "Emoji ve Sticker", description: "Tam izinli Emoji ve Sticker yönetimi.", value: "emojisticker" },
                        { label: "Chat Guard", description: "Chatte reklam/küfür erişimi.", value: "chatguard" },
                    ])
            )
        if (!member) return message.reply({ content: `Hata: Birini Etiketlemeyi Unuttun!\n**Not:** Güvenli kategori listelerine eklediğin kişilerin yaptıklarından sorumlu değilizdir.`, ephemeral: true })
        message.channel.send({ content: `${member} kullanıcısını eklemek/çıkarmak istediğin **Güvenli Kişiler** kategorisini aşağıda butonları kullanarak seçiniz!`, components: [menu] }).then(async intMsg => {
            const filter = d => d.user.id == message.author.id
            const collector = intMsg.createMessageComponentCollector({ filter: filter, errors: ["time"], time: 30000 * 10 })
            collector.on('collect', async (menu) => {
                await menu.deferUpdate()
                const guardWhitelistData = await guard.findOne({ guildID: menu.guild.id });
                var full = guardWhitelistData ? guardWhitelistData.SafedMembers : global.system.BotsOwners
                var server = guardWhitelistData ? guardWhitelistData.serverSafedMembers : global.system.BotsOwners
                var roles = guardWhitelistData ? guardWhitelistData.roleSafedMembers : global.system.BotsOwners
                var channels = guardWhitelistData ? guardWhitelistData.channelSafedMembers : global.system.BotsOwners
                var banAndkick = guardWhitelistData ? guardWhitelistData.banKickSafedMembers : global.system.BotsOwners
                var emojiAndSticker = guardWhitelistData ? guardWhitelistData.emojiStickers : global.system.BotsOwners
                var chatGuard = guardWhitelistData ? guardWhitelistData.chatGuard : global.system.BotsOwners
                const butonlar = await new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId("onayla").setLabel("Evet").setStyle(ButtonStyle.Success),
                    new ButtonBuilder().setCustomId("reddet").setLabel("Hayır").setStyle(ButtonStyle.Danger),
                )
                if (menu.values[0] == "full") {
                    if (full.includes(member.id)) {
                        menu.channel.send({ content: `${member} kullanıcısının sunucuda **Tam izini** mevcut kaldırmak istediğinize emin misiniz ?`, components: [butonlar], ephemeral: true }).then(async x => {
                            const filterx = d => d.user.id == message.author.id
                            const collectorx = await x.createMessageComponentCollector({ filter: filterx, errors: ["time"], time: 30000 * 10 })
                            collectorx.on("collect", async button => {
                                if (button.customId == "onayla") {
                                    await guard.findOneAndUpdate({ guildID: button.guild.id }, { $pull: { SafedMembers: member.id } }, { upsert: true });
                                    button.reply({ content: `**${member.user.tag}** Sunucuda tam erişim izni kaldırıldı. yaptığı her işlem engellenicektir.`, ephemeral: true })
                                    if (intMsg) await intMsg.delete();
                                    if (x) await x.delete();
                                } else {
                                    if (intMsg) await intMsg.delete();
                                    if (x) await x.delete();
                                }
                            })
                        })
                    } else {
                        menu.channel.send({ content: `${member} kullanıcısına sunucuda **Tam izin** vermek istediğine emin misin ?`, components: [butonlar], ephemeral: true }).then(async x => {
                            const filterx = d => d.user.id == message.author.id
                            const collectorx = await x.createMessageComponentCollector({ filter: filterx, errors: ["time"], time: 30000 * 10 })
                            collectorx.on("collect", async button => {
                                if (button.customId == "onayla") {
                                    await guard.findOneAndUpdate({ guildID: button.guild.id }, { $push: { SafedMembers: member.id } }, { upsert: true });
                                    button.reply({ content: `**${member.user.tag}** Sunucuda tam erişime sahip!`, ephemeral: true })
                                    if (intMsg) await intMsg.delete();
                                    if (x) await x.delete();
                                } else {
                                    if (intMsg) await intMsg.delete();
                                    if (x) await x.delete();
                                }
                            })
                        })
                    }

                }
                if (menu.values[0] == "server") {
                    if (server.includes(member.id)) {
                        menu.channel.send({ content: `${member} kullanıcısının sunucunun profil erişimi kaldırmak istediğinize emin misiniz ?`, components: [butonlar], ephemeral: true }).then(async x => {
                            const filterx = d => d.user.id == message.author.id
                            const collectorx = await x.createMessageComponentCollector({ filter: filterx, errors: ["time"], time: 30000 * 10 })
                            collectorx.on("collect", async button => {
                                if (button.customId == "onayla") {
                                    await guard.findOneAndUpdate({ guildID: button.guild.id }, { $pull: { serverSafedMembers: member.id } }, { upsert: true });
                                    button.reply({ content: `**${member.user.tag}** Sunucu profil erişim izni kaldırıldı. yaptığı her işlem engellenicektir.`, ephemeral: true })
                                    if (intMsg) await intMsg.delete();
                                    if (x) await x.delete();
                                } else {
                                    if (intMsg) await intMsg.delete();
                                    if (x) await x.delete();
                                }
                            })
                        })
                    } else {
                        menu.channel.send({ content: `${member} kullanıcısına sunucunun profiline erişim izni vermek istediğinize emin misiniz ?`, components: [butonlar], ephemeral: true }).then(async x => {
                            const filterx = d => d.user.id == message.author.id
                            const collectorx = await x.createMessageComponentCollector({ filter: filterx, errors: ["time"], time: 30000 * 10 })
                            collectorx.on("collect", async button => {
                                if (button.customId == "onayla") {
                                    await guard.findOneAndUpdate({ guildID: button.guild.id }, { $push: { serverSafedMembers: member.id } }, { upsert: true });
                                    button.reply({ content: `**${member.user.tag}** Sunucunun profiline tam izini erişim verildi!`, ephemeral: true })
                                    if (intMsg) await intMsg.delete();
                                    if (x) await x.delete();
                                } else {
                                    if (intMsg) await intMsg.delete();
                                    if (x) await x.delete();
                                }
                            })
                        })
                    }

                }
                if (menu.values[0] == "role") {
                    if (roles.includes(member.id)) {
                        menu.channel.send({ content: `${member} kullanıcısına sunucuda **Rollere tam erişim** izni mevcut kaldırmak istediğinize emin misiniz ?`, components: [butonlar], ephemeral: true }).then(async x => {
                            const filterx = d => d.user.id == message.author.id
                            const collectorx = await x.createMessageComponentCollector({ filter: filterx, errors: ["time"], time: 30000 * 10 })
                            collectorx.on("collect", async button => {
                                if (button.customId == "onayla") {
                                    await guard.findOneAndUpdate({ guildID: button.guild.id }, { $pull: { roleSafedMembers: member.id } }, { upsert: true });
                                    button.reply({ content: `**${member.user.tag}** Sunucuda **Rollere tam erişim** izni kaldırıldı. yaptığı her rol işlem engellenicektir.`, ephemeral: true })
                                    if (intMsg) await intMsg.delete();
                                    if (x) await x.delete();
                                } else {
                                    if (intMsg) await intMsg.delete();
                                    if (x) await x.delete();
                                }
                            })
                        })
                    } else {
                        menu.channel.send({ content: `${member} kullanıcısına sunucuda **Rollere tam erişim** vermek istediğine emin misin ?`, components: [butonlar], ephemeral: true }).then(async x => {
                            const filterx = d => d.user.id == message.author.id
                            const collectorx = await x.createMessageComponentCollector({ filter: filterx, errors: ["time"], time: 30000 * 10 })
                            collectorx.on("collect", async button => {
                                if (button.customId == "onayla") {
                                    await guard.findOneAndUpdate({ guildID: button.guild.id }, { $push: { roleSafedMembers: member.id } }, { upsert: true });
                                    button.reply({ content: `**${member.user.tag}** Sunucuda **Rollere tam erişim** sahip!`, ephemeral: true })
                                    if (intMsg) await intMsg.delete();
                                    if (x) await x.delete();
                                } else {
                                    if (intMsg) await intMsg.delete();
                                    if (x) await x.delete();
                                }
                            })
                        })
                    }

                }
                if (menu.values[0] == "channel") {
                    if (channels.includes(member.id)) {
                        menu.channel.send({ content: `${member} kullanıcısına sunucuda **Kanallara tam erişim** izni mevcut kaldırmak istediğinize emin misiniz ?`, components: [butonlar], ephemeral: true }).then(async x => {
                            const filterx = d => d.user.id == message.author.id
                            const collectorx = await x.createMessageComponentCollector({ filter: filterx, errors: ["time"], time: 30000 * 10 })
                            collectorx.on("collect", async button => {
                                if (button.customId == "onayla") {
                                    await guard.findOneAndUpdate({ guildID: button.guild.id }, { $pull: { channelSafedMembers: member.id } }, { upsert: true });
                                    button.reply({ content: `**${member.user.tag}** Sunucuda **Kanallara tam erişim** izni kaldırıldı. yaptığı her işlem engellenicektir.`, ephemeral: true })
                                    if (intMsg) await intMsg.delete();
                                    if (x) await x.delete();
                                } else {
                                    if (intMsg) await intMsg.delete();
                                    if (x) await x.delete();
                                }
                            })
                        })
                    } else {
                        menu.channel.send({ content: `${member} kullanıcısına sunucuda **Kanallara tam erişim** izni vermek istediğine emin misin ?`, components: [butonlar], ephemeral: true }).then(async x => {
                            const filterx = d => d.user.id == message.author.id
                            const collectorx = await x.createMessageComponentCollector({ filter: filterx, errors: ["time"], time: 30000 * 10 })
                            collectorx.on("collect", async button => {
                                if (button.customId == "onayla") {
                                    await guard.findOneAndUpdate({ guildID: button.guild.id }, { $push: { channelSafedMembers: member.id } }, { upsert: true });
                                    button.reply({ content: `**${member.user.tag}** Sunucuda **Kanallara tam erişim** sahip!`, ephemeral: true })
                                    if (intMsg) await intMsg.delete();
                                    if (x) await x.delete();
                                } else {
                                    if (intMsg) await intMsg.delete();
                                    if (x) await x.delete();
                                }
                            })
                        })
                    }

                }
                if (menu.values[0] == "bankick") {
                    if (banAndkick.includes(member.id)) {
                        menu.channel.send({ content: `${member} kullanıcısına sunucuda **Üyeleri Yasakla/At** işlemlerine tam izni mevcut kaldırmak istediğinize emin misiniz ?`, components: [butonlar], ephemeral: true }).then(async x => {
                            const filterx = d => d.user.id == message.author.id
                            const collectorx = await x.createMessageComponentCollector({ filter: filterx, errors: ["time"], time: 30000 * 10 })
                            collectorx.on("collect", async button => {
                                if (button.customId == "onayla") {
                                    await guard.findOneAndUpdate({ guildID: button.guild.id }, { $pull: { banKickSafedMembers: member.id } }, { upsert: true });
                                    button.reply({ content: `**${member.user.tag}** Sunucuda **Üyeleri Yasakla/At** tam erişim izni kaldırıldı. yaptığı her işlem engellenicektir.`, ephemeral: true })
                                    if (intMsg) await intMsg.delete();
                                    if (x) await x.delete();
                                } else {
                                    if (intMsg) await intMsg.delete();
                                    if (x) await x.delete();
                                }
                            })
                        })
                    } else {
                        menu.channel.send({ content: `${member} kullanıcısına sunucuda **Üyeleri Yasakla/At** işlemine tam erişim izni vermek istediğine emin misin ?`, components: [butonlar], ephemeral: true }).then(async x => {
                            const filterx = d => d.user.id == message.author.id
                            const collectorx = await x.createMessageComponentCollector({ filter: filterx, errors: ["time"], time: 30000 * 10 })
                            collectorx.on("collect", async button => {
                                if (button.customId == "onayla") {
                                    await guard.findOneAndUpdate({ guildID: button.guild.id }, { $push: { banKickSafedMembers: member.id } }, { upsert: true });
                                    button.reply({ content: `**${member.user.tag}** Sunucuda rahatlıkla sağ tık **Ban&Kick** işlemlerini kullanabilir!`, ephemeral: true })
                                    if (intMsg) await intMsg.delete();
                                    if (x) await x.delete();
                                } else {
                                    if (intMsg) await intMsg.delete();
                                    if (x) await x.delete();
                                }
                            })
                        })
                    }

                }
                if (menu.values[0] == "emojisticker") {
                    if (emojiAndSticker.includes(member.id)) {
                        menu.channel.send({ content: `${member} kullanıcısına sunucuda **Emoji ve Sticker Yönet** izni mevcut kaldırmak istediğinize emin misiniz ?`, components: [butonlar], ephemeral: true }).then(async x => {
                            const filterx = d => d.user.id == message.author.id
                            const collectorx = await x.createMessageComponentCollector({ filter: filterx, errors: ["time"], time: 30000 * 10 })
                            collectorx.on("collect", async button => {
                                if (button.customId == "onayla") {
                                    await guard.findOneAndUpdate({ guildID: button.guild.id }, { $pull: { emojiStickers: member.id } }, { upsert: true });
                                    button.reply({ content: `**${member.user.tag}** Sunucuda **Emoji ve Sticker Yönet** erişim izni kaldırıldı. yaptığı her işlem engellenicektir.`, ephemeral: true })
                                    if (intMsg) await intMsg.delete();
                                    if (x) await x.delete();
                                } else {
                                    if (intMsg) await intMsg.delete();
                                    if (x) await x.delete();
                                }
                            })
                        })
                    } else {
                        menu.channel.send({ content: `${member} kullanıcısına sunucuda **Emoji ve Sticker Yönet** izni vermek istediğine emin misin ?`, components: [butonlar], ephemeral: true }).then(async x => {
                            const filterx = d => d.user.id == message.author.id
                            const collectorx = await x.createMessageComponentCollector({ filter: filterx, errors: ["time"], time: 30000 * 10 })
                            collectorx.on("collect", async button => {
                                if (button.customId == "onayla") {
                                    await guard.findOneAndUpdate({ guildID: button.guild.id }, { $push: { emojiStickers: member.id } }, { upsert: true });
                                    button.reply({ content: `**${member.user.tag}** Sunucuda **Emoji ve Sticker Yönet** yetkisine tam erişim iznine sahip!`, ephemeral: true })
                                    if (intMsg) await intMsg.delete();
                                    if (x) await x.delete();
                                } else {
                                    if (intMsg) await intMsg.delete();
                                    if (x) await x.delete();
                                }
                            })
                        })
                    }

                }
                if (menu.values[0] == "chatguard") {
                    if (chatGuard.includes(member.id)) {
                        menu.channel.send({ content: `${member} kullanıcısına sunucuda **Chat Guard** izni mevcut kaldırmak istediğinize emin misiniz ?`, components: [butonlar], ephemeral: true }).then(async x => {
                            const filterx = d => d.user.id == message.author.id
                            const collectorx = await x.createMessageComponentCollector({ filter: filterx, errors: ["time"], time: 30000 * 10 })
                            collectorx.on("collect", async button => {
                                if (button.customId == "onayla") {
                                    await guard.findOneAndUpdate({ guildID: button.guild.id }, { $pull: { chatGuard: member.id } }, { upsert: true });
                                    button.reply({ content: `**${member.user.tag}** Sunucuda **Chat Guard** erişim izni kaldırıldı. yaptığı her işlem engellenicektir.`, ephemeral: true })
                                    if (intMsg) await intMsg.delete();
                                    if (x) await x.delete();
                                } else {
                                    if (intMsg) await intMsg.delete();
                                    if (x) await x.delete();
                                }
                            })
                        })
                    } else {
                        menu.channel.send({ content: `${member} kullanıcısına sunucuda **Chat Guard** izni vermek istediğine emin misin ?`, components: [butonlar], ephemeral: true }).then(async x => {
                            const filterx = d => d.user.id == message.author.id
                            const collectorx = await x.createMessageComponentCollector({ filter: filterx, errors: ["time"], time: 30000 * 10 })
                            collectorx.on("collect", async button => {
                                if (button.customId == "onayla") {
                                    await guard.findOneAndUpdate({ guildID: button.guild.id }, { $push: { chatGuard: member.id } }, { upsert: true });
                                    button.reply({ content: `**${member.user.tag}** Sunucuda **Chat Guard** yetkisine tam erişim iznine sahip!`, ephemeral: true })
                                    if (intMsg) await intMsg.delete();
                                    if (x) await x.delete();
                                } else {
                                    if (intMsg) await intMsg.delete();
                                    if (x) await x.delete();
                                }
                            })
                        })
                    }

                }
            })
        })
    },

};