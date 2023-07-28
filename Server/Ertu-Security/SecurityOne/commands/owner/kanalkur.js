const {PermissionFlagsBits, EmbedBuilder, ChannelType } = require('discord.js');
const conf = require('../../../../../Global/Settings/System')
const guardSchema = require("../../../schemas/guardSchema") 
const channelBackupSchema = require("../../../schemas/channelBackupSchema"); 

module.exports = {
    name: "kanalkur",
    aliases: ["kanal-kur"],
    execute:async (client, message, args) => {
        conf.BotsOwners.push(message.guild.ownerId)
        if(!conf.BotsOwners.some(ertu => message.author.id == ertu))return message.reply({content:`Komudu Kullanmak İçin Yetkin Yetersiz!`})

        const channel = args[0];
        if(!channel || isNaN(channel)) return message.reply({ content: `Kanal id gir.` });
        const chnlData = await channelBackupSchema.findOne({ guildId: message.guild.id, channelID: channel });
        if(!chnlData) return message.reply({ content: `Bot yedekleme almamış.` });

        let msg = await message.reply({ content: `Kanal bulundu ve kanalı açıcağım` });

        let newChannel;
        if (chnlData.type == 4) {
                newChannel = await message.guild.channels.create({
                    type: chnlData.type,
                    channelID: chnlData.id,
                    name: chnlData.name,
                    position: chnlData.position,
                });
        }
        if ((chnlData.type == 0) || (chnlData.type == 5)) {
                newChannel = await message.guild.channels.create({
                    type: chnlData.type,
                    channelID: chnlData.id,
                    name: chnlData.name,
                    parentID: chnlData.parentId,
                    position: chnlData.position,
                    nsfw: chnlData.nsfw,
                    rateLimit: chnlData.rateLimitPerUser,
                });                
        }
        if (chnlData.type == 2) {
            newChannel = await message.guild.channels.create({
                    type: chnlData.type,
                    channelID: chnlData.id,
                    name: chnlData.name,
                    bitrate: chnlData.bitrate,
                    userLimit: chnlData.userLimit,
                    parentID: chnlData.parentId,
                    position: chnlData.position,
            });
        } else {
            newChannel = await message.guild.channels.create({
                type: ChannelType.GuildText,
                channelID: chnlData.id,
                name: chnlData.name ? chnlData.name : "bulunamadi",
                position: chnlData.position,
            });
        }

        setTimeout(() => {
            let permOverwrites = chnlData.writes;
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
                        ch.permissionOverwrites.create(newChannel, obj).catch(err => message.channel.send({ content: `Abicim aminakoymussun botun` }))
                    }, i * 5000);
                });
            }
        }, 1000*5);
        message.channel.send({ content: `İsim bitti (sanirim)` })
    }
}
