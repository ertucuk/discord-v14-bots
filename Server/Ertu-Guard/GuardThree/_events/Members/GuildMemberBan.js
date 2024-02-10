const { Event } = require("../../../Structures/Default.Events");
const Guild = require("../../../../../Global/Settings/System")
const { Collection, EmbedBuilder, PermissionsBitField } = require('discord.js');
const GuardData = require("../../../Schemas/Guard")
const request = require('request');
const guardPenaltyDB = require("../../../Schemas/guardPenalty")

class GuildMemberBanAdd extends Event {
    constructor(client) {
        super(client, {
            name: "guildBanAdd",
            enabled: true,
        });    
    }    

 async   onLoad(ban) {
    if(ban.guild.id != Guild.ServerID) return;

    const guild = client.guilds.cache.get(Guild.ServerID)
    const Guard = await GuardData.findOne({guildID: guild.id})
    const banKickGuardonly = Guard ? Guard.banKickGuard : false;
    if(banKickGuardonly == true){
    let entry = await ban.guild.fetchAuditLogs({type: 22}).then(audit => audit.entries.first());
    if(entry.executor.id == guild.ownerId) return;
    const orusbuevladı = await guild.members.cache.get(entry.executor.id);
    const log = guild.channels.cache.find(x => x.name == "guard_log")
    const embed = new EmbedBuilder({
        title:"Server Ban Protection - Security III",
        footer:{text:`Server Security`, iconURL: client.user.avatarURL()}
    })
    if(!entry || !entry.executor || Date.now() - entry.createdTimestamp > 5000 ||  orusbuevladı.user.bot)return;
    if (await guvenli(orusbuevladı,"bankick") == true){
        await guardPenaltyDB.findOneAndUpdate({guildID:guild.id,OrusbuEvladı:orusbuevladı.id},{$push:{işlemler:{Güvenilir:true,işlem:`Yasaklama! (${ban.user.tag})`,Tarih:Date.now()}}},{upsert:true})
        if(log) return log.send({embeds:[embed.setAuthor({name:`Trustworthy ✅`, iconURL:guild.iconURL()}).setDescription(`${orusbuevladı}, \`${new Date(Date.now()).toTurkishFormatDate()}\` tarihinde **${ban.user.tag}** kullanıcısını "Sağ-Tık" kullanarak sunucudan yasakladı.`)]})
    }
    await ytkapa(Guild.ServerID)
    await sik(guild,orusbuevladı.id,"am")
    await guild.members.unban(ban.user.id)
    if(log) return log.send({embeds:[embed.setAuthor({name:`Trustworthy ✅`, iconURL:guild.iconURL()}).setDescription(`${orusbuevladı}, \`${new Date(Date.now()).toTurkishFormatDate()}\` tarihinde **${ban.user.tag}** kullanıcısını "Sağ-Tık" kullanarak sunucudan yasakladığı için kendisini yasakladım, sunucuda ki üst düzey yetkileri kapattım ve yasakladığı kişinin yasağını kaldırdım.`)]})
    }
 }
}
module.exports = GuildMemberBanAdd;