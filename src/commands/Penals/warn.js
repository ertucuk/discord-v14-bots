const { ApplicationCommandOptionType, PermissionsBitField, EmbedBuilder } = require("discord.js");
const coin = require("../../schemas/coin");
const moment = require("moment");
const ceza = require("../../schemas/ceza");
moment.locale("tr");
const { BsonDatabase,JsonDatabase,YamlDatabase } = require("five.db");
const db = new YamlDatabase();
const ertum = require("../../Settings/Setup.json");
const ertucuk = require("../../Settings/System");
const penals = require("../../schemas/penals")
const uyarisayi = require("../../schemas/uyarisayi")
const cezapuan = require("../../schemas/cezapuan")
const { red, green } = require("../../Settings/Emojis.json")

module.exports = {
    name: "uyarı",
    description: "",
    category: "NONE",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["uyar","warn"],
      usage: "",
    },
    slashCommand: {
      enabled: true,
      options: [
        {
            name: "ertu",
            description: "ertu",
            type: ApplicationCommandOptionType.Subcommand,
        },
      ],
    },

    onLoad: function (client) { },

    onCommand: async function (client, message, args) {

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !ertum.WarnHammer.some(x => message.member.roles.cache.has(x))) 
        {
        message.react(red)
        message.channel.send({ content:  "Yeterli yetkin bulunmuyor!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); }
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) 
        {
        message.react(red)
        message.channel.send({ content: "Bir üye belirtmelisin!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); }
        if (!message.member.permissions.has(8n) && member.roles.highest.position >= message.member.roles.highest.position) 
        {
        message.react(red)
        message.channel.send({ content:  "Kendinle aynı yetkide ya da daha yetkili olan birini uyaramazsın!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); }
        if (!member.manageable) 
        {
        message.react(red)
        message.channel.send({ content: "Bu üyeyi susturamıyorum!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); }

        await coin.findOneAndUpdate({ guildID: member.guild.id, userID: member.user.id }, { $inc: { coin: -10 } }, { upsert: true });
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
        await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { cezapuan: 10 } }, { upsert: true });
        const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });
        const reason = args.slice(2).join(" ") || "Belirtilmedi!";
        if(ertum.cezapuanlog) message.guild.channels.cache.get(ertum.cezapuanlog).send({ content: `${member} üyesi \`uyarı cezası\` alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`});
        const uyariData = await uyarisayi.findOne({ guildID: message.guild.id, userID: member.user.id });
        db.push(`kullanıcı_${member.id}`,`\` WARN \` [${reason} - <t:${(Date.now() / 1000).toFixed()}>]`);
        await uyarisayi.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { sayi: 1 } }, { upsert: true });
        const data = await penals.find({ guildID: message.guild.id, userID: member.user.id, type: "WARN" });
        message.react(green)
        message.reply({ content: `${green} ${member.toString()} üyesi, ${message.author} tarafından, \`${reason}\` nedeniyle uyarıldı!`}).then((e) => setTimeout(() => { e.delete(); }, 50000));
        if (ertucuk.Moderation.dmMessages) member.send({ content: `**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından, **${reason}** sebebiyle uyarıldınız!`}).catch(() => {});
        
        let logChannel = client.channels.cache.find(x => x.name === "warn_log");
        if(!logChannel) {
          let hello = new Error("JAIL LOG KANALI AYARLANMAMIS! LUTFEN SETUPTAN KURULUMU YAPINIZ!");
          console.log(hello);
        }

        const log = new EmbedBuilder()
          .setDescription(`
          ${member.user.tag} adlı kullanıcıya **${message.author.tag}** tarafından uyarıldı.    
          `)
          .addFields(
{ name: "Cezalandırılan", value: `${member ? member.toString() : user.username}`, inline: true },
{ name: "Cezalandıran", value: `${message.author}`, inline: true},
{ name: "Uyarı Sayısı", value: `${uyariData ? Math.floor(parseInt(uyariData.sayi)) : 1}`, inline: true},
{ name: "Ceza Sebebi", value: `\`\`\`fix\n${reason}\n\`\`\``, inline: false},
)
.setFooter({ text:`${moment(Date.now()).format("LLL")}` })
logChannel.send({embeds: [log]});

     },

    onSlash: async function (client, interaction) { },
  };