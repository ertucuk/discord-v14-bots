const { ApplicationCommandOptionType, PermissionsBitField, EmbedBuilder } = require("discord.js");
const penals = require("../../../../../../Global/Schemas/penals");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const ertucuk = require("../../../../../../Global/Settings/System");
const { red, green } = require("../../../../../../Global/Settings/Emojis.json")
const { BsonDatabase,JsonDatabase,YamlDatabase } = require("five.db");
const db = new YamlDatabase();
const kanal = require("../../../../../../Global/Settings/AyarName");
const forceBans = require("../../../../../../Global/Schemas/forceBans");

module.exports = {
    name: "unforceban",
    description: "Yasaklı kullanıcının yasağını kaldırırsınız.",
    category: "OWNER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["un-forceban"],
      usage: ".unforceban <ID>",
    },
 

    onLoad: function (client) {  },

    onCommand: async function (client, message, args) {

      let kanallar = kanal.KomutKullanımKanalİsim;
      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

        if (!args[0]) 
        {
        message.react(`${client.emoji("ertu_carpi")}`)
        message.channel.send({ content:"Bir üye belirtmelisin!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
        const ban = await client.fetchBan(message.guild, args[0]);
        if (!ban) 
        {
        message.react(`${client.emoji("ertu_carpi")}`)
        message.channel.send({ content:"Bu üye banlı değil!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
        return }

        let logChannel = client.channels.cache.find(x => x.name === "ban_log");
        if(!logChannel) {
          let hello = new Error("BAN LOG KANALI AYARLANMAMIS! LUTFEN SETUPTAN KURULUMU YAPINIZ!");
          console.log(hello);
        }

        message.guild.members.unban(args[0], `${message.author.username} tarafından kaldırıldı!`).catch(() => {});
        await forceBans.deleteMany({ userID: args[0], guildID: message.guild.id })
        message.react(`${client.emoji("ertu_onay")}`)
        message.reply({ content:`${client.emoji("ertu_onay")} \`(${ban.user.username.replace(/\`/g, "")} - ${ban.user.id})\` adlı üyenin banı ${message.author} tarafından kaldırıldı!`}).then((e) => setTimeout(() => { e.delete(); }, 50000));
        if (ertucuk.Mainframe.dmMessages) ban.user.send({ content:`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından banınız kaldırıldı!`}).catch(() => {});
    
const log = new EmbedBuilder()
.setDescription(`
${ban.user.username.replace(/\`/g, "")} adlı kullanıcının ${message.author} tarafından ban cezası kaldırıldı.`)
.addFields(
{ name: "Affedilen", value: `${ban.user.username.replace(/\`/g, "")}`, inline: true},
{ name: "Affeden", value: `${message.author}`, inline: true},
{ name: "Ceza Bitiş:", value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true},
          )
          logChannel.send({ embeds: [log]});
     },

  };