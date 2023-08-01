const {ActivityType, Client, EmbedBuilder, GatewayIntentBits, Partials, Events, AuditLogEvent, PermissionFlagsBits } = require("discord.js");
const { BotOwners, RoleGuard, Process } = require("../System.js");
const ertum = require("../../../Global/Settings/Setup.json");
const ertucuk = require("../../../Global/Settings/System");
const guardSchema = require("../schemas/guardSchema")
const { roleGuard } = guardSchema.findOne({ guildId: ertucuk.ServerID });


const { BsonDatabase,JsonDatabase,YamlDatabase } = require("five.db");
const db = new JsonDatabase();

const client = new Client({
    intents: Object.keys(GatewayIntentBits),
    partials: Object.keys(Partials),    
});


/**
 * 
 *  @TODO       : [roleCreate, roleDelete, roleUpdate];
 *  @author     : {ERTU&CRANE};
 *  @complated  : [roleCreate, roleDelete, roleUpdate];
 *  @willbeadd  : [eris acilen kapanmalı!]
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


 client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
    const member = (await client.guilds.cache.get(oldMember.guild.id).fetchAuditLogs({ type: AuditLogEvent.MemberRoleUpdate, limit: 1 })).entries.first();    
    if(!member || member.executorId === client.user.id) return;
    if(!(await getGuardStatus("roleGuard"))) return //createEmbed(`${member.executor} bir üyenin rolünü güncelledi. Rol Guard kapalı olduğu için işlem yapmadım.`)
    if((await isWhiteListed(member.executorId))) return createEmbed(`
    ### ${member.executor} bir üyenin rolünü güncelledi, fakat güvenlide olduğu için işlem yapmadım.\n\n  Yetkili: <@${member.executorId}> \n İşlem Uygulanan Kişi: ${newMember.user} \`(${newMember.id})\`\n Tarih: <t:${Math.floor(Date.now() / 1000)}:F>`)
    if(newMember.roles.cache.find(x => x.permissions.has(PermissionFlagsBits.Administrator))) {
        punishMember(member.executor, null, null, Process.RoleAddRemove);
        newMember.roles.set(oldMember.roles.cache.map(r => r.id));
        createEmbed(`### Bir Üyenin Rolü Güncellendi! \n\n  Yetkili: <@${member.executorId}> \n İşlem Uygulanan Kişi: ${newMember.user} \`(${newMember.id})\`\n Tarih: <t:${Math.floor(Date.now() / 1000)}:F>`);
    }
});


 client.on(Events.GuildRoleDelete, async (role) => {
    const member = (await client.guilds.cache.get(role.guild.id).fetchAuditLogs({ type: AuditLogEvent.RoleDelete, limit: 1 })).entries.first();    
    if(!member || member.executorId === client.user.id) return;
    if(!(await getGuardStatus("roleGuard"))) return //createEmbed(`${member.executor} bir rolü sildi. Rol Guard kapalı olduğu için işlem yapmadım.`)
    if((await isWhiteListed(member.executorId))) return createEmbed(`
    ### ${member.executor} bir rol silme girişiminde bulundu, fakat güvenlide olduğu için işlem yapmadım.\n\n  Yetkili: <@${member.executorId}> \n Silinen Rol: ${role.name} \`(${role.id})\` \n Tarih: <t:${Math.floor(Date.now() / 1000)}:F>`)
    punishMember(member.executor, null, null, Process.RoleDelete);
    await role.guild.roles.create({
        name: role.name,
        color: role.color,
        hoist: role.hoist,
        permissions: role.permissions,
        position: role.position,
        mentionable: role.mentionable,
        reason: 'Ertu & Crane System | İzinsiz Rol Silme İşlemi!',
    })

    createEmbed(`### Bir üye bir rol silmeye çalıştı! \n\n  Yetkili: <@${member.executorId}> \n Silinen Rol: ${role.name} \`(${role.id})\` \n Tarih: <t:${Math.floor(Date.now() / 1000)}:F>`);
    return;
})

client.on(Events.GuildRoleCreate, async (role) => {
    const member = (await client.guilds.cache.get(role.guild.id).fetchAuditLogs({ type: AuditLogEvent.RoleCreate, limit: 1 })).entries.first();    
    if(!member || member.executorId === client.user.id) return;
    if(!(await getGuardStatus("roleGuard"))) return //createEmbed(`${member.executor} bir rol oluşturdu. Rol Guard kapalı olduğu için işlem yapmadım.`)
    if((await isWhiteListed(member.executorId))) return createEmbed(`
    ### ${member.executor} bir rol açma girişiminde bulundu, fakat güvenlide oldugu için işlem yapmadım. \n\n  Yetkili: <@${member.executorId}> \n Açılan Rol: ${role.name} \`(${role.id})\` \n Tarih: <t:${Math.floor(Date.now() / 1000)}:F>`)
    punishMember(member.executor, null, null, Process.RoleCreate);
    role.delete({ reason: `Ertu & Crane System | İzinsiz Rol Açma İşlemi!` })

    createEmbed(`### Bir üye bir rol açmaya çalıştı! \n\n  Yetkili: <@${member.executorId}> \n Açılan Rol: ${role.name} \`(${role.id})\` \n Tarih: <t:${Math.floor(Date.now() / 1000)}:F>`);
    return;
});


client.on(Events.GuildRoleUpdate, async (oldRole, newRole) => {
    const member = (await client.guilds.cache.get(oldRole.guild.id).fetchAuditLogs({ type: AuditLogEvent.RoleUpdate, limit: 1 })).entries.first();    
    if(!member || member.executorId === client.user.id) return;
    if(!(await getGuardStatus("roleGuard"))) return //createEmbed(`${member.executor} bir rol güncelledi. Rol Guard kapalı olduğu için işlem yapmadım.`)
    if((await isWhiteListed(member.executorId))) return createEmbed(`
    ### ${member.executor} bir rol düzenleme girişiminde bulundu, fakat güvenlide olduğu için işlem yapmadım. \n\n Yetkili: <@${member.executorId}> \n Rolün Eski İsmi: ${oldRole.name} \n Rolün Yeni İsmi: \n ${newRole.name} \n Tarih: <t:${Math.floor(Date.now() / 1000)}:F>`)
    punishMember(member.executor, null, null, Process.RoleUpdate);
    await newRole.edit({
        name: oldRole.name,
        color: oldRole.color,
        icon: oldRole.icon,
        permissions: oldRole.permissions,
        position: oldRole.position,
        hoist: oldRole.hoist
    })
    createEmbed(`### Bir üye bir rolü değiştirmeye çalıştı! \n\n Yetkili: <@${member.executorId}> \n Rolün Eski İsmi: ${oldRole.name} \n Rolün Yeni İsmi: \n ${newRole.name} \n Tarih: <t:${Math.floor(Date.now() / 1000)}:F>`);
    return;
});

async function punishMember(suclu, suclu2, magdur, ceza, sebep) {
    const guild = client.guilds.cache.get(ertucuk.ServerID);
    if(!suclu) return console.error(`HATA: Bir üye belirtmelisiniz!`);
    if(!ceza) return console.error(`HATA: Bir ceza türü belirtmelisiniz!`);
    if(!sebep) sebep = "Koruma Bot";
    suclu = guild.members.cache.get(suclu.id);

    if(ceza === "JAIL") {
        suclu.roles.cache.has(ertum.BoosterRole) ? suclu.roles.set([ertum.JailedRoles[0], ertum.BoosterRole]) : suclu.roles.set([ertum.JailedRoles[0]]);
        if(suclu2) suclu2.roles.cache.has(ertum.BoosterRole) ? suclu2.roles.set([ertum.JailedRoles[0], ertum.BoosterRole]) : suclu2.roles.set([ertum.JailedRoles[0]]);
        if(magdur) magdur.roles.cache.has(ertum.BoosterRole) ? magdur.roles.set([ertum.JailedRoles[0], ertum.BoosterRole]) : magdur.roles.set([ertum.JailedRoles[0]]);
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

client.login(ertucuk.Security.Guard_II).then(ertu => console.log(`Guard 2 Hazır!`)).catch(crane => console.error(`${crane.message} Bot aktif edilemedi!`))



