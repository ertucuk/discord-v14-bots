const afk = require("../../../../../../Global/Schemas/afk");
const { ApplicationCommandOptionType, EmbedBuilder,PermissionsBitField } = require("discord.js");
const ertucuk = require("../../../../../../Global/Settings/System");
const { green } = require("../../../../../../Global/Settings/Emojis.json");
const kanal = require("../../../../../../Global/Settings/AyarName");

module.exports = {
    name: "afk",
    description: "Afk Bırakırsınız",
    category: "USER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: [],
      usage: ".afk",
    },


    onLoad: function (client) {

        const afk = require("../../../../../../Global/Schemas/afk");

        client.on("messageCreate", async (message) => { 
          if (message.author.bot || !message.guild || message.content.toLowerCase().startsWith(".afk")) return;
          const data = await afk.findOne({ guildID: message.guild.id, userID: message.author.id });
          const embed = new EmbedBuilder().setAuthor({ name: message.member.displayName});
          if (data) {
            const afkData = await afk.findOne({ guildID: message.guild.id, userID: message.author.id });
            await afk.deleteOne({ guildID: message.guild.id, userID: message.author.id });
            if (message.member.displayName.includes("[AFK]") && message.member.manageable) await message.member.setNickname(message.member.displayName.replace("[AFK]", ""));
            message.reply({ content:`Merhaba **${message.author.username}** Tekrardan Hoş Geldin.`}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
          }
          
          const member = message.mentions.members.first();
          if (!member) return;
          const afkData = await afk.findOne({ guildID: message.guild.id, userID: member.user.id });
          if (!afkData) return;
          embed.setDescription(`${member.toString()} kullanıcısı, \`${afkData.reason}\` sebebiyle, <t:${Math.floor(afkData.date / 1000)}:R> afk oldu!`);
          message.channel.send({ embeds: [embed]}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 
        })
 },

    onCommand: async function (client, message, args) {
let kanallar = kanal.KomutKullanımKanalİsim;
if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

if (message.member.displayName.includes("[AFK]")) return
const reason = args.join(" ") || "Belirtilmedi";
await afk.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $set: { reason, date: Date.now() } }, { upsert: true });
message.react(`${client.emoji("ertu_onay")}`)
message.reply({ content:"Başarıyla [AFK] moduna girdiniz!"}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 
if (message.member.manageable) message.member.setNickname(`[AFK] ${message.member.displayName}`);
     
},

  };