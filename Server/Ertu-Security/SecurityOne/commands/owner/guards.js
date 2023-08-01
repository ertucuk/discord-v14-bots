const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, StringSelectMenuBuilder, UserSelectMenuBuilder } = require('discord.js');
const conf = require('../../../../../Global/Settings/System')
const guardSchema = require("../../../schemas/guardSchema") 
const { BsonDatabase,JsonDatabase,YamlDatabase } = require("five.db");
const db = new JsonDatabase();
const { red }  = require("../../../../../Global/Settings/Emojis.json")
const client = global.bot;
const roleBackupSchema = require("../../../schemas/roleBackupSchema");
const channelBackupSchema = require("../../../schemas/channelBackupSchema");

module.exports = {
    name: "guardpanel",
    aliases: ["guard-panel"," guard","gpanel"],
    execute:async (client, message, args) => {
        conf.BotsOwners.push(message.guild.ownerId)
        if(!conf.BotsOwners.some(ertu => message.author.id == ertu))return message.reply({content:`Komudu Kullanmak İçin Yetkin Yetersiz!`})
        const gs = await guardSchema.findOne({ guildId: message.guild.id });

        const urlGuardBtn = new ButtonBuilder()
        .setCustomId("urlGuard")
        .setLabel("URL Guard")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji((await getGuardStatus("urlGuard")) ? "🟢" : "🔴")
            
        const guildGuardBtn = new ButtonBuilder()
        .setCustomId("guildGuard")
        .setLabel("Guild Guard")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji((await getGuardStatus("guildGuard")) ? "🟢" : "🔴")

        const botGuardBtn = new ButtonBuilder()
        .setCustomId("botGuard")
        .setLabel("Bot Guard")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji((await getGuardStatus("botGuard")) ? "🟢" : "🔴")

        const emojiGuardBtn =new ButtonBuilder()
        .setCustomId("emojiGuard")
        .setLabel("Emoji Guard")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji((await getGuardStatus("emojiGuard")) ? "🟢" : "🔴")

        const stickerGuardBtn =new ButtonBuilder()
        .setCustomId("stickerGuard")
        .setLabel("Sticker Guard")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji((await getGuardStatus("stickerGuard")) ? "🟢" : "🔴")

        const otherGuardBtn =new ButtonBuilder()
        .setCustomId("otherGuard")
        .setLabel("Other Guards")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji((await getGuardStatus("otherGuard")) ? "🟢" : "🔴")

        const roleGuardBtn =new ButtonBuilder()
        .setCustomId("roleGuard")
        .setLabel("Rol Guard")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji((await getGuardStatus("roleGuard")) ? "🟢" : "🔴")
            
        const channelGuardBtn =new ButtonBuilder()
        .setCustomId("channelGuard")
        .setLabel("Channel Guard")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji((await getGuardStatus("channelGuard")) ? "🟢" : "🔴")

        const ytKapat =new ButtonBuilder()
        .setCustomId("ytLock")
        .setLabel("Yetki Kapat")
        .setEmoji(`1125852203740053534`)
        .setDisabled(db.has(`ytPerms_${message.guild.id}`) ? true : false)
        .setStyle(ButtonStyle.Success)

        const ytAc =new ButtonBuilder()
        .setCustomId("ytUnlock")
        .setLabel("Yetki Aç")
        .setEmoji(`1125852196320329779`)
        .setDisabled(db.has(`ytPerms_${message.guild.id}`) ? false : true)
        .setStyle(ButtonStyle.Success)

        const database =new ButtonBuilder()
        .setCustomId("allBackup")
        .setLabel("Herşeyi Yedekle")
        .setEmoji("1125556345534418976")
        .setStyle(ButtonStyle.Success)

        const cancel =new ButtonBuilder()
        .setCustomId("cancel")
        .setEmoji("1132817117524271254")
        .setLabel("İşlem İptal")
        .setStyle(ButtonStyle.Danger)
    
        
        
        const shitList = new StringSelectMenuBuilder()
        .setCustomId("SHIT_LIST")
        .setMaxValues(1)
        .setMinValues(1)
        .setPlaceholder("Güvenli Listesinde bulunan üyeler")
        const a = [];

        if(gs && gs.whitelist.length !== 0) {
            gs.whitelist.map(x => {
                a.push(x);
                const member = message.guild.members.cache.get(x);
                shitList.addOptions([
                    {
                        label: member.displayName   + " - " + x,
                        value: x
                    }
                ]);
            });
        } else {
            shitList.setDisabled(true)
            .setPlaceholder(`Güvenli listesinde kimse bulunamadı.`)
            .addOptions([
                {
                    label: "31",
                    value: "31"
                }
            ])
        }

        // const shitList2 = new StringSelectMenuBuilder()
        // .setCustomId("SHIT_LISTT")
        // .setMaxValues(1)
        // .setMinValues(1)
        // .setPlaceholder("Güvenli Listesinde bulunan roller")
        // const a2 = [];

        // if(gs && gs.whitelist.length !== 0) {
        //     gs.whitelist.map(x => {
        //         a2.push(x);
        //         const roles = message.guild.roles.cache.get(x);
        //         shitList2.addOptions([
        //             {
        //                 label: roles.name + " - " + x,
        //                 value: x
        //             }
        //         ]);
        //     });
        // } else {
        //     shitList2.setDisabled(true)
        //     .setPlaceholder(`Güvenli listesinde hiçbir rol bulunamadı.`)
        //     .addOptions([
        //         {
        //             label: "31",
        //             value: "31"
        //         }
        //     ])
        // }

        const row = new ActionRowBuilder()
        .setComponents(
            urlGuardBtn,
            guildGuardBtn,
            botGuardBtn,
            stickerGuardBtn,
        )

        const row2 = new ActionRowBuilder()
        .setComponents(
            emojiGuardBtn,
            otherGuardBtn,
            roleGuardBtn,
            channelGuardBtn
        )

        const row5 = new ActionRowBuilder()
        .setComponents(
            ytKapat,
            ytAc,
            database,
            cancel,
        )

         const row3 = new ActionRowBuilder()
        .setComponents(shitList) 

        // const row4 = new ActionRowBuilder()
        // .setComponents(shitList2) 


        const embed = new EmbedBuilder()
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({dynamic:true}) })
        .setDescription(`
        Merhaba ${message.author} Guard Yönetim ve Kontrol Paneline Hoşgeldin!

        > Aşağıda bulunan butonlardan korumaları açıp/kapatabilir,
        > Menüden güvenli listedeki yöneticileri görebilir,
        > Database verilerini tekrar yedekleyebilir,
        > Yetkileri açıp/kapatabilirsin.
        `)
        .setFooter({text: conf.SubTitle})

        const msg = await message.channel.send({ embeds: [embed], components: [row, row2, row5, row3] })
        const filter = (crn) => crn.member.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 30000 });

        collector.on("collect", async (interaction) => {
            if(interaction.customId === "urlGuard") {
                if((await getGuardStatus("urlGuard"))) {
                    await guardSchema.findOneAndUpdate({ guildId: message.guild.id }, {
                        $set: {
                            urlGuard: false
                        }
                    }, { upsert: true });
                    await interaction.reply({ content: `URL guard **kapatıldı**` })
                } else {
                    await guardSchema.findOneAndUpdate({ guildId: message.guild.id }, {
                        $set: {
                            urlGuard: true
                        }
                    }, { upsert: true });
                    await interaction.reply({ content: `URL guard **açıldı**` })
                }
                await refreshDatas(msg, message);
            }
            if(interaction.customId === "guildGuard") {
                if((await getGuardStatus("guildGuard"))) {
                    await guardSchema.findOneAndUpdate({ guildId: message.guild.id }, {
                        $set: {
                            guildGuard: false
                        }
                    }, { upsert: true });
                    await interaction.reply({ content: `Sunucu guard **kapatıldı**` })
                } else {
                    await guardSchema.findOneAndUpdate({ guildId: message.guild.id }, {
                        $set: {
                            guildGuard: true
                        }
                    }, { upsert: true });
                    await interaction.reply({ content: `Sunucu guard **açıldı**` })
                }
                await refreshDatas(msg, message);
            }
            if(interaction.customId === "botGuard") {
                if((await getGuardStatus("botGuard"))) {
                    await guardSchema.findOneAndUpdate({ guildId: message.guild.id }, {
                        $set: {
                            botGuard: false
                        }
                    }, { upsert: true });
                    await interaction.reply({ content: `Bot guard **kapatıldı**` })
                } else {
                    await guardSchema.findOneAndUpdate({ guildId: message.guild.id }, {
                        $set: {
                            botGuard: true
                        }
                    }, { upsert: true });
                    await interaction.reply({ content: `Bot guard **açıldı**` })
                }
                await refreshDatas(msg, message);
            }
            if(interaction.customId === "emojiGuard") {
                if((await getGuardStatus("emojiGuard"))) {
                    await guardSchema.findOneAndUpdate({ guildId: message.guild.id }, {
                        $set: {
                            emojiGuard: false
                        }
                    }, { upsert: true });
                    await interaction.reply({ content: `Emoji guard **kapatıldı**` })
                } else {
                    await guardSchema.findOneAndUpdate({ guildId: message.guild.id }, {
                        $set: {
                            emojiGuard: true
                        }
                    }, { upsert: true });
                    await interaction.reply({ content: `Emoji guard **açıldı**` })
                }
                await refreshDatas(msg, message);
            }
            if(interaction.customId === "stickerGuard") {
                if((await getGuardStatus("stickerGuard"))) {
                    await guardSchema.findOneAndUpdate({ guildId: message.guild.id }, {
                        $set: {
                            stickerGuard: false
                        }
                    }, { upsert: true });
                    await interaction.reply({ content: `Sticker guard **kapatıldı**` })
                } else {
                    await guardSchema.findOneAndUpdate({ guildId: message.guild.id }, {
                        $set: {
                            stickerGuard: true
                        }
                    }, { upsert: true });
                    await interaction.reply({ content: `Sticker guard **açıldı**` })
                }
                await refreshDatas(msg, message);
            }
            if(interaction.customId === "otherGuard") {
                if((await getGuardStatus("otherGuard"))) {
                    await guardSchema.findOneAndUpdate({ guildId: message.guild.id }, {
                        $set: {
                            otherGuard: false
                        }
                    }, { upsert: true });
                    await interaction.reply({ content: `Diğer guardlar **kapatıldı**` })
                } else {
                    await guardSchema.findOneAndUpdate({ guildId: message.guild.id }, {
                        $set: {
                            otherGuard: true
                        }
                    }, { upsert: true });
                    await interaction.reply({ content: `Diğer guardlar **açıldı**` })
                }
                await refreshDatas(msg, message);
            }
            if(interaction.customId === "roleGuard") {
                if((await getGuardStatus("roleGuard"))) {
                    await guardSchema.findOneAndUpdate({ guildId: message.guild.id }, {
                        $set: {
                            roleGuard: false
                        }
                    }, { upsert: true });
                    await interaction.reply({ content: `Rol guard **kapatıldı**` })
                } else {
                    await guardSchema.findOneAndUpdate({ guildId: message.guild.id }, {
                        $set: {
                            roleGuard: true
                        }
                    }, { upsert: true });
                    await interaction.reply({ content: `Rol guard **açıldı**` })
                }
                await refreshDatas(msg, message);
            }
            if(interaction.customId === "channelGuard") {
                if((await getGuardStatus("channelGuard"))) {
                    await guardSchema.findOneAndUpdate({ guildId: message.guild.id }, {
                        $set: {
                            channelGuard: false
                        }
                    }, { upsert: true });
                    await interaction.reply({ content: `Kanal guard **kapatıldı**` })
                } else {
                    await guardSchema.findOneAndUpdate({ guildId: message.guild.id }, {
                        $set: {
                            channelGuard: true
                        }
                    }, { upsert: true });
                    await interaction.reply({ content: `Kanal guard **açıldı**` })
                }
                await refreshDatas(msg, message);
            }
            if(interaction.customId === "ytLock") {
                if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: `Komudu Kullanmak İçin Yetkin Yetersiz`, ephemeral: true })
                interaction.message.edit({ content: `İşlem Başarılı! Yetkiler Veritabanına Kaydedildi Ve İzinleri Kapatılıyor`, embeds: [], components: [], ephemeral: true })
                interaction.reply({ content: `Yönetici Yetkisine Sahip ${interaction.guild.roles.cache.filter(role => role.permissions.has(PermissionFlagsBits.Administrator) && !role.managed).map((ertu) => `<@&${ertu.id}>`).join(",")} Rollerin İzinleri Kapatılıyor!`, ephemeral: true })
                interaction.guild.roles.cache.filter(role => role.permissions.has(PermissionFlagsBits.Administrator) && !role.managed).forEach(role => {
                 db.push(`ytPerms_${interaction.guild.id}`, role.id)
                })
                interaction.guild.roles.cache.filter(rol => rol.editable).filter(rol => rol.permissions.has(PermissionFlagsBits.Administrator)).forEach(async (rol) => rol.setPermissions(0n));
            }

            if(interaction.customId === "ytUnlock") {
                if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: `Komudu Kullanmak İçin Yetkin Yetersiz`, ephemeral: true })
                let data = await db.get(`ytPerms_${interaction.guild.id}`) || []
                if (data.length <= 0) return interaction.reply({ content: `Veri Tabanında Kayıtlı Yetkili Permleri Bulunmamakta!`, ephemeral: true })
                 interaction.message.edit({ content: `İşlem Başarılı! Veritabanındaki Yetkilerin İzinleri Açılıyor.`, embeds: [], components: [], ephemeral: true })
                 interaction.reply({ content: `Önceden Yönetici Yetkisine Sahip ${data.length} Adet ${data.map((ertu) => `<@&${ertu}>`).join(",")} Rollerinin İzinleri Geri Açılıyor`, ephemeral: true })
                if (data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                    let ertum = data[i];
                    interaction.guild.roles.cache.get(ertum).setPermissions(8n).catch(err => { });
                    }
                    db.delete(`ytPerms_${interaction.guild.id}`)
                }
            }
            if(interaction.customId === "allBackup") {

            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: `Komudu Kullanmak İçin Yetkin Yetersiz!`, ephemeral: true })
            interaction.message.edit({ content: `İşlem Başarılı! Kanalların Ve Rollerin Yedekleri Alınıyor...`, embeds: [], components: [], ephemeral: true })
            interaction.reply({ content: `Rol Ve Kanalların Yedekleri Alınıyor!`, ephemeral: true }) 
            backupRoles({ guildId: message.guild.id })
            backupChannels({ guildId: message.guild.id })
            }
            if(interaction.customId === "cancel") {
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: `Komudu Kullanmak İçin Yetkin Yetersiz!`, ephemeral: true })
            msg.delete()
            interaction.reply({ content: `İşlem Başarıyla İptal Edildi!`})
        
                }
            
        });
    }
}

async function refreshDatas(msg, message) {
    const gs = await guardSchema.findOne({ guildId: message.guild.id });

        const urlGuardBtn = new ButtonBuilder()
        .setCustomId("urlGuard")
        .setLabel("URL Guard")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji((await getGuardStatus("urlGuard")) ? "🟢" : "🔴")
            
        const guildGuardBtn = new ButtonBuilder()
        .setCustomId("guildGuard")
        .setLabel("Guild Guard")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji((await getGuardStatus("guildGuard")) ? "🟢" : "🔴")

        const botGuardBtn = new ButtonBuilder()
        .setCustomId("botGuard")
        .setLabel("Bot Guard")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji((await getGuardStatus("botGuard")) ? "🟢" : "🔴")

        const emojiGuardBtn =new ButtonBuilder()
        .setCustomId("emojiGuard")
        .setLabel("Emoji Guard")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji((await getGuardStatus("emojiGuard")) ? "🟢" : "🔴")

        const stickerGuardBtn =new ButtonBuilder()
        .setCustomId("stickerGuard")
        .setLabel("Sticker Guard")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji((await getGuardStatus("stickerGuard")) ? "🟢" : "🔴")

        const otherGuardBtn =new ButtonBuilder()
        .setCustomId("otherGuard")
        .setLabel("Other Guards")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji((await getGuardStatus("otherGuard")) ? "🟢" : "🔴")

        const roleGuardBtn =new ButtonBuilder()
        .setCustomId("roleGuard")
        .setLabel("Rol Guard")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji((await getGuardStatus("roleGuard")) ? "🟢" : "🔴")
            
        const channelGuardBtn =new ButtonBuilder()
        .setCustomId("channelGuard")
        .setLabel("Channel Guard")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji((await getGuardStatus("channelGuard")) ? "🟢" : "🔴")

        const shitList = new StringSelectMenuBuilder()
        .setCustomId("SHIT_LIST")
        .setMaxValues(1)
        .setMinValues(1)
        .setPlaceholder("Güvenli Listesinde bulunanlar")
        const a = [];

        if(gs && gs.whitelist.length !== 0) {
            gs.whitelist.map(x => {
                a.push(x);
                const member = message.guild.members.cache.get(x);
                shitList.addOptions([
                    {
                        label: member.displayName + " - " + x,
                        value: x
                    }
                ]);
            });
        } else {
            shitList.setDisabled(true)
            .setPlaceholder(`Güvenli listesinde kimse bulunamadı.`)
            .addOptions([
                {
                    label: "31",
                    value: "31"
                }
            ])
        }

        const row = new ActionRowBuilder()
        .setComponents(
            urlGuardBtn,
            guildGuardBtn,
            botGuardBtn,
            stickerGuardBtn,
        )

        const row2 = new ActionRowBuilder()
        .setComponents(
            emojiGuardBtn,
            otherGuardBtn,
            roleGuardBtn,
            channelGuardBtn,
        )

        const row3 = new ActionRowBuilder()
        .setComponents(shitList) 
        

        /**
         * 
         */
        const embed = new EmbedBuilder()
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({dynamic:true}) })
        .setDescription(`
        Merhaba ${message.author} Guard Yönetim ve Kontrol Paneline Hoşgeldin!

        > Aşağıda bulunan butonlardan korumaları açıp/kapatabilir,
        > Menüden güvenli listedeki yöneticileri görebilir,
        > Database verilerini tekrar yedekleyebilir,
        > Yetkileri açıp/kapatabilirsin.
        `)
        .setFooter({text: conf.SubTitle})

        msg.edit({ embeds: [embed], components: [row, row2, row3] });
}


async function getGuardStatus (guardName) {
    const gs = await guardSchema.findOne({ guildId: conf.ServerID });
    switch (guardName) {
        case "urlGuard":
            return gs ? gs.urlGuard : false;
        case "guildGuard":
            return gs ? gs.guildGuard : false;
        case "botGuard":
            return gs ? gs.botGuard : false;
        case "emojiGuard":
            return gs ? gs.emojiGuard : false;
        case "stickerGuard":
            return gs ? gs.stickerGuard : false;
        case "otherGuard":
            return gs ? gs.otherGuard : false;
        case "roleGuard":
            return gs ? gs.roleGuard : false;
        case "channelGuard":
            return gs ? gs.channelGuard : false;
        default: false
            break;
    }
}

async function backupRoles(guildId, message) {
    const guild = client.guilds.cache.get(conf.ServerID);
    await guild.roles.cache.forEach(async (ertu) => {
        let rolePermissions = [];
        await guild.channels.cache.filter(async (crn) => await crn.permissionOverwrites.cache.has(ertu.id))
        .forEach(async (x) => {
                const channelPermissions = await x.permissionOverwrites.cache.get(ertu.id);
                if(channelPermissions && channelPermissions.allow || channelPermissions && channelPermissions.deny){
                    rolePermissions.push({ roleId: x.id, allow: channelPermissions.allow.toArray(), deny: channelPermissions.deny.toArray() });
                }
            });
            await roleBackupSchema.findOneAndUpdate({guildId: guild.id }, {
                $push: {
                    id: ertu.id,
                    name: ertu.name,
                    color: ertu.color,
                    hoist: ertu.hoist,
                    members: ertu.members.map(x => x.id),
                    mentionable: ertu.mentionable,
                    permissionOverwrites: rolePermissions,
                    permissions: ertu.permissions.bitfield.toString(),
                    position: ertu.position
                }
            }, { upsert: true });
        });
    console.log("Rol verileri başarıyla yedeklendi!");
    if(message) {
        message.channel.send({ content: `Rol verileri başarıyla yedeklendi!` });
    } else return;
}


async function backupChannels(guildId, message) {
    const guild = client.guilds.cache.get(conf.ServerID);
    if (guild) {
        const channels = [...guild.channels.cache.values()];
        for (let index = 0; index < channels.length; index++) {
            const channel = channels[index];
            let chanPerms = [];
            await guild.channels.cache.filter(ertu => channel.permissionOverwrites.cache.has(ertu.id))
            .forEach(ertu => {
                chanPerms.push({ id: ertu.id, type: ertu.type, allow: `${ertu.allow.bitfield}`, deny: `${ertu.deny.bitfield}` });
            })
            if (channel.type == 4) {
                await channelBackupSchema.findOneAndUpdate({ guildId: guild.id }, {
                    $push: {
                        writes: chanPerms,
                    },
                    $set: {
                        type: channel.type,
                        name: channel.name,
                        channelID: channel.id,
                        position: channel.position,
                    }
                }, { upsert: true });
            }
            if ((channel.type == 0) || (channel.type == 5)) {
                await channelBackupSchema.findOneAndUpdate({ guildId: guild.id }, {
                    $push: {
                        writes: chanPerms,
                    },
                    $set: {
                        name: channel.name,
                        type: channel.type,
                        nsfw: channel.nsfw,
                        channelID: channel.id,
                        position: channel.position,
                        position: channel.position,
                        rateLimit: channel.rateLimitPerUser,
                    }
                }, { upsert: true });
            }
            if (channel.type == 2) {
                await channelBackupSchema.findOneAndUpdate({ guildId: guild.id }, {
                    $push: {
                        writes: chanPerms,
                    },
                    $set: {
                        type: channel.type,
                        channelID: channel.id,
                        name: channel.name,
                        bitrate: channel.bitrate,
                        userLimit: channel.userLimit,
                        parentID: channel.parentId,
                        position: channel.position,
                    }
                }, { upsert: true })
            }
        }
        console.log("Kanal Verileri Başarıyla Yedeklendi!");
        if(message) {
            message.channel.send({ content: `Kanal verileri başarıyla yedeklendi!` });
            const a = await channelBackupSchema.findOne({ guildId: guild.id });
            console.log(a.channelID);
        } else return;
    }
}