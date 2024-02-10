const { Event } = require("../../../Structures/Default.Events");
const Guild = require("../../../../../Global/Settings/System")
const { Collection, EmbedBuilder, PermissionsBitField } = require('discord.js');
const GuardData = require("../../../Schemas/Guard")
const guardPenaltyDB = require("../../../Schemas/guardPenalty")

class channelCreate extends Event {
    constructor(client) {
        super(client, {
            name: "channelCreate",
            enabled: true,
        });    
    }    

 async  onLoad(Channel) {
    if(Channel.guild.id != Guild.ServerID) return;
    const guild = client.guilds.cache.get(Guild.ServerID)
    const Guard = await GuardData.findOne({guildID: guild.id})
    const channelguardonly = Guard ? Guard.channelsGuard : false;
    if(channelguardonly == true){
        let entry = await guild.fetchAuditLogs({type: 10}).then(audit => audit.entries.first());
        if(entry.executor.id == guild.ownerId) return;
    
        const orusbuevladı = await guild.members.cache.get(entry.executor.id);
        const log = guild.channels.cache.find(x => x.name == "guard_log")
        const embed = new EmbedBuilder({
            title:"Server Channel Protection - Security II",
            footer:{text:`Server Security`, iconURL: client.user.avatarURL()}
        })
        if(!entry || !entry.executor || Date.now() - entry.createdTimestamp > 5000 ||  orusbuevladı.user.bot)return;
        if (await guvenli(orusbuevladı,"channel") == true){
            await guardPenaltyDB.findOneAndUpdate({guildID:guild.id,OrusbuEvladı:orusbuevladı.id},{$push:{işlemler:{Güvenilir:true,işlem:`Kanal Oluşturma`,Tarih:Date.now()}}},{upsert:true})
            if(log) return log.send({embeds:[embed.setAuthor({name:`Trustworthy ✅`, iconURL:guild.iconURL()}).setDescription(`${orusbuevladı}, \`${new Date(Date.now()).toTurkishFormatDate()}\` tarihinde **${Channel.name} - ${channel.id}** isimli kanalı oluşturdu.`)]})
        }
        await ytkapa(Guild.ServerID)
        await sik(guild,orusbuevladı.id,"am")
        await Channel.delete()
        if(log) return log.send({embeds:[embed.setAuthor({name:`Not safe ❎`, iconURL:guild.iconURL()}).setDescription(`${orusbuevladı}, \`${new Date(Date.now()).toTurkishFormatDate()}\` tarihinde **${Channel.name} - ${channel.id}** isimli kanalı oluşturdu için rolleri alındı ve kanal sunucudan silindi.`)]})
    
    }

 }
}

module.exports = channelCreate;