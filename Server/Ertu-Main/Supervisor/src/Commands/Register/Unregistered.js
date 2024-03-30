const { ApplicationCommandOptionType,PermissionsBitField, EmbedBuilder } = require("discord.js");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const { red, green } = require("../../../../../../Global/Settings/Emojis.json");
const ertucuk = require("../../../../../../Global/Settings/System");
const isimler = require("../../../../../../Global/Schemas/names");
const kanal = require("../../../../../../Global/Settings/AyarName");

module.exports = {
    name: "unregister",
    description: "belirttiğiniz üyeyi kayıtsıza atar.",
    category: "REGISTER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["ks","kayıtsız","kayitsiz"],
      usage: ".kayıtsız <user/ID>",
    },
   

    onLoad: function (client) { },

    onCommand: async function (client, message, args) {

      let kanallar = kanal.KomutKullanımKanalİsim;
      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

      if (!ertum.ConfirmerRoles.some(ertuu => message.member.roles.cache.has(ertuu)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return messageReactAndReply(`${client.emoji("ertu_carpi")}`,`Yeterli yetkin yok!`);
      }
      
      const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      if (!member) {
        return messageReactAndReply(`${client.emoji("ertu_carpi")}`,"Bir kullanıcı etiketlemelisin ya da ID'sini girmelisin.");
      }
      
      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && member.roles.highest.position >= message.member.roles.highest.position) {
        return messageReactAndReply(`${client.emoji("ertu_carpi")}`,"Kendinle aynı yetkide ya da daha yetkili olan birini kayıtsıza atamazsın!");
      }
      
      if (!member.manageable) {
        return messageReactAndReply(`${client.emoji("ertu_carpi")}`,"Bu üyeyi kayıtsıza atamıyorum!");
      }

      function messageReactAndReply(emoji, content) {
        message.react(emoji);
        message.reply({ content }).then((e) => setTimeout(() => { e.delete(); }, 5000));
      }
      
        message.react(`${client.emoji("ertu_onay")}`)
        member.roles.set(ertum.UnRegisteredRoles);
        member.setNickname(`${ertum.ServerUntagged} İsim | Yaş`)
        message.channel.send({ embeds: [ new EmbedBuilder().setFooter({text: ertucuk.SubTitle}).setDescription(`${client.emoji("ertu_onay")} ${member} üyesi başarıyla ${message.author} tarafından kayıtsıza atıldı.`)]}).then((e) => setTimeout(() => { e.delete(); }, 5000));
        await isimler.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { names: { name: member.displayName, yetkili: message.author.id,  rol: "Kayıtsıza Atıldı", date: Date.now() } } }, { upsert: true });
     },
  };

 