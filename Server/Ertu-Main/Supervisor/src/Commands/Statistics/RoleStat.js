const { EmbedBuilder } = require("discord.js");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const ertucuk = require("../../../../../../Global/Settings/System");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr")
const { MessageStat, MessageUserChannel, VoiceStat, VoiceUserChannel, StreamerStat, StreamerUserChannel, CameraStat, CameraUserChannel } = require("../../../../../../Global/Models")


module.exports = {
    name: "roldenetim",
    description: "Roldeki kişilerin istatistiğini listeler.",
    category: "ADMIN",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["rolstat"],
      usage: ".roldenetim @rol", 
    },
  

    onLoad: function (client) { },

    onCommand: async function (client, message, args) {

        if (!ertum.OwnerRoles.some(ertucum => message.member.roles.cache.has(ertucum)) && !message.member.permissions.has()) {
            message.reply({ content: `Yetkin bulunmamakta dostum.` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
            return
         }
          
         const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);

         if (!role) return message.reply({ content: `Lütfen istatiğine bakmak istediğiniz bir rolü etiketleyiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

         if (role) {
            if(!client.guilds.cache.get(ertucuk.ServerID).roles.cache.get(role.id)) {
              return message.reply({ content: "Sunucuda belirttiğiniz rol bulunmamaktadır.", ephemeral: true })
            }
        }

const messageData = async (type) => {
let data =  await MessageStat.find({guildID: message.guild.id});
data = data.filter((x) => message.guild.members.cache.has(x.userID) && message.guild.members.cache.get(x.userID).roles.cache.has(role.id));
return data.length > 0 ? data.map((x, index) => `${index + 1} ${client.guilds.cache.get(ertucuk.ServerID).members.cache.get(x.userID).user.tag} : ${Number(x[type]).toLocaleString()} mesaj`) .join("\n") : "Veri bulunmuyor!";
}
const voiceData = async (type) => {
let data = await VoiceStat.find( {guildID: message.guild.id});
data = data.filter((x) => message.guild.members.cache.has(x.userID) && message.guild.members.cache.get(x.userID).roles.cache.has(role.id));
return data.length > 0 ? data.map((x, index) => `${index + 1} ${client.guilds.cache.get(ertucuk.ServerID).members.cache.get(x.userID).user.tag} : ${moment.duration(x[type]).format("H [saat], m [dakika] s [saniye]")}`) .join("\n") : "Veri bulunmuyor!";
}
const yayındata = async (type) => {
let data = await StreamerStat.find({guildID: message.guild.id});;
data = data.filter((x) => message.guild.members.cache.has(x.userID) && message.guild.members.cache.get(x.userID).roles.cache.has(role.id));
return data.length > 0 ? data.map((x, index) => `${index + 1} ${client.guilds.cache.get(ertucuk.ServerID).members.cache.get(x.userID).user.tag} : ${moment.duration(x[type]).format("H [saat], m [dakika] s [saniye]")}`) .join("\n") : "Veri bulunmuyor!";
}
const kameradata = async (type) => {
let data = await CameraStat.find({guildID: message.guild.id});
data = data.filter((x) => message.guild.members.cache.has(x.userID) && message.guild.members.cache.get(x.userID).roles.cache.has(role.id));
return data.length > 0 ? data.map((x, index) => `${index + 1} ${client.guilds.cache.get(ertucuk.ServerID).members.cache.get(x.userID).user.tag} : ${moment.duration(x[type]).format("H [saat], m [dakika] s [saniye]")}`) .join("\n") : "Veri bulunmuyor!";
}

let text = `────────────────────────────────────

➜ ${client.guilds.cache.get(ertucuk.ServerID).roles.cache.get(role.id).name} Rolündeki Üyeler ve Ses Bilgileri:
            
${await voiceData("TotalStat")}
            
────────────────────────────────────
            
➜ ${client.guilds.cache.get(ertucuk.ServerID).roles.cache.get(role.id).name} Rolündeki Üyeler ve Mesaj Bilgileri:

${await messageData("TotalStat")}
            
────────────────────────────────────

➜ ${client.guilds.cache.get(ertucuk.ServerID).roles.cache.get(role.id).name} Rolündeki Üyeler ve Yayın Bilgileri:

${await yayındata("TotalStat")}

────────────────────────────────────

➜ ${client.guilds.cache.get(ertucuk.ServerID).roles.cache.get(role.id).name} Rolündeki Üyeler ve Kamera Bilgileri:

${await kameradata("TotalStat")}
            
────────────────────────────────────`
            
message.channel.send({ content:`${client.guilds.cache.get(ertucuk.ServerID).roles.cache.get(role.id).toString()} rolüne sahip üyelerin verileri;`, files: [{ attachment: Buffer.from(text), name: "erturolstat.js" }] });
    }

  };