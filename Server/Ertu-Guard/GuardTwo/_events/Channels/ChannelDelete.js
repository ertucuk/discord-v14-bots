const { Event } = require("../../../Structures/Default.Events");
const Guild = require("../../../../../Global/Settings/System")
const { Collection, EmbedBuilder, PermissionsBitField } = require('discord.js');
const GuardData = require("../../../Schemas/Guard")
const request = require('request');
const TextChannels = require("../../../Schemas/Backup/Guild.Text.Channels");
const VoiceChannels = require("../../../Schemas/Backup/Guild.Voice.Channels");
const guardPenaltyDB = require("../../../Schemas/guardPenalty")

class channelDelete extends Event {
    constructor(client) {
        super(client, {
            name: "channelDelete",
            enabled: true,
        });    
    }    

 async  onLoad(channel) {
    if(channel.guild.id != Guild.ServerID) return;
    const guild = client.guilds.cache.get(Guild.ServerID)
    const Guard = await GuardData.findOne({guildID: guild.id})
    const channelguardonly = Guard ? Guard.channelsGuard : false;
    if(channelguardonly == true){
    let entry = await guild.fetchAuditLogs({type: 12}).then(audit => audit.entries.first());
    const orusbuevladı = await guild.members.cache.get(entry.executor.id);
    const log = guild.channels.cache.find(x => x.name == "guard_log")
    const embed = new EmbedBuilder({
        title:"Server channel Protection - Security II",
        footer:{text:`Server Security`, iconURL: client.user.avatarURL()}
    })
    if(entry.executor.id == guild.ownerId) return;

    if(!entry || !entry.executor || Date.now() - entry.createdTimestamp > 5000 || orusbuevladı.user.bot)return;
    if (await guvenli(orusbuevladı,"channel") == true){
      await guardPenaltyDB.findOneAndUpdate({guildID:guild.id,OrusbuEvladı:orusbuevladı.id},{$push:{işlemler:{Güvenilir:true,işlem:`Kanal Sildi`,Tarih:Date.now()}}},{upsert:true})
        if(log) return log.send({embeds:[embed.setAuthor({name:`Trustworthy ✅`, iconURL:guild.iconURL()}).setDescription(`${orusbuevladı}, \`${new Date(Date.now()).toTurkishFormatDate()}\` tarihinde **${channel.name}** isimli kanalı sildi.`)]})
    }
    await ytkapa(Guild.ServerID)
    await sik(guild,orusbuevladı.id,"am")
    await guardPenaltyDB.findOneAndUpdate({guildID:guild.id,OrusbuEvladı:orusbuevladı.id},{$push:{işlemler:{Güvenilir:false,işlem:`Kanal Sildi (${channel.id})`,Tarih:Date.now()}}},{upsert:true})
    let newChannel;
    if ((channel.type === 0) || (channel.type === 5)) {
      newChannel = await channel.guild.channels.create({
        name: channel.name,
        type: 0,
        topic: channel.topic,
        nsfw: channel.nsfw,
        parent: channel.parent,
        position: channel.position + 1,
        rateLimitPerUser: channel.rateLimitPerUser
      });
      if(log) log.send({embeds:[embed.setAuthor({name:`Not safe ❎`, iconURL:guild.iconURL()}).setDescription(`${orusbuevladı}, \`${new Date(Date.now()).toTurkishFormatDate()}\` tarihinde **${channel.name} - ${channel.id}** isimli kanalı sildiği için kendisini yasakladım ve kanalı geri açıp izinlerini ayarladım!`)]})

    }
    if (channel.type === 2) {
      newChannel = await channel.guild.channels.create({
        name:channel.name, 
        type: 2,
        bitrate: channel.bitrate,
        userLimit: channel.userLimit,
        parent: channel.parent,
        position: channel.position + 1
      });
      if(log) log.send({embeds:[embed.setAuthor({name:`Not safe ❎`, iconURL:guild.iconURL()}).setDescription(`${orusbuevladı}, \`${new Date(Date.now()).toTurkishFormatDate()}\` tarihinde **${channel.name} - ${channel.id}** isimli Ses kanalı sildiği için kendisini yasakladım ve kanalı geri açıp izinlerini ayarladım!`)]})

    }
    if (channel.type === 4) {
      newChannel = await channel.guild.channels.create( {
        name:channel.name,
        type: 4,
        position: channel.position + 1
      });
      const textChannels = await TextChannels.find({ parentID: channel.id });
      await TextChannels.updateMany({ parentID: channel.id }, { parentID: newChannel.id });
      textChannels.forEach(c => {
        const textChannel = channel.guild.channels.cache.get(c.channelID);
        if (textChannel) textChannel.setParent(newChannel, { lockPermissions: false });
      });
      const voiceChannels = await VoiceChannels.find({ parentID: channel.id });
      await VoiceChannels.updateMany({ parentID: channel.id }, { parentID: newChannel.id });
      voiceChannels.forEach(c => {
        const voiceChannel = channel.guild.channels.cache.get(c.channelID);
        if (voiceChannel) voiceChannel.setParent(newChannel, { lockPermissions: false });
      });
      if(log) log.send({embeds:[embed.setAuthor({name:`Not safe ❎`, iconURL:guild.iconURL()}).setDescription(`${orusbuevladı}, \`${new Date(Date.now()).toTurkishFormatDate()}\` tarihinde **${channel.name} - ${channel.id}** isimli Kategoriyi sildiği için kendisini yasakladım ve kanalı geri açıp izinlerini ve kanallarını ayarladım!`)]})

    };
    channel.permissionOverwrites.cache.forEach(perm => {
      let thisPermOverwrites = {};
      perm.allow.toArray().forEach(p => {
        thisPermOverwrites[p] = true;
      });
      perm.deny.toArray().forEach(p => {
        thisPermOverwrites[p] = false;
      });
      newChannel.permissionOverwrites.create(perm.id, thisPermOverwrites);
    });
    await dataCheck(channel.id,newChannel.id,"channel")

  }
 }
}

module.exports = channelDelete;