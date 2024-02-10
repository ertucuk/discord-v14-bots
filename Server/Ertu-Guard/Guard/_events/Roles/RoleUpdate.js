const { Event } = require("../../../Structures/Default.Events");
const Guild = require("../../../../../Global/Settings/System")
const { Collection, EmbedBuilder, PermissionsBitField } = require('discord.js');
const GuardData = require("../../../Schemas/Guard")
const request = require('request');
const permissionStaff = [PermissionsBitField.Flags.Administrator, PermissionsBitField.Flags.ManageRoles, PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ManageGuild, PermissionsBitField.Flags.BanMembers, PermissionsBitField.Flags.KickMembers, PermissionsBitField.Flags.ManageNicknames, PermissionsBitField.Flags.ManageEmojisAndStickers, PermissionsBitField.Flags.ManageWebhooks];
class roleCreate extends Event {
    constructor(client) {
        super(client, {
            name: "roleUpdate",
            enabled: true,
        });    
    }    

 async  onLoad(oldRole, newRole) {
    if(oldRole.guild.id != Guild.ServerID) return;
    const guild = client.guilds.cache.get(Guild.ServerID)
    const Guard = await GuardData.findOne({guildID: guild.id})
    const rolesGuardonly = Guard ? Guard.rolesGuard : false;
    if(rolesGuardonly == true){
    let entry = await guild.fetchAuditLogs({type: 31}).then(audit => audit.entries.first());
    if(entry.executor.id == guild.ownerId) return;

    const orusbuevladı = await guild.members.cache.get(entry.executor.id);
    var güvenliSalaklar = Guard ? Guard.roleSafedMembers : ["852800814808694814"]
    const log = guild.channels.cache.find(x => x.name == "guard_log")
    const embed = new EmbedBuilder({
        title:"Server Roles Protection - Security I",
        footer:{text:`Server Security`, iconURL: client.user.avatarURL()}
    })
    if(!entry || !entry.executor ||Date.now() - entry.createdTimestamp > 5000 ||  orusbuevladı.user.bot)return;
    if (await guvenli(orusbuevladı,"role") == true){
        if(log) return log.send({embeds:[embed.setAuthor({name:`Trustworthy ✅`, iconURL:guild.iconURL()}).setDescription(`${orusbuevladı}, \`${new Date(Date.now()).toTurkishFormatDate()}\` tarihinde **${oldRole.name} - ${oldRole.id}**  isimli rolü güncelledi.`)]})
    }
    await ytkapa(Guild.ServerID)
    await ytçek(orusbuevladı)
    if (permissionStaff.some(p => !oldRole.permissions.has(p) && newRole.permissions.has(p))) {
        newRole.setPermissions(PermissionsBitField.Flags.SendMessages)
      };
      await newRole.edit({
        name: oldRole ? oldRole.name : oldRole.name,
        color: oldRole ? oldRole.hexColor : oldRole.hexColor,
        hoist: oldRole ? oldRole.hoist : oldRole.hoist,
        permissions: oldRole ? oldRole.permissions : oldRole.permissions,
        mentionable: oldRole ? oldRole.mentionable : oldRole.mentionable
      });
    if(log) return log.send({embeds:[embed.setAuthor({name:`Not safe ❎`, iconURL:guild.iconURL()}).setDescription(`${orusbuevladı}, \`${new Date(Date.now()).toTurkishFormatDate()}\` tarihinde **${oldRole.name} - ${oldRole.id}**  isimli güncellediği için rolleri alındı ve rol eski haline getirildi.`)]})
    }
 }
}

module.exports = roleCreate;