const { Client, GatewayIntentBits, Partials, Collection, EmbedBuilder,PermissionsBitField,Intents, ActivityType } = require('discord.js');
const moment = global.moment = require('moment');
require("moment-duration-format");
require("moment-timezone");
const Guild = require('../../../Global/Settings/System');
const Distributors = global.Distributors = [];
const query = require("./Distributors")
const GUILD_ROLES = require("../Schemas/Backup/Guild.Roles");
const GUILD_CATEGORY = require("../Schemas/Backup/Guild.Category.Channels");
const GUILD_TEXT = require("../Schemas/Backup/Guild.Text.Channels");
const GUILD_VOICE = require("../Schemas/Backup/Guild.Voice.Channels");
const rolePermissions = require('../Schemas/rolePermissions');
const voice = global.voice = require("@discordjs/voice")
const guard = require("../Schemas/Guard");


let aylartoplam = { "01": "Ocak", "02": "Şubat", "03": "Mart", "04": "Nisan", "05": "Mayıs", "06": "Haziran", "07": "Temmuz", "08": "Ağustos", "09": "Eylül", "10": "Ekim", "11": "Kasım", "12": "Aralık" };
global.aylar = aylartoplam;

const guvenli = global.guvenli = async function(member,type){
  const guardData = await guard.findOne({guildID:Guild.ServerID});
  const whitelistFull = guardData ? guardData.SafedMembers : Guild.BotsOwners;
  const whitelistServer = guardData ? guardData.serverSafedMembers : Guild.BotsOwners;
  const whitelistRole = guardData ? guardData.roleSafedMembers : Guild.BotsOwners;
  const whitelistChannel = guardData ? guardData.channelSafedMembers : Guild.BotsOwners;
  const whitelistBanKick = guardData ? guardData.banKickSafedMembers : Guild.BotsOwners;
  const whitelistEmojiSticker = guardData ? guardData.banKickSafedMembers : Guild.BotsOwners;
  if(type == "full"){
    if(whitelistFull.some(id=> member.id === id) || Guild.BotsOwners.some(x=> member.id === x)){ return true}else return false
  }
  if(type == "server"){
  if(whitelistFull.some(id=> member.id === id) || whitelistServer.some(id=> member.id === id) || Guild.BotsOwners.some(x=> member.id === x)) {return true}else return false
  }
  if(type == "role"){
    if(whitelistFull.some(id=> member.id === id) || whitelistRole.some(id=> member.id === id) || Guild.BotsOwners.some(x=> member.id === x)) {return true}else return false
  }
  if(type == "channel"){
    if(whitelistFull.some(id=> member.id === id) || whitelistChannel.some(id=> member.id === id) || Guild.BotsOwners.some(x=> member.id === x)) {return true}else return false
  }
  if(type == "bankick"){
    if(whitelistFull.some(id=> member.id === id) || whitelistBanKick.some(id=> member.id === id) || Guild.BotsOwners.some(x=> member.id === x)) {return true}else return false
  }
  if(type == "emojisticker"){
    if(whitelistFull.some(id=> member.id === id) || whitelistEmojiSticker.some(id=> member.id === id) || Guild.BotsOwners.some(x=> member.id === x)) {return true}else return false
  }
}

const ytkapa = global.ytkapa = async function(guildID) {
    let sunucu = client.guilds.cache.get(guildID);
    if (!sunucu) return;
    sunucu.roles.cache.filter(r => r.editable && (r.permissions.has(PermissionsBitField.Flags.Administrator) || r.permissions.has(PermissionsBitField.Flags.ManageGuild) || r.permissions.has(PermissionsBitField.Flags.ManageRoles) || r.permissions.has(PermissionsBitField.Flags.ManageWebhooks) || r.permissions.has(PermissionsBitField.Flags.BanMembers) || r.permissions.has(PermissionsBitField.Flags.KickMembers)|| r.permissions.has(PermissionsBitField.Flags.ModerateMembers))).forEach(async r => {
      await rolePermissions.findOneAndUpdate({roleID:r.id},{$set:{BitField:new PermissionsBitField(r.permissions.bitfield)}},{upsert:true})
      await r.setPermissions(PermissionsBitField.Flags.SendMessages);
    });
  }
  const ytçek = global.ytçek = async function(member){
    let roller = await member.roles.cache.filter(r => r.permissions.has(PermissionsBitField.Flags.Administrator) || r.permissions.has(PermissionsBitField.Flags.ManageGuild) || r.permissions.has(PermissionsBitField.Flags.ManageRoles) || r.permissions.has(PermissionsBitField.Flags.ManageWebhooks) || r.permissions.has(PermissionsBitField.Flags.BanMembers) || r.permissions.has(PermissionsBitField.Flags.KickMembers)|| r.permissions.has(PermissionsBitField.Flags.ModerateMembers)).map(z=> z.id)
    await member.roles.remove(roller)
  }
  const sik = global.sik = async function(guild,kisiID, tur) {
    let uye = guild.members.cache.get(kisiID);
    if (!uye) return;
    if (tur == "am") return guild.members.ban(uye.id,{ reason: "Ertu Server Security" }).catch(err=> console.log(`${uye.user.tag} kişisini yetkim yetmediği için banlıyamadım.`));
  };
  const guildChannels = global.guildChannels = async function(guild) {
    if (guild) {
        const channels = []
        await guild.channels.cache.forEach(ch => {
            channels.push(ch)
        })
        for (let index = 0; index < channels.length; index++) {
            const channel = channels[index];
            let ChannelPermissions = []
            channel.permissionOverwrites.cache.forEach(perm => {
                ChannelPermissions.push({ id: perm.id, type: perm.type, allow: "" + perm.allow.bitfield, deny: "" + perm.deny.bitfield })
            });
            if ((channel.type === 0) || (channel.type === 5)) {
                await GUILD_TEXT.findOne({ channelID: channel.id }, async (err, kanalYedek) => {
                    if (!kanalYedek) {
                        const newData = new GUILD_TEXT({
                            type:0,
                            channelID: channel.id,
                            name: channel.name,
                            nsfw: channel.nsfw,
                            parentID: channel.parentId,
                            position: channel.position,
                            rateLimit: channel.rateLimitPerUser,
                            overwrites: ChannelPermissions,
                        });
                        await newData.save();
                    } else {
                        kanalYedek.name = channel.name,
                            kanalYedek.nsfw = channel.nsfw,
                            kanalYedek.parentID = channel.parentId,
                            kanalYedek.position = channel.position,
                            kanalYedek.rateLimit = channel.rateLimitPerUser,
                            kanalYedek.overwrites = ChannelPermissions
                        kanalYedek.save();
                    };
                }).catch(err => {});;
            }
            if (channel.type === 2) {
                await GUILD_VOICE.findOne({ channelID: channel.id }, async (err, kanalYedek) => {
                    if (!kanalYedek) {
                        const newData = new GUILD_VOICE({
                            type:2,
                            channelID: channel.id,
                            name: channel.name,
                            bitrate: channel.bitrate,
                            parentID: channel.parentId,
                            position: channel.position,
                            userLimit: channel.userLimit ? channel.userLimit : 0 ,
                            overwrites: ChannelPermissions,
                        });
                        await newData.save();
                    } else {
                        kanalYedek.name = channel.name,
                            kanalYedek.bitrate = channel.bitrate,
                            kanalYedek.parentID = channel.parentId,
                            kanalYedek.position = channel.position,
                            kanalYedek.userLimit = channel.userLimit ? channel.userLimit : 0,
                            kanalYedek.overwrites = ChannelPermissions
                        kanalYedek.save();
                    };
                }).catch(err => {});
            }
            if (channel.type === 4) {
                await GUILD_CATEGORY.findOne({ channelID: channel.id }, async (err, kanalYedek) => {
                    if (!kanalYedek) {
                        const newData = new GUILD_CATEGORY({
                            channelID: channel.id,
                            name: channel.name,
                            position: channel.position,
                            overwrites: ChannelPermissions,
                        });
                        await newData.save();
                    } else {
                        kanalYedek.name = channel.name,
                            kanalYedek.position = channel.position,
                            kanalYedek.overwrites = ChannelPermissions
                        kanalYedek.save();
                    };
                }).catch(err => {});;
            }
        }
        await console.log(`${tarihsel(Date.now())} tarihinde Kanal güncelleme işlemleri tamamlandı.`);
    }
  }
  const guildRoles = global.guildRoles = async function(guild) {
    const roles = [] 
    await guild.roles.cache.filter(r => r.name !== "@everyone").forEach(rol => {
        roles.push(rol)
    })
    
    for (let index = 0; index < roles.length; index++) {
        const role = roles[index];
        let Overwrites = [];
        await guild.channels.cache.filter(channel => channel.permissionOverwrites.cache.has(role.id)).forEach(channel => {
            let channelPerm = channel.permissionOverwrites.cache.get(role.id);
            let perms = { id: channel.id, allow: channelPerm.allow.toArray(), deny: channelPerm.deny.toArray() };
            Overwrites.push(perms);
        });
        await GUILD_ROLES.findOne({ roleID: role.id }, async (err, data) => {
            if (!data) {
                const newData = new GUILD_ROLES({
                    roleID: role.id,
                    name: role.name,
                    color: role.hexColor,
                    hoist: role.hoist,
                    position: role.position,
                    permissions: role.permissions.bitfield,
                    mentionable: role.mentionable,
                    date: Date.now(),
                    members: role.members.map(m => m.id),
                    channelOverwrites: Overwrites
                });
                newData.save();
            } else {
                data.name = role.name;
                data.color = role.hexColor;
                data.hoist = role.hoist;
                data.position = role.position;
                data.permissions = role.permissions.bitfield;
                data.mentionable = role.mentionable;
                data.date = Date.now();
                data.members = role.members.map(m => m.id);
                data.channelOverwrites = Overwrites;
                data.save();
            };
        }).catch(err => {});
    }
    await GUILD_ROLES.find({}, (err, roles) => {
        roles.filter(r => !guild.roles.cache.has(r.roleID) && Date.now() - r.date > 1000 * 60 * 60 * 24 * 3).forEach(r => {
            r.remove()
        });
    }).catch(err => {})
    await console.log(`${tarihsel(Date.now())} tarihinde Rol güncelleme işlemleri tamamlandı.`);
  };
  const rolKur = global.rolKur = async function(role, newRole) {
    await dataCheck(role,newRole.id,"role")
   await GUILD_ROLES.findOne({ roleID: role }, async (err, data) => {
      let length = (data.members.length + 5);
      const sayı = Math.floor(length / Distributors.length);
      if (sayı < 1) sayı = 1;
      const channelPerm = data.channelOverwrites.filter(e => newRole.guild.channels.cache.get(e.id))
      
      for await (const perm of channelPerm) {
        const guild = bott.guilds.cache.get(Guild.ServerID)
        const bott = Distributors[1]
        let kanal = guild.channels.cache.get(perm.id);
        let newPerm = {};
        perm.allow.forEach(p => {
          newPerm[p] = true;
        });
        perm.deny.forEach(p => {
          newPerm[p] = false;
        });
        kanal.permissionOverwrites.create(newRole, newPerm).catch(error => console.log(error));
      }
      for (let index = 0; index < Distributors.length; index++) {
        const bot = Distributors[index];
        const guild = bot.guilds.cache.get(Guild.ServerID)
        if (newRole.deleted) {
         console.log(`[${role}] - ${bot.user.tag} - Rol Silindi Dağıtım İptal`);
          break;
        }
        const members = data.members.filter(e => guild.members.cache.get(e) && !guild.members.cache.get(e).roles.cache.has(newRole.id)).slice((index * sayı), ((index + 1) * sayı));
        console.log(members)
        if (members.length <= 0) {
         console.log(`[${role}] Olayında kayıtlı üye olmadığından veya rol üyelerine dağıtıldığından dolayı rol dağıtımı gerçekleştirmedim.`);
          break;
        }
        for await (const user of members) {
          const member = guild.members.cache.get(user)
          member.roles.add(newRole.id)
        }
      }
      const newData = new GUILD_ROLES({
        roleID: newRole.id,
        name: newRole.name,
        color: newRole.hexColor,
        hoist: newRole.hoist,
        position: newRole.position,
        permissions: newRole.permissions.bitfield,
        mentionable: newRole.mentionable,
        time: Date.now(),
        members: data.members.filter(e => newRole.guild.members.cache.get(e)),
        channelOverwrites: data.channelOverwrites.filter(e => newRole.guild.channels.cache.get(e.id))
      });
      newData.save();
    }).catch(err => { })
  }
  const rolVer = global.rolVer = async function(sunucu, role) {
    let length = (sunucu.members.cache.filter(member => member && !member.roles.cache.has(role.id) && !member.user.bot).array().length + 5);
    const sayı = Math.floor(length / Distributors.length);
    for (let index = 0; index < Distributors.length; index++) {
      const bot = Distributors[index];
      if (role.deleted) {
        client.logger.log(`[${role.id}] - ${bot.user.tag}`);
        break;
      }
      const members = bot.guilds.cache.get(sunucu.id).members.cache.filter(member => !member.roles.cache.has(role.id) && !member.user.bot).array().slice((index * sayı), ((index + 1) * sayı));
      if (members.length <= 0) return;
      for (const member of members) {
        member.roles.add(role.id)
      }
    }
  }
  const startDistributors = global.startDistributors = async function() {
    console.log('Başlatma fonksiyonu tetiklendi.')
  require("../../../Global/Settings/System").Security.Dis.forEach(async (token) => {
        let botClient = new Client({ 
          intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences],
          presence: {
            activities: [{
              name: 'sa xd',
              type: ActivityType.Playing
            }],
            status: 'online'
          }
        });
          
        botClient.on("ready", (client) => {
            console.log(`${botClient.user.tag} isimli dağıtıcı başarıyla aktif oldu.`)
            botClient.queryTasks = new query();
            botClient.queryTasks.init(1000);
            Distributors.push(botClient)
            
            for (let index = 0; index < Distributors.length; index++) {
              const welcome = Distributors[index];
              welcome.on("ready", async ()=> {
                const guild = welcome.guilds.cache.get(require("../../../Global/Settings/System").ServerID)
                const channel = guild.channels.cache.get(require("../../../Global/Settings/System"))
              new voice.joinVoiceChannel({
                    channelId: Guild.BotVoiceChannel,
                    guildId: Guild.ServerID,
                    adapterCreator: channel.guild.voiceAdapterCreator,
                  });
              })
            }
          })
          await botClient.login(token).catch(err => {
            console.log(`Dağıtıcı Token Arızası`)
          })
    })
  }

  module.exports = {
    startDistributors
  }

  const closeDistributors = global.closeDistributors= async function() { 
    if(Distributors && Distributors.length) {
        if(Distributors.length >= 1) {
            Distributors.forEach(x => {
                x.destroy()
            })
        }
    }
  }
  const tarihsel = global.tarihsel = function(tarih) {
    let tarihci = moment(tarih).tz("Europe/Istanbul").format("DD") + " " + global.aylar[moment(tarih).tz("Europe/Istanbul").format("MM")] + " " + moment(tarih).tz("Europe/Istanbul").format("YYYY")   
    return tarihci;
};

