    const {PermissionFlagsBits, EmbedBuilder } = require('discord.js');
    const conf = require('../../../../../Global/Settings/System')
    const guardSchema = require("../../../schemas/guardSchema") 

    module.exports = {
    name: "whitelist",
    aliases: ["wl","güvenli"],

    execute:async (client, message, args) => {

    conf.BotsOwners.push(message.guild.ownerId)
    if(!conf.BotsOwners.some(ertu => message.author.id == ertu))return message.reply({content:`Komudu Kullanmak İçin Yetkin Yetersiz!`})

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    let safeData = await guardSchema.findOne({ guildId: message.guild.id });
    if(!member){
    const embed = new EmbedBuilder()
    .setThumbnail(message.guild.iconURL({dynamic:true}))
    .setTitle("Güvenli Liste")
    .setDescription(`${safeData && safeData.whitelist && safeData.whitelist.length > 0 ? `Güvenli Listede \`${safeData.whitelist.length}\` Adet Kişi / Rol Bulunmakta.\n\n`+safeData.whitelist.map((data,index) => `${index+1}.) ${message.guild.members.cache.get(data) ? `<@!${data}> ${message.guild.members.cache.get(data).user.tag}` : `<@&${data}> ${message.guild.roles.cache.get(data).name}`} \`${data}\``).join("\n") :`Herhangi bir üye & rol güvenliye eklenmemiş!`}`)
    return message.reply({embeds:[embed]})
    }
    if(safeData && safeData.whitelist && safeData.whitelist.includes(member.id)){
    await guardSchema.findOneAndDelete({ guildId: message.guild.id }, {$push: {whitelist: member.id}}, { upsert: true }); 
    message.reply({embeds:[ new EmbedBuilder().setDescription(`${member} Başarıyla Güvenli Listeden Çıkartıldı!`).setColor("#ff0000")]})
    }else{
    await guardSchema.findOneAndUpdate({ guildId: message.guild.id }, {$push: {whitelist: member.id}}, { upsert: true });
    message.reply({embeds:[ new EmbedBuilder().setDescription(`${member} Başarıyla Güvenli Listeye Eklendi!`).setColor("#00ff00")]})
    }}

    }