const moment = require('moment')
require('moment-duration-format')
moment.locale('tr')
const { EmbedBuilder } = require("discord.js");
module.exports = async (oldMember, newMember) => {
    const isimler = require("../schemas/names");
    if (oldMember.nickname === newMember.nickname) return;
    const entry = await newMember.guild.fetchAuditLogs({ limit: 1, type: 'MEMBER_UPDATE' }).then((audit) => audit.entries.first());
    if (!entry || Date.now() - entry.createdTimestamp > 5000) return;
    const executor = entry.executor;
    const member = entry.target;
    if (executor.bot) return;
    
        const Ertu = new EmbedBuilder()
        .setAuthor({ name: `${newMember.guild.name}`, iconURL: `${newMember.guild.iconURL({ dynamic: true })}` })
        .setTitle(`Sağ Tık İsim Değiştirildi!`)
        .setThumbnail(member.displayAvatarURL({ dynamic: true, size: 2048 }))
        .setColor("RANDOM")
        .setDescription(`
        ${executor}, ${member ? member : "Bilinmeyen Kullanıcı"} adlı kullanıcının adını değiştirdi.
        
        \` ➥ \` İsim Değişikliği: \` ${oldMember.nickname ? oldMember.nickname : oldMember.user.username} \` => **${newMember.nickname ? newMember.nickname : newMember.user.username}**
        \` ➥ \` Değiştiren Yetkili: \` ${executor.tag} \`
        \` ➥ \` Değiştirme Tarihi: <t:${Math.floor(Date.now() / 1000)}:R>
        `);

    if (newMember.guild.channels.cache.find(c => c.name === "name_log")) newMember.guild.channels.cache.find(c => c.name === "name_log").send({ embeds: [Ertu] });
    const registerData = await isimler.findOne({ guildID: newMember.guild.id, memberID: member.id });
    if (!registerData) new isimler({
        guildID: newMember.guild.id,
        memberID: member.id
    }).save().catch(() => { });
    await isimler.findOneAndUpdate({ guildID: newMember.guild.id, userID: newMember.id }, { $push: { names: { name: newMember.nickname || newMember.user.username, yetkili: executor.id, sebep: "Sağ-Tık İsim Değiştirme", date: Date.now() } } }, { upsert: true });
}; 
module.exports.conf = {
    name: "guildMemberUpdate"
};