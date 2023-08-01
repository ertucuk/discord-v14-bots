const { ApplicationCommandOptionType,PermissionsBitField } = require("discord.js");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const ertucuk = require("../../../../../../Global/Settings/System");
const kanal = require("../../../../../../Global/Settings/AyarName");

module.exports = {
    name: "zengin",
    description: "İsminizi değiştirirsiniz.",
    category: "USER",
    cooldown: 300,
    command: {
      enabled: true,
      aliases: ["b","booster"],
      usage: ".booster [isim]",
    },

    onLoad: function (client) { },

    onCommand: async function (client, message, args) { 

      let kanallar = kanal.KomutKullanımKanalİsim;
       if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 
       
       let booster = ertum.BoosterRole || undefined;
        if(!booster) 
        {
        message.reply({ content:"Booster Rolu Bulunamadı!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
        if(!message.member.roles.cache.has(booster)) 
        {
        message.reply({ content:"Bu Komutu Kullanabilmek İçin Booster Rolüne Sahip Olmalısın!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
        let uye = message.guild.members.cache.get(message.author.id);
        let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
        let ertucuk;
        if(!isim) 
        {
        message.reply({ content:"Geçerli bir isim belirtmelisin!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
        ertucuk = `${uye.user.username.includes(ertum.ServerTag) ? ertum.ServerTag : (ertum.ServerUntagged ? ertum.ServerUntagged : (ertum.ServerTag || ""))} ${isim}`;
        uye.setNickname(`${ertucuk}`).catch() 
        message.reply({ content:`Başarıyla ismini \`${ertucuk}\` olarak değiştirdim!`}).then((e) => setTimeout(() => { e.delete(); }, 5000));  
    },

  };