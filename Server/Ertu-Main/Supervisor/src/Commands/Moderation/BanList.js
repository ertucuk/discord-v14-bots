const { ApplicationCommandOptionType, PermissionsBitField, Formatters } = require("discord.js");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const kanal = require("../../../../../../Global/Settings/AyarName");

module.exports = {
    name: "banliste",
    description: "Sunucudaki banlıları listeler",
    category: "STAFF",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["banlist","yargıliste","yargılist","ban-liste"],
      usage: ".banlist",
    },
  
    onLoad: function (client) { },

    onCommand: async function (client, message, args) {

      let kanallar = kanal.KomutKullanımKanalİsim;
      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 
      
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers) && !ertum.BanHammer.some(x => message.member.roles.cache.has(x))) { message.channel.send({ content:"Yeterli yetkin bulunmuyor!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
        return }
        const ban = await message.guild.bans.fetch();
        if (!ban) { message.channel.send({ content: "Sunucuda Banlı üye bulunmamaktır."}).then((e) => setTimeout(() => { e.delete(); }, 5000));
        return }
        message.guild.bans.fetch().then(ertucuk => {
        let list = ertucuk.map(user => `Kullanıcı ID:       | Kullanıcı Adı:\n${user.user.id} | ${user.user.tag}`).join('\n');
        message.channel.send({  content:`${Formatters.codeBlock("js",
        `${list}\n\nSunucuda toplamda ${ertucuk.size} yasaklı kullanıcı bulunmakta.`)}`
    })})
  },
  
     

  };

