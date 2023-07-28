const {ActivityType, Client, EmbedBuilder, GatewayIntentBits, Partials, Events, AuditLogEvent, Collection } = require("discord.js");
const { readdir } = require('fs');
const {Prefix} = require("../../../Global/Settings/System")
const { Kufurler, AntiSpam, KufurLimit, Ads, LinkLimit,Process,  } = require("../System.js");
const ertum = require("../../../Global/Settings/Setup.json");
const ertucuk = require("../../../Global/Settings/System");
const guardSchema = require("../schemas/guardSchema")
const roleBackupSchema = require("../schemas/roleBackupSchema");
const channelBackupSchema = require("../schemas/channelBackupSchema");

const { BsonDatabase,JsonDatabase,YamlDatabase } = require("five.db");
const System = require("../System.js");
const db = new JsonDatabase();

const client = global.bot = new Client({
    intents: Object.keys(GatewayIntentBits),
    partials: Object.keys(Partials),    
})

const database = new Client({
    intents: Object.keys(GatewayIntentBits),
    partials: Object.keys(Partials),    
});

/**
 *  @TODO : "capslockBlocker, linkBlocker, swearBlocker, banGuard, kickGuard, urlBlocker, emojiBlocker"
 *  @author : {ERTU&Crane}
 *  @complated : "capslockBlocker, linkBlocker, swearBlocker, banGuard, kickGuard, urlBlocker, emojiBlocker"
 **/

 const commands = client.commands = new Collection();
 const aliases = client.aliases = new Collection();
 readdir("./commands/", (err, files) => {
     if (err) console.error(err)
     files.forEach(f => {
         readdir("./commands/" + f, (err2, files2) => {
             if (err2) console.log(err2)
             files2.forEach(file => {
                 let ertucum = require(`./commands/${f}/` + file);
                 console.log(`${ertucum.name} Yüklendi!`);
                 commands.set(ertucum.name, ertucum);
                 ertucum.aliases.forEach(alias => { aliases.set(alias, ertucum.name); });
             });
         });
     });
 });

 client.on(Events.MessageCreate, async (message) => {
    if (Prefix && !message.content.startsWith(Prefix)) return;
    const args = message.content.slice(1).trim().split(/ +/g);
    const commands = args.shift().toLowerCase();
    const cmd = client.commands.get(commands) || [...client.commands.values()].find((e) => e.aliases && e.aliases.includes(commands));
    if (cmd) {
        cmd.execute(client, message, args);
    }
})

client.on(Events.ClientReady, () => {
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
        const channel = client.channels.cache.get(ertucuk.BotVoiceChannel);
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
          status: ertucuk.Presence.Status,
          activities: [
            {
              name: ertucuk.Presence.Message[Math.floor(Math.random() * ertucuk.Presence.Message.length)],
              type: getType(ertucuk.Presence.Type),
              url: "https://www.twitch.tv/ertucuk"
            },
          ],
        });
      }, 10000);
})

const { VanityClient } = require("discord-url"); 
const urlClient = new VanityClient(ertucuk.Security.SelfBotToken,ertucuk.ServerID,false);

client.on(Events.GuildUpdate,async (oldGuild,newGuild) => { 
if(oldGuild.id == ertucuk.ServerID && oldGuild.vanityURLCode !== newGuild.vanityURLCode) {
const ertu = await oldGuild.guild.fetchAuditLogs({ type: AuditLogEvent.GuildUpdate });
const member = ertu.entries.first();
if(!(await getGuardStatus("urlGuard"))) return createEmbed(`${member.executor} üyemiz url'yi değiştirdi. URL Guard kapalı olduğu için işlem yapmadım.`)
punishMember(member.executor, null, null, Process.UrlUpdate);
urlClient.setVanityURL(ertucuk.ServerURL);    
createEmbed(`Bir üye urlye dokunmaya çalıştı!!!! \n\nYetkili: <@${member.executorId}> \n Tarih: <t:${Math.floor(Date.now() / 1000)}:F>`);
}
});

client.on(Events.GuildUpdate, async (oldGuild, newGuild) => {
    if ((oldGuild.splash !== newGuild.splash) || (oldGuild.iconURL() !== newGuild.iconURL()) || (oldGuild.name !== newGuild.name) || (oldGuild.bannerURL() !== newGuild.bannerURL())) {
    const ertu = await newGuild.fetchAuditLogs({ type: AuditLogEvent.GuildUpdate });
    const member = ertu.entries.first();
    console.log((await getGuardStatus("guildGuard")));
    if(!(await getGuardStatus("guildGuard"))) return createEmbed(`${member.executor} üeysi sunucuda değişiklik yaptı. Sunucu Guard kapalı olduğu için işlem yapmadım.`)
    if((await isWhiteListed(member.executorId))) return createEmbed(`
    ### Bir üye sunucu üzerinde işlem serçekleştirdi fakat güvenlide olduğu için işlem yapmadım. \n\nYetkili: <@${member.executorId}> \n Eski Sunucu Bilgileri: \`${oldGuild.name}\` ${oldGuild.bannerURL() !== null ? `[Banner](${oldGuild.bannerURL()})` : ""} ${oldGuild.iconURL() !== null ? `[Icon](${oldGuild.iconURL()})` : ""} ${oldGuild.splash !== null ? `[Invite Banner](${oldGuild.splash})` : ""}\nDeğişen Sunucu Bilgileri: \`${newGuild.name}\` ${newGuild.bannerURL() !== null ? `[Banner](${newGuild.bannerURL()})` : ""} ${newGuild.iconURL() !== null ? `[Icon](${newGuild.iconURL()})` : ""} ${newGuild.splash !== null ? `[Invite Banner](${newGuild.splash})` : ""}\nTarih: <t:${Math.floor(Date.now() / 1000)}:F>
    `)
    punishMember(member.executor, null, null, Process.ServerUpdate);
    if (oldGuild.iconURL() !== newGuild.iconURL()) newGuild.setIcon(oldGuild.iconURL({ dynamic: true }))
    if (oldGuild.bannerURL() !== newGuild.bannerURL()) newGuild.setBanner(oldGuild.bannerURL({ size: 2048, dynamic: true }))
    if (oldGuild.name !== newGuild.name) newGuild.setName(oldGuild.name)
    if (oldGuild.splash !== newGuild.splash) newGuild.setSplash(oldGuild.splash)
    createEmbed(`Bir üye sunucu üzerinde işlem serçekleştirdi! \n\nYetkili: <@${member.executorId}> \n Eski Sunucu Bilgileri: \`${oldGuild.name}\` ${oldGuild.bannerURL() !== null ? `[Banner](${oldGuild.bannerURL()})` : ""} ${oldGuild.iconURL() !== null ? `[Icon](${oldGuild.iconURL()})` : ""} ${oldGuild.splash !== null ? `[Invite Banner](${oldGuild.splash})` : ""}\nDeğişen Sunucu Bilgileri: \`${newGuild.name}\` ${newGuild.bannerURL() !== null ? `[Banner](${newGuild.bannerURL()})` : ""} ${newGuild.iconURL() !== null ? `[Icon](${newGuild.iconURL()})` : ""} ${newGuild.splash !== null ? `[Invite Banner](${newGuild.splash})` : ""}\nTarih: <t:${Math.floor(Date.now() / 1000)}:F>`);
}}) 


// THIS IS STİCKER CREATE BLOCKER
client.on(Events.GuildStickerCreate, async (sticker) => {
const ertu = await emoji.guild.fetchAuditLogs({ type: AuditLogEvent.StickerCreate  });
const member = ertu.entries.first();
if(!member || member.executorId === client.user.id) return;
if(!(await getGuardStatus("stickerGuard"))) return createEmbed(`${member.executor} üyesi emoji oluşturdu. Emoji Guard kapalı olduğu için işlem yapmadım.`)
if((await isWhiteListed(member.executorId))) return createEmbed(`
### ${member.executor} bir sticker açma girişiminde bulundu, fakat güvenlide olduğu için işlem yapmadım.\n\n  Yetkili: <@${member.executorId}> \n **Sticker Bilgileri: \`${sticker.name}\` [Sticker URL](${sticker.url})** \n Tarih: <t:${Math.floor(Date.now() / 1000)}:F>
`)
punishMember(member.executor, null, null, Process.StickerCreate);
sticker.delete()
createEmbed(`Bir üye sticker eklemeye çalıştı! \n\nYetkili: <@${member.executorId}> \n **Sticker Bilgileri: \`${sticker.name}\` [Sticker URL](${sticker.url})**\n Tarih: <t:${Math.floor(Date.now() / 1000)}:F>`);
})

// THIS IS STİCKER DELETE BLOCKER
client.on(Events.GuildStickerDelete, async (sticker) => {
const ertu = await emoji.guild.fetchAuditLogs({ type: AuditLogEvent.StickerDelete  });
const member = ertu.entries.first();
if(!member || member.executorId === client.user.id) return;
if(!(await getGuardStatus("stickerGuard"))) return createEmbed(`${member.executor} üyesi emoji oluşturdu. Emoji Guard kapalı olduğu için işlem yapmadım.`)
if((await isWhiteListed(member.executorId))) return createEmbed(`
### ${member.executor} bir sticker silme girişiminde bulundu, fakat güvenlide olduğu için işlem yapmadım.\n\n  Yetkili: <@${member.executorId}> \n **Sticker Bilgileri: \`${sticker.name}\` [Sticker URL](${sticker.url})** \n Tarih: <t:${Math.floor(Date.now() / 1000)}:F>
`)
punishMember(member.executor, null, null, Process.StickerDelete);
sticker.guild.stickers.create({ file: sticker.url, name: sticker.name, tags: sticker.tags, description: sticker.description })
createEmbed(`Bir üye sticker silmeye çalıştı! \n\nYetkili: <@${member.executorId}> \n **Sticker Bilgileri: \`${sticker.name}\` [Sticker URL](${sticker.url})**\n Tarih: <t:${Math.floor(Date.now() / 1000)}:F>`);
})

// THIS IS STİCKER UPDATE BLOCKER
client.on(Events.GuildStickerUpdate, async (oldSticker, newSticker) => {
const ertu = await oldSticker.guild.fetchAuditLogs({ type: AuditLogEvent.StickerUpdate  });
const member = ertu.entries.first();
if(!member || member.executorId === client.user.id) return;
if(!(await getGuardStatus("stickerGuard"))) return createEmbed(`${member.executor} üyesi emoji oluşturdu. Emoji Guard kapalı olduğu için işlem yapmadım.`)
if((await isWhiteListed(member.executorId))) return createEmbed(`
### ${member.executor} bir sticker güncelleme girişiminde bulundu, fakat güvenlide olduğu için işlem yapmadım.\n\n  Yetkili: <@${member.executorId}> \n **Eski Sticker Bilgileri: \`${oldSticker.name}\` [Sticker URL](${oldSticker.url})** \n **Yeni Sticker Bilgileri: \`${newSticker.name}\` [Sticker URL](${newSticker.url})**  \n Tarih: <t:${Math.floor(Date.now() / 1000)}:F>
`)
punishMember(member.executor, null, null, Process.StickerUpdate);
newSticker.edit({ name: oldSticker.name, tags: oldSticker.tags, description: oldSticker.description })
createEmbed(`Bir üye sticker güncellemeye çalıştı! \n\nYetkili: <@${member.executorId}> \n **Eski Sticker Bilgileri: \`${oldSticker.name}\` [Emoji URL](${oldSticker.url})**\n **Yeni Sticker Bilgileri: \`${newSticker.name}\` [Emoji URL](${newSticker.url})** \n  Tarih: <t:${Math.floor(Date.now() / 1000)}:F>`);
})



// THIS IS EMOJİ CREATE BLOCKER
client.on(Events.GuildEmojiCreate, async (emoji) => {
    const ertu = await emoji.guild.fetchAuditLogs({ type: AuditLogEvent.EmojiCreate });
    const member = ertu.entries.first();
    if(!member || member.executorId === client.user.id) return;
    if(!(await getGuardStatus("emojiGuard"))) return createEmbed(`${member.executor} üyesi emoji oluşturdu. Emoji Guard kapalı olduğu için işlem yapmadım.`)
    if((await isWhiteListed(member.executorId))) return createEmbed(`
    ### ${member.executor} bir emoji açma girişiminde bulundu, fakat güvenlide olduğu için işlem yapmadım.\n\n  Yetkili: <@${member.executorId}> \n **Emoji Bilgileri: \`${emoji.name}\` [Emoji URL](${emoji.url})** \n Tarih: <t:${Math.floor(Date.now() / 1000)}:F>
    `)
    punishMember(member.executor, null, null, Process.EmojiCreate);
    emoji.delete();
    createEmbed(`Bir üye emoji eklemeye çalıştı! \n\nYetkili: <@${member.executorId}> \n **Emoji Bilgileri: \`${emoji.name}\` [Emoji URL](${emoji.url})**\n Tarih: <t:${Math.floor(Date.now() / 1000)}:F>`);
})

// THIS IS EMOJİ DELETE BLOCKER
client.on(Events.GuildEmojiDelete, async (emoji) => {
    const ertu = await emoji.guild.fetchAuditLogs({ type: AuditLogEvent.EmojiDelete });
    const member = ertu.entries.first();
    if(!member || member.executorId === client.user.id) return;
    if(!(await getGuardStatus("emojiGuard"))) return createEmbed(`${member.executor} üyesi emoji sildi. Emoji Guard kapalı olduğu için işlem yapmadım.`)
    if((await isWhiteListed(member.executorId))) return createEmbed(`
    ### ${member.executor} bir emoji silme girişiminde bulundu, fakat güvenlide olduğu için işlem yapmadım.\n\n  Yetkili: <@${member.executorId}> \n **Emoji Bilgileri: \`${emoji.name}\` [Emoji URL](${emoji.url})** \n Tarih: <t:${Math.floor(Date.now() / 1000)}:F>
    `)
    punishMember(member.executor, null, null, Process.EmojiDelete);
    emoji.guild.emojis.create({ attachment: emoji.url, name: emoji.name })
    createEmbed(`Bir üye emoji silmeye çalıştı! \n\nYetkili: <@${member.executorId}> \n **Emoji Bilgileri: \`${emoji.name}\` [Emoji URL](${emoji.url})**\n Tarih: <t:${Math.floor(Date.now() / 1000)}:F>`);
})

// THIS IS EMOJİ UPDATE BLOCKER
client.on(Events.GuildEmojiUpdate, async (oldEmoji, newEmoji) => {
    const ertu = await oldEmoji.guild.fetchAuditLogs({ type: AuditLogEvent.EmojiUpdate });
    const member = ertu.entries.first();
    if(!member || member.executorId === client.user.id) return;
    if(!(await getGuardStatus("emojiGuard"))) return //createEmbed(`${member.executor} üyesi emoji güncelledi. Emoji Guard kapalı olduğu için işlem yapmadım.`)
    if((await isWhiteListed(member.executorId))) return createEmbed(`
    ### ${member.executor} bir emoji güncelleme girişiminde bulundu, fakat güvenlide olduğu için işlem yapmadım.\n\n  Yetkili: <@${member.executorId}> \n **Eski Emoji Bilgileri: \`${oldEmoji.name}\` [Emoji URL](${oldEmoji.url})**\n **Yeni Emoji Bilgileri: \`${newEmoji.name}\` [Emoji URL](${newEmoji.url})** \n Tarih: <t:${Math.floor(Date.now() / 1000)}:F>

    `)
    punishMember(member.executor, null, null, Process.EmojiUpdate);
    newEmoji.edit({ name: oldEmoji.name })
    createEmbed(`Bir üye emoji güncellemeye çalıştı! \n\nYetkili: <@${member.executorId}> \n **Eski Emoji Bilgileri: \`${oldEmoji.name}\` [Emoji URL](${oldEmoji.url})**\n **Yeni Emoji Bilgileri: \`${newEmoji.name}\` [Emoji URL](${newEmoji.url})** \n  Tarih: <t:${Math.floor(Date.now() / 1000)}:F>`);
})
  
/////////////---------ERTU CHAT GUARD---------/////////////////////

// THIS IS A CAPSLOCK GUARD ew
client.on(Events.MessageCreate, async (message) => {
    if(message.author.id === client.user.id) return;
    if((await isWhiteListed(message.author.id))) return;
    const persentage = await capslockYuzde(message.content)
    if(Math.floor(persentage) >= System.CapsLockYuzde) {
        if(!(await getGuardStatus("otherGuard"))) return //createEmbed(`${message.member} üyesi capslock kullandı. Diğer Guard kapalı olduğu için işlem yapmadım.`)
        message.deletable ? message.delete() : console.log(`${message.author.tag} - ${message.author.id} mesajı silinebilir değil.`);
        message.channel.send({ content: `**Bu sunucuda capslock engel aktif!**` })
        .then(x => {
            setTimeout(() => {
                x.delete();
            }, 1000*3)
        })
    }
})

// THIS IS A SWEAR GUARD
client.on(Events.MessageCreate, async (message) => {
    if(message.author.id === client.user.id) return;
    if((await isWhiteListed(message.author.id))) return
    const msg = message.content.split(" ");
    if(Kufurler.some(x => msg.includes(x))) {
        if(!(await getGuardStatus("otherGuard"))) return //createEmbed(`${message.member} üyesi küfür etti. Diğer Guard kapalı olduğu için işlem yapmadım.`)
        return message.channel.send({ content: `**Bu sunucuda küfür engel aktif!**` })
        .then(x => {
            message.deletable ? message.delete() : console.log(`${message.author.tag} - ${message.author.id} mesajı silinebilir değil.`);
            setTimeout(() => {
                x.delete();
            }, 1000*3);
        });
    }
});

// THIS IS ADBLOCK
client.on(Events.MessageCreate, async (message) => {
    if(message.author.id === client.user.id) return;
    if((await isWhiteListed(message.author.id))) return
    if(Ads.test(message.content)) {
        if(!(await getGuardStatus("otherGuard"))) return //createEmbed(`${message.member} üyesi reklam yaptı. Diğer Guard kapalı olduğu için işlem yapmadım.`)
        message.deletable ? message.delete() : console.log(`${message.author.tag} - ${message.author.id} mesajı silinebilir değil.`);
        db.add(`ads.${message.author.id}`, 1);
        const linkData = await db.get(`ads.${message.author.id}`) || 0;
        if(linkData >= LinkLimit) {
            message.member.kickable ? message.guild.members.cache.get(message.author.id).kick({ reason: `Reklam Koruma | Üye reklam sınırını geçti (${LinkLimit})`}) : console.error("HATA: BOTA YETKI VER SALAK HERIF UYE BANLAYAMIYORUM");
            db.delete(`ads.${message.author.id}`);
            return message.channel.send({ content: `${message.member} adlı kullanıcı reklam engel limitini geçtiği için sunucudan kicklendi.` })
            .then(ertu => {
                setTimeout(() => {
                    ertu.delete();
                }, 1000*3);
            });
        }
        return message.channel.send({ content: `Bu sunucuda reklam engel aktif! Eğer devam edersen yaptırım uygulanacaktır.` }).then(x => {
            setTimeout(() => {
                ertu.delete();
            }, 1000*3);
        });
    }
});

/////////////---------ERTU CHAT GUARD FINISH---------/////////////////////



// THIS IS BOTGUARD (THE LAST) 
client.on(Events.GuildMemberAdd, async (member) => {
    const ertu = await member.guild.fetchAuditLogs({ type: AuditLogEvent.BotAdd, limit: 1 });
    const sucluMember = ertu.entries.first().executor;
    if(sucluMember.id === client.user.id) return;
    if(!(await getGuardStatus("botGuard"))) return //createEmbed(`${member} üyesi suncuya bot ekledi. Bot Guard kapalı olduğu için işlem yapmadım.`)
    if((await isWhiteListed(sucluMember.id))) return
    punishMember(sucluMember, member, null, System.Process.BotAdd);
    createEmbed(`${suclu} üyesi, sunucuya izinsiz bot yetkilendirme girişiminde bulundu.`);
}) 

// THIS IS BANGUARD
client.on(Events.GuildMemberRemove, async (member) => {
    let ertu = await member.guild.fetchAuditLogs({ type: AuditLogEvent.MemberBanAdd, limit: 1 });
    const sucluMember = ertu.entries.first().executor;
    db.add(`banLimit.${sucluMember}`, 1);
    const banLimit = await db.get(`banLimit.${sucluMember}`);
    if(sucluMember.id === client.user.id) return;
    if(!(await getGuardStatus("otherGuard"))) return //createEmbed(`${member} üyesi bir üyeyi banladı. Ban Guard kapalı olduğu için işlem yapmadım.`)
    if((await isWhiteListed(sucluMember.id))) return 
    if(banLimit >= System.Ban) {
        punishMember(sucluMember, null, member, System.Process.MemberBanAdd);
        sucluMember.guild.members.unban(member.id);
    }
    const desc = banLimit >= System.Ban ? 
    `${sucluMember} adlı üye (${banLimit}/${System.Ban}) ban limitine ulaştığı için JAIL'e attım.` : 
    `${sucluMember} birisini elle banladı! Kalan hak: (${banLimit}/${System.Ban})`

    createEmbed(`${desc}`);
    
    try {
        const ertu = new EmbedBuilder()
        .setAuthor({ name: member.guild.name, iconURL: member.guild.iconURL({dynamic:true}) })
        .setDescription(`Elle ban hakkınız azalıyor! (${banLimit}/${System.Ban})`)
        .setFooter({ text: ertucuk.SubTitle })
        const dm = sucluMember.createDM();
        dm.send({ embeds: [ertu] });
    } catch (err) {
        console.log(`${sucluMember.user.tag} adlı üyenin DM'si kapalı.`);
    }
});


// THIS IS KICKGUARD (SAME THINKS)
client.on(Events.GuildMemberRemove, async (member) => {
    let auditSeysi = await member.guild.fetchAuditLogs({ type: AuditLogEvent.MemberKick, limit: 1 });
    const sucluMember = auditSeysi.entries.first().executor;
    db.add(`kickLimit.${sucluMember}`, 1);
    const kickLimit = await db.get(`kickLimit.${sucluMember}`); 
    if(sucluMember.id === client.user.id) return;
    if(!(await getGuardStatus("otherGuard"))) return //createEmbed(`${member} üyesi bir üyeyi kickledi. Kick Guard kapalı olduğu için işlem yapmadım.`)
    if((await isWhiteListed(sucluMember.id))) return
    if(kickLimit >= System.Kick) punishMember(sucluMember, null, member, System.Process.MemberKickAdd);
    const desc = kickLimit >= System.Kick ? 
    `${sucluMember} adlı üye (${kickLimit}/${System.Kick}) kick limitine ulaştığı için JAIL'e attım.` : 
    `${sucluMember} birisini elle kickledi! Kalan hak: (${kickLimit}/${System.Kick})`
    
    createEmbed(`${desc}`);
    
    try {
        const ertu = new EmbedBuilder()
        .setAuthor({ name: member.guild.name, iconURL: member.guild.iconURL({dynamic:true}) })
        .setDescription(`Elle kick hakkınız azalıyor! (${kickLimit}/${System.Kick})`)
        .setFooter({ text: ertucuk.SubTitle })
        const dm = sucluMember.createDM();
        dm.send({ embeds: [ertu] });
    } catch (err) {
        console.log(`${sucluMember.user.tag} adlı üyenin DM'si kapalı.`);
    }
});

/// DATABASE 

database.on(Events.ClientReady, async () => {

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

    /*
    console.log("Database Bot Kullanıma Aktif Edilmiştir ✓");
    backupRoles(ertucuk.ServerID);
    backupChannels(ertucuk.ServerID);
    setInterval(() => {
        backupRoles(ertucuk.ServerID);
        backupChannels(ertucuk.ServerID);
    }, 1000*60*60*5);
    */

    setInterval(async () => {
        database.user.setPresence({
          status: ertucuk.Presence.Status,
          activities: [
            {
              name: ertucuk.Presence.Message[Math.floor(Math.random() * ertucuk.Presence.Message.length)],
              type: getType(ertucuk.Presence.Type),
              url: "https://www.twitch.tv/ertucuk"
            },
          ],
        });
      }, 10000);


});


database.on(Events.MessageCreate, async (message) => {
    if(message.author.bot) return;
    if(message.content.startsWith(`!backup`)) {
        message.channel.send(`Kanal ve rol verileri kaydediliyor.. (Bu işlem birkaç dakika alabilir)`)
        backupRoles(message.guild.id, message);
        backupChannels(message.guild.id, message);
    }
});

async function backupRoles(guildId, message) {
    const guild = client.guilds.cache.get(guildId);
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
    const guild = client.guilds.cache.get(ertucuk.ServerID);
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

async function capslockYuzde(content) {
    const totalChars = content.length;
    const upperCasedChars = content.split('').reduce(function(count, char) {
        if(char >= 'A' && char <= 'Z') {
            return count + 1;
        }
        return count;
    }, 0);

    const upperCasedPersentage = (upperCasedChars / totalChars) * 100;
    return upperCasedPersentage.toFixed(2);
}

async function punishMember(suclu, suclu2, magdur, punishment, reason) {
    const guild = client.guilds.cache.get(ertucuk.ServerID);
    if(!suclu) return console.error(`HATA: Bir üye belirtmelisiniz!`);
    if(!punishment) return console.error(`HATA: Bir ceza türü belirtmelisiniz!`);
    if(!reason) reason = "Belirtilmedi.";
    suclu = guild.members.cache.get(suclu.id ? suclu.id : suclu);

    if(punishment === "JAIL") {
        suclu.manageable ? suclu.roles.cache.has(ertum.BoosterRole) ? suclu.roles.set([ertum.JailedRoles[0], ertum.BoosterRole]) : suclu.roles.set([ertum.JailedRoles[0]]) : createEmbed("Missing permissions");
        if(suclu2 && suclu2.manageable) suclu2.roles.cache.has(ertum.BoosterRole) ? suclu2.roles.set([ertum.JailedRoles[0], ertum.BoosterRole]) : suclu2.roles.set([ertum.JailedRoles[0]]); else createEmbed("Missing permissions");
        if(magdur) magdur.roles.cache.has(ertum.BoosterRole) ? magdur.roles.set([ertum.JailedRoles[0], ertum.BoosterRole]) : magdur.roles.set([ertum.JailedRoles[0]]);
    }
    if(punishment === "BAN") {
        suclu.bannable ? guild.members.ban(suclu.id, { reason: reason }) : console.log(`Bu üyeyi banlayamıyorum.`);
        if(suclu2) suclu2.bannable ? guild.members.ban(suclu2.id, { reason: reason }) : console.log(`Bu üyeyi banlayamıyorum.`);
        if(magdur) magdur.bannable ? guild.members.ban(magdur.id, { reason: reason }) : console.log(`Bu üyeyi banlayamıyorum.`);
    }
    if(punishment === "YTCEK") {
        suclu.guild.roles.cache.filter(x => x.editable && (x.permissions.has(PermissionFlagsBits.Administrator) || x.permissions.has(PermissionFlagsBits.ManageGuild) || x.permissions.has(PermissionFlagsBits.ManageChannels) || x.permissions.has(PermissionFlagsBits.ManageRoles) || x.permissions.has(PermissionFlagsBits.ManageWebhooks))).forEach( async (role) => {
            await role.setPermissions(0n);
        });
    }
}

async function isWhiteListed(id) {
    let guild = client.guilds.cache.get(ertucuk.ServerID);
    let member = guild.members.cache.get(id);
    let safeData = await guardSchema.findOne({ guildId: guild.id }) || {whitelist:[]};
    if (member && safeData && safeData.whitelist.some(id => member.id == id || member.roles.cache.has(id))) return true;
    return false;
}

async function createEmbed(description) {
    if(!description) return console.error("Açıklama gir.");
    const channel = client.channels.cache.find(x => x.name === "guard_log");

    if(!channel) return console.error("Kanal bulunamadı. Lütfen ilk başta setup yapın!")

    const crane = new EmbedBuilder()
    .setAuthor({ name: channel.guild.name, iconURL: channel.guild.iconURL({ dynamic: true }) })
    .setDescription(`${description}`)
    .setFooter({ text: ertucuk.SubTitle }) 
    .setThumbnail(channel.guild.iconURL())
    .setTimestamp()
    channel.send({ embeds: [crane] });
}

async function getGuardStatus (guardName) {
    const gs = await guardSchema.findOne({ guildId: ertucuk.ServerID });
    switch (guardName) {
        case "webGuard":
            return gs ? gs.webGuard : false;
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

const mongoose = require("mongoose");
mongoose.connect(ertucuk.MongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
console.log("Guardların Database bağlantısı tamamlandı!")
}).catch((err) => {
    throw err;
});

client.login(ertucuk.Security.Guard_I).then(ertu => console.log(`Guard 1 Hazır!`)).catch(crane => console.error(`${crane.message} Bot aktif edilemedi!`))
ertucuk.Security.Database.forEach(tkn => {
    database.login(tkn);
});
