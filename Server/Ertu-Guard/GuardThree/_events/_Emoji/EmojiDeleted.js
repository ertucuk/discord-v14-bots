const { Event } = require("../../../Structures/Default.Events");
const Guild = require("../../../../../Global/Settings/System")
const { Collection, EmbedBuilder, PermissionsBitField } = require('discord.js');
const GuardData = require("../../../Schemas/Guard")
const request = require('request');
const guardPenaltyDB = require("../../../Schemas/guardPenalty")
class emojiDelete extends Event {
    constructor(client) {
        super(client, {
            name: "emojiDelete",
            enabled: true,
        });    
    }    

 async  onLoad(emoji) {
    if(emoji.guild.id != Guild.ServerID) return;
    const guild = client.guilds.cache.get(Guild.ServerID)
    const Guard = await GuardData.findOne({guildID: guild.id})
    const emojiStickersGuardonly = Guard ? Guard.emojiStickersGuard : false;
    if(emojiStickersGuardonly == true){
    let entry = await guild.fetchAuditLogs({type: 62}).then(audit => audit.entries.first());
    if(entry.executor.id == guild.ownerId) return;

    const orusbuevladı = await guild.members.cache.get(entry.executor.id);
    const log = guild.channels.cache.find(x => x.name == "guard_log")
    const embed = new EmbedBuilder({
        title:"Server Emojis Protection - Security II",
        footer:{text:`Server Security`, iconURL: client.user.avatarURL()}
    })
    if(!entry || !entry.executor || Date.now() - entry.createdTimestamp > 5000 ||orusbuevladı.user.bot)return;
    if (await guvenli(orusbuevladı,"emojisticker") == true){
        await guardPenaltyDB.findOneAndUpdate({guildID:guild.id,OrusbuEvladı:orusbuevladı.id},{$push:{işlemler:{Güvenilir:true,işlem:`Emoji Sildi (${emoji.name})`,Tarih:Date.now()}}},{upsert:true})

        if(log) return log.send({embeds:[embed.setAuthor({name:`Trustworthy ✅`, iconURL:guild.iconURL()}).setDescription(`${orusbuevladı}, \`${new Date(Date.now()).toTurkishFormatDate()}\` tarihinde **${emoji.name}** isimli emojiyi sildi.`)]})
    }
    await ytçek(orusbuevladı)
    await guild.emojis.create({attachment:emoji.url, name:emoji.name})
    await guardPenaltyDB.findOneAndUpdate({guildID:guild.id,OrusbuEvladı:orusbuevladı.id},{$push:{işlemler:{Güvenilir:false,işlem:`Emoji Sildi (${emoji.name})`,Tarih:Date.now()}}},{upsert:true})

    if(log) return log.send({embeds:[embed.setAuthor({name:`Not safe ❎`, iconURL:guild.iconURL()}).setDescription(`${orusbuevladı}, \`${new Date(Date.now()).toTurkishFormatDate()}\` tarihinde **${emoji.name}** isimli emojiyi sildiği için rolleri alındı ve emoji yeniden sunucuya eklendi..`)]})
    }
 }
}

module.exports = emojiDelete;