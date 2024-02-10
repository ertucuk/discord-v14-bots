const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder,ButtonStyle } = require("discord.js");
const kanal = require("../../../../../../Global/Settings/AyarName");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const ertucuk = require("../../../../../../Global/Settings/System");
const registerStats = require("../../../../../../Global/Schemas/registerStats");
const names = require("../../../../../../Global/Schemas/names");

module.exports = {
    name: "şüpheliçıkart",
    description: "Belirtilen üye yeni bir hesapsa onu şüpheliden çıkartır.",
    category: "STAFF",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["unsuspend", "unsuspect"],
      usage: ".şüpheliçıkart <@user/ID> <Sebep>", 
    },
  

    onLoad: function (client) { },

    onCommand: async function (client, message, args, ertuembed) {


        let kanallar = kanal.KomutKullanımKanalİsim;
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 
    
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !ertum.JailHammer.some(x => message.member.roles.cache.has(x))) 
        {
        message.react(`${client.emoji("ertu_carpi")}`)
        message.channel.send({ content:"Yeterli yetkin bulunmuyor!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) {
        message.react(`${client.emoji("ertu_carpi")}`)
        message.channel.send({ content:"Bir üye belirtmelisin!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
        if (!ertum.SuspectedRoles.some(x => member.roles.cache.has(x))) 
        {
        message.react(`${client.emoji("ertu_carpi")}`)
        message.channel.send({ content:"Bu üye şüphelide değil!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && member.roles.highest.position >= message.member.roles.highest.position) 
        {
        message.react(`${client.emoji("ertu_carpi")}`)
        message.channel.send({ content:"Kendinle aynı yetkide ya da daha yetkili olan birini şüpheliden çıkaramazsın!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
        if (!member.manageable) {
        message.react(`${client.emoji("ertu_carpi")}`)  
        message.channel.send({ content:"Bu üyeyi jailden çıkaramıyorum!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
        let logChannel = client.channels.cache.find(x => x.name === "şüpheli_log");
        if(!logChannel) {
          let hello = new Error("ŞÜPHELİ LOG KANALI AYARLANMAMIS! LUTFEN SETUPTAN KURULUMU YAPINIZ!");
          console.log(hello);
        }

        let data = await registerStats.findOne({ guildID: message.guild.id })
        let User = await names.findOne({ userID: member.id });
        member.setRoles(ertum.UnRegisteredRoles)
        await member.setNickname(`${ertum.ServerUntagged} İsim | Yaş`)
        
      const log = new EmbedBuilder()
        .setDescription(`
            ${member} üyesinin şüpheli durumu <t:${String(Date.now()).slice(0, 10)}:R> ${message.member} tarafından kaldırıldı.
            `)
        .addFields(
          { name: "Affedilen", value: `${member ? member.toString() : user.username}`, inline: true },
          { name: "Affeden", value: `${message.author}`, inline: true },
        )
        .setFooter({ text: `${moment(Date.now()).format("LLL")}` })
      await logChannel.send({ embeds: [log] });



     },

  };