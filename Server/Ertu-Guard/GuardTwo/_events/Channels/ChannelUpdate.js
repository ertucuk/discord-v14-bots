const { Event } = require("../../../Structures/Default.Events");
const Guild = require("../../../../../Global/Settings/System")
const { Collection, EmbedBuilder, PermissionsBitField } = require('discord.js');
const GuardData = require("../../../Schemas/Guard")
const request = require('request');
const TextChannels = require("../../../Schemas/Backup/Guild.Text.Channels");
const VoiceChannels = require("../../../Schemas/Backup/Guild.Voice.Channels");
const guardPenaltyDB = require("../../../Schemas/guardPenalty")

class channelUpdate extends Event {
    constructor(client) {
        super(client, {
            name: "channelUpdate",
            enabled: true,
        });    
    }    

 async  onLoad(oldChannel, newChannel) {
    if(oldChannel.guild.id != Guild.ServerID) return;
    const guild = client.guilds.cache.get(Guild.ServerID)
    const Guard = await GuardData.findOne({guildID: guild.id})
    const channelguardonly = Guard ? Guard.channelsGuard : false;
    if(channelguardonly == true){
    let entry = await guild.fetchAuditLogs({type: 11}).then(audit => audit.entries.first());
    if(entry.executor.id == guild.ownerId) return;

    const orusbuevladı = await guild.members.cache.get(entry.executor.id);
    const log = guild.channels.cache.find(x => x.name == "guard_log")
    const embed = new EmbedBuilder({
        title:"Server Channel Protection - Security II",
        footer:{text:`Server Security`, iconURL: client.user.avatarURL()}
    })
    if(!entry || !entry.executor || Date.now() - entry.createdTimestamp > 5000 || orusbuevladı.user.bot)return;
    if (await guvenli(orusbuevladı,"channel") == true){
      if(oldChannel.name != newChannel.name){
    await guardPenaltyDB.findOneAndUpdate({guildID:guild.id,OrusbuEvladı:orusbuevladı.id},{$push:{işlemler:{Güvenilir:true,işlem:`Kanal Güncelleme (İsmi)`,Tarih:Date.now()}}},{upsert:true})
      if(log) return log.send({embeds:[embed.setAuthor({name:`Trustworthy ✅`, iconURL:guild.iconURL()}).setDescription(`${orusbuevladı}, \`${new Date(Date.now()).toTurkishFormatDate()}\` tarihinde **${oldChannel.name} - ${oldChannel.id}** isimli kanalı **${newChannel.name}** olarak değiştirdi.`)]})
    } 
    if(oldChannel.parentId != newChannel.parentId){
      await guardPenaltyDB.findOneAndUpdate({guildID:guild.id,OrusbuEvladı:orusbuevladı.id},{$push:{işlemler:{Güvenilir:true,işlem:`Kanal Güncelleme (Kategori Değiştirildi)`,Tarih:Date.now()}}},{upsert:true})
        if(log) return log.send({embeds:[embed.setAuthor({name:`Trustworthy ✅`, iconURL:guild.iconURL()}).setDescription(`${orusbuevladı}, \`${new Date(Date.now()).toTurkishFormatDate()}\` tarihinde **${oldChannel.name} - ${oldChannel.id}** kanalını \`${newChannel.guild.channels.cache.get(newChannel.parentId).name}\` kategorisine taşıdı.`)]})
      }
    if(newChannel.type == 2 && (oldChannel.userLimit != newChannel.userLimit)){
      await guardPenaltyDB.findOneAndUpdate({guildID:guild.id,OrusbuEvladı:orusbuevladı.id},{$push:{işlemler:{Güvenilir:true,işlem:`Kanal Güncelleme (Limit)`,Tarih:Date.now()}}},{upsert:true})
      if(log) return log.send({embeds:[embed.setAuthor({name:`Trustworthy ✅`, iconURL:guild.iconURL()}).setDescription(`${orusbuevladı}, \`${new Date(Date.now()).toTurkishFormatDate()}\` tarihinde **${oldChannel.name} - ${oldChannel.id}** kanalının limiti \`${newChannel.userLimit}\` olarak değiştirildi.`)]})
    } 
    if((newChannel.type === 0 || (newChannel.type === 5)) && (oldChannel.topic != newChannel.topic)){
      await guardPenaltyDB.findOneAndUpdate({guildID:guild.id,OrusbuEvladı:orusbuevladı.id},{$push:{işlemler:{Güvenilir:true,işlem:`Kanal Güncelleme (Açıklama)`,Tarih:Date.now()}}},{upsert:true})
      if(log) return log.send({embeds:[embed.setAuthor({name:`Trustworthy ✅`, iconURL:guild.iconURL()}).setDescription(`${orusbuevladı}, \`${new Date(Date.now()).toTurkishFormatDate()}\` tarihinde **${oldChannel.name} - ${oldChannel.id}** kanal açıklaması \`${newChannel.topic}\` olarak değiştirildi.`)]})
    }
    await guardPenaltyDB.findOneAndUpdate({guildID:guild.id,OrusbuEvladı:orusbuevladı.id},{$push:{işlemler:{Güvenilir:true,işlem:`Kanal Güncelleme`,Tarih:Date.now()}}},{upsert:true})
    if(log) return log.send({embeds:[embed.setAuthor({name:`Trustworthy ✅`, iconURL:guild.iconURL()}).setDescription(`${orusbuevladı}, \`${new Date(Date.now()).toTurkishFormatDate()}\` tarihinde **${oldChannel.name} - ${oldChannel.id}** isimi kanal güncellendi!`)]})

  }
      await ytkapa(Guild.ServerID)
      await ytçek(orusbuevladı)
    if (newChannel.type !== 4 && newChannel.parentId !== oldChannel.parentId) newChannel.setParent(oldChannel.parentId);
    if (newChannel.type === 4) {
      await newChannel.edit({
        position: oldChannel.position,
        name: oldChannel.name,
      });
    } else if (newChannel.type === 0 || (newChannel.type === 5)) {
      await newChannel.edit({
        name: oldChannel.name,
        position: oldChannel.position,
        topic: oldChannel.topic,
        nsfw: oldChannel.nsfw,
        rateLimitPerUser: oldChannel.rateLimitPerUser,
      });
    } else if (newChannel.type === 2) {
      await newChannel.edit({
        name: oldChannel.name,
        position: oldChannel.position,
        bitrate: oldChannel.bitrate,
        userLimit: oldChannel.userLimit,
      });
    };
 
    if(log) return log.send({embeds:[embed.setAuthor({name:`Not safe ❎`, iconURL:guild.iconURL()}).setDescription(`${orusbuevladı}, \`${new Date(Date.now()).toTurkishFormatDate()}\` tarihinde **${oldChannel.name}** isimli kanalı güncellediği için rolleri alındı ve kanal eski haline getirildi. silindi.`)]})
  }
 }
}

module.exports = channelUpdate;