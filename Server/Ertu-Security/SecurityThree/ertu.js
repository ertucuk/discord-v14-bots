const {ActivityType, Client, EmbedBuilder, GatewayIntentBits, Partials, Events, AuditLogEvent, PermissionFlagsBits,ChannelType } = require("discord.js");
const { Process, ChannelCreate, ChannelUpdateLimit, ChannelDelete } = require("../System.js");
const ertum = require("../../../Global/Settings/Setup.json");
const ertucuk = require("../../../Global/Settings/System");
const guardSchema = require("../schemas/guardSchema")
const { channelGuard } = guardSchema.findOne({ guildId: ertucuk.ServerID });


const { BsonDatabase,JsonDatabase,YamlDatabase } = require("five.db");
const db = new JsonDatabase();

const client = new Client({
    intents: Object.keys(GatewayIntentBits),
    partials: Object.keys(Partials),    
});


/**
 * 
 *  @TODO       : [channelCreate, channelDelete, channelUpdate];
 *  @author     : {ERTU&CRANE};
 *  @complated  : [channelCreate, channelDelete, channelUpdate];
 *  @willbeadd  : [luhux 31 cekmemeli!]
 * 
 **/


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

client.on(Events.ChannelCreate, async (channel) => {
    const member = (await client.guilds.cache.get(channel.guildId).fetchAuditLogs({ type: AuditLogEvent.ChannelCreate, limit: 1 })).entries.first();    
    if(!member || member.executorId === client.user.id) return;
    if(!(await getGuardStatus("channelGuard"))) return //createEmbed(`${member.executor} bir kanal açtı. Kanal Guard kapalı olduğu için işlem yapmadım.`)
    if((await isWhiteListed(member.executorId))) return createEmbed(`
    ### <@${member.executorId}> üyesi kanal oluşturdu, fakat güvenli listesinde olduğu için işlem yapmadım.\n\n Yetkili: <@${member.executorId}> \n Kanal İsmi \` #${channel.name} - ${channel.id} \` \n Tarih: <t:${Math.floor(Date.now() / 1000)}:F>`)
    db.add(`channelCreateLimit.${member.executorId}`, 1);
    const channelCreateLimit = await db.get(`channelCreateLimit.${member.executorId}`);
    if(channelCreateLimit >= ChannelCreate) {
        punishMember(member.executorId, null, null, Process.ChannelCreate);
        db.delete(`channelCreateLimit.${member.executorId}`);
    }      
    channel.delete({ reason: `Kanal izinsiz oluşturulduğu için silindi.` });
    return createEmbed(`### Bir üye bir kanal oluşturmaya çalıştı! (${channelCreateLimit}/${ChannelCreate}) \n\n  Yetkili: <@${member.executorId}> \n Kanal İsmi \` #${channel.name} - ${channel.id} \` \n Tarih: <t:${Math.floor(Date.now() / 1000)}:F>`);
});

client.on(Events.ChannelDelete, async (channel) => {
    const member = (await client.guilds.cache.get(channel.guildId).fetchAuditLogs({ type: AuditLogEvent.ChannelDelete, limit: 1 })).entries.first();    
    const guild = channel.guild;
    if(member.executorId === client.user.id) return;
    if(!(await getGuardStatus("channelGuard"))) return //createEmbed(`${member.executor} bir kanal sildi. Kanal Guard kapalı olduğu için işlem yapmadım.`)
    if((await isWhiteListed(member.executorId))) return createEmbed(`
    ### <@${member.executorId}> üyesi kanal sildi, fakat güvenli listesinde olduğu için işlem yapmadım. \n\n Yetkili: <@${member.executorId}> \n Kanal İsmi \` #${channel.name} - ${channel.id} \` \n Tarih: <t:${Math.floor(Date.now() / 1000)}:F> `)
    db.add(`channelDeleteLimit.${member.executorId}`, 1);
    const channelDeleteLimit = await db.get(`channelDeleteLimit.${member.executorId}`);
    if(channelDeleteLimit >= ChannelDelete) {
        punishMember(member.executorId, null, null, Process.ChannelDelete);
        db.delete(`channelDeleteLimit.${member.executorId}`);
    }    
    if (channel.type == 4) {
        channel.guild.channels.create({
            name: channel.name,
            rawPosition: channel.rawPosition,
            type: ChannelType.GuildCategory
        })
    } else {
        channel.clone({ parent: channel.parentId })
    }
    return createEmbed(`### Bir üye bir kanal silmeye çalıştı! (${channelDeleteLimit}/${ChannelDelete}) \n\n  Yetkili: <@${member.executorId}> \n Kanal İsmi \`#${channel.name}\` \n Tarih: <t:${Math.floor(Date.now() / 1000)}:F>`);
});

client.on(Events.ChannelUpdate, async (oldChannel, newChannel) => {
    const member = (await client.guilds.cache.get(oldChannel.guildId).fetchAuditLogs({ type: AuditLogEvent.ChannelUpdate, limit: 1 })).entries.first();    
    const guild = oldChannel.guild;
    if(!member || member.executorId === client.user.id) return;
    if(!(await getGuardStatus("channelGuard"))) return //createEmbed(`${member.executor} bir kanal güncelledi. Kanal Guard kapalı olduğu için işlem yapmadım.`)
    if((await isWhiteListed(member.executorId))) return createEmbed(`
    ### <@${member.executorId}> üyesi kanal düzenledi fakat güvenli listesinde olduğu için işlem yapmadım.\n\n Yetkili: <@${member.executorId}> \n Kanalın Önceki İsmi \`#${oldChannel.name}\` \n Kanalın Değiştirilen İsmi: #${newChannel.name} \n Tarih: <t:${Math.floor(Date.now() / 1000)}:F>`)
    db.add(`channelUpdateLimit.${member.executorId}`, 1);
    const channelUpdateLimit = await db.get(`channelUpdateLimit.${member.executorId}`);
    if(channelUpdateLimit >= ChannelUpdateLimit) {
        punishMember(member.executorId, null, null, Process.ChannelUpdate);
        db.delete(`channelUpdateLimit.${member.executorId}`);
    }
    oldChannel.guild.channels.edit(newChannel.id,{
        name:oldChannel.name,
        position:oldChannel.position,
        topic:oldChannel.topic,
        nsfw:oldChannel.nsfw,
        parent:oldChannel.parent,
        userLimit:oldChannel.userLimit,
        bitrate:oldChannel.bitrate,
    })
    return createEmbed(`### Bir üye bir kanalın özelliğini değiştirmeye çalıştı! (${channelUpdateLimit}/${ChannelUpdateLimit}) \n\n  Yetkili: <@${member.executorId}> \n Kanalın Önceki İsmi \`#${oldChannel.name}\` \n Kanalın Değiştirilen İsmi: #${newChannel.name} \n Tarih: <t:${Math.floor(Date.now() / 1000)}:F>`);
});


async function punishMember(suclu, suclu2, magdur, ceza, sebep) {
    const guild = client.guilds.cache.get(ertucuk.ServerID);
    if(!suclu) return console.error(`HATA: Bir üye belirtmelisiniz!`);
    if(!ceza) return console.error(`HATA: Bir ceza türü belirtmelisiniz!`);
    if(!sebep) sebep = "Guard Koruma";
    suclu = guild.members.cache.get(suclu);

    if(ceza === "JAIL") {
        suclu.roles.cache.has(ertum.BoosterRole) ? suclu.roles.set([ertum.JailedRoles[0], ertum.BoosterRole]) : suclu.roles.set([ertum.JailedRoles[0]]);
        if(suclu2) suclu2.roles.cache.has(ertum.BoosterRole) ? suclu2.roles.set([ertum.JailedRoles[0], ertum.BoosterRole]) : suclu2.roles.set([ertum.JailedRoles[0]]);
        if(magdur) magdur.roles.cache.has(ertum.BoosterRole) ? magdur.roles.set([ertum.JailedRoles[0], ertum.BoosterRole]) : magdur.roles.set([ertum.JailedRoles[0] ]);
    }
    if(ceza === "BAN") {
        suclu.bannable ? guild.members.ban(suclu.id, { reason: sebep }) : console.log(`Bu üyeyi banlayamıyorum.`);
        if(suclu2) suclu2.bannable ? guild.members.ban(suclu2.id, { reason: sebep }) : console.log(`Bu üyeyi banlayamıyorum.`);
        if(magdur) magdur.bannable ? guild.members.ban(magdur.id, { reason: sebep }) : console.log(`Bu üyeyi banlayamıyorum.`);
    }
    if(ceza === "YTCEK") {
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

    const ertu = new EmbedBuilder()
    .setAuthor({ name: channel.guild.name, iconURL: channel.guild.iconURL({ dynamic: true }) })
    .setDescription(`${description}`)
    .setFooter({ text: ertucuk.SubTitle }) 
    .setThumbnail(channel.guild.iconURL())
    .setTimestamp()
    return channel.send({ embeds: [ertu] });
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
}).catch((err) => {
    throw err;
});

client.login(ertucuk.Security.Guard_III).then(ertu => console.log(`Guard 3 Hazır!`)).catch(crane => console.error(`${crane.message} Bot aktif edilemedi!`))
