const {PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const conf = require('../../../../../Global/Settings/System')
const guardSchema = require("../../../schemas/guardSchema") 
const roleGuardSchema = require("../../../schemas/roleBackupSchema"); 

module.exports = {
    name: "rolkur",
    aliases: [],
    execute:async (client, message, args) => {
        conf.BotsOwners.push(message.guild.ownerId)
        if(!conf.BotsOwners.some(ertu => message.author.id == ertu))return message.reply({content:`Komudu Kullanmak İçin Yetkin Yetersiz!`})
        const roleData = await roleGuardSchema.findOne({ guildId: message.guild.id });

        const role = args[0];
        if(!role || isNaN(role)) return message.reply({ content: `Rol id gir.` });
        if(!roleData) return message.reply({ content: `Bot yedekleme almamış.` });
        if(roleData.id !== role) return message.reply({ content: `Rol bulunamadı.` });

        let msg = await message.reply({ content: `Rol bulundu ve rolü açıp eski üyelere geri vereceğim.` });

        const newRole = await message.guild.roles.create({
            name: roleData.name,
            hoist: roleData.hoist,
            color: roleData.color,
            position: roleData.position,
            mentionable: roleData.mentionable,
            reason: `Rol eklendi.`
        });

        setTimeout(() => {
            let permOverwrites = roleData.writes;
            if(permOverwrites) {
                permOverwrites.forEach((ertu, i) => {
                    const ch = message.guild.channels.cache.get(ertu.id);
                    if(!ch) return;
                    setTimeout(() => {
                        let obj = {};
                        ertu.allow.forEach(allow => {
                            obj[allow] = true;
                        });
                        ertu.deny.forEach(deny => {
                            obj[deny] = false;
                        });
                        ch.permissionOverwrites.create(newRole, obj).catch(err => message.channel.send({ content: `Abicim aminakoymussun botun` }))
                    }, i * 5000);
                });
            }
        }, 1000*5);

        let ert = roleData.members.length;
        if(ert <= 0) return message.channel.send({ content: `Veritanında ${newRole} rolünde bir kullanıcı bulunmadığından işlem iptal edildi.` });
        msg.edit({ content:  ``})



    }
}
