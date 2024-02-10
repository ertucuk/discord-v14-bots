const { ApplicationCommandOptionType, PermissionsBitField,ActionRowBuilder, StringSelectMenuBuilder,EmbedBuilder } = require("discord.js");
const moment = require("moment");
const ceza = require("../../../../../../Global/Schemas/ceza");
moment.locale("tr");
const { BsonDatabase,JsonDatabase,YamlDatabase } = require("five.db");
const db = new YamlDatabase();
const ertum = require("../../../../../../Global/Settings/Setup.json");
const ertucuk = require("../../../../../../Global/Settings/System");
const penals = require("../../../../../../Global/Schemas/penals")
const uyarisayi = require("../../../../../../Global/Schemas/uyarisayi")
const cezapuan = require("../../../../../../Global/Schemas/cezapuan")
const { red, green } = require("../../../../../../Global/Settings/Emojis.json")
const kanal = require("../../../../../../Global/Settings/AyarName");

module.exports = {
    name: "uyar",
    description: "Belirttiğiniz kullanıcıyı uyarırsınız.",
    category: "STAFF",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["warn"],
      usage: ".warn <@User/ID>", 
    },
  

    onLoad: function (client) { },

    onCommand: async function (client, message, args) {

  
   
        let kanallar = kanal.KomutKullanımKanalİsim;
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 
        
                if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !ertum.WarnHammer.some(x => message.member.roles.cache.has(x))) 
                {
                message.react(`${client.emoji("ertu_carpi")}`)
                message.channel.send({ content:  "Yeterli yetkin bulunmuyor!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); }
                const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
                if (!member) 
                {
                message.react(`${client.emoji("ertu_carpi")}`)
                message.channel.send({ content: "Bir üye belirtmelisin!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); }
                if (!message.member.permissions.has(8n) && member.roles.highest.position >= message.member.roles.highest.position) 
                {
                message.react(`${client.emoji("ertu_carpi")}`)
                message.channel.send({ content:  "Kendinle aynı yetkide ya da daha yetkili olan birini uyaramazsın!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); }
              
        let punishmentLogChannel = client.channels.cache.find(x => x.name === "cezapuan_log");
        if(!punishmentLogChannel) {
         let hello = new Error("CEZA PUAN LOG KANALI AYARLANMAMIS! LUTFEN SETUPTAN KURULUMU YAPINIZ!");
        console.log(hello);
        }
        
        let logChannel = client.channels.cache.find(x => x.name === "warn_log");
        if(!logChannel) {
        let hello = new Error("WARN LOG KANALI AYARLANMAMIS! LUTFEN SETUPTAN KURULUMU YAPINIZ!");
         console.log(hello);
        }
                 
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
        await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { cezapuan: 10 } }, { upsert: true });
        const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });
        const reason = args.slice(1).join(" ") || "Belirtilmedi!";
        punishmentLogChannel.send({content: `${member} üyesi uyarı cezası alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`})
        const uyariData = await uyarisayi.findOne({ guildID: message.guild.id, userID: member.user.id });

        const penal = await client.penalize(message.guild.id, member.user.id, "Uyarı", false, message.author.id, reason);
        
        await uyarisayi.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { sayi: 1 } }, { upsert: true });
        message.react(`${client.emoji("ertu_onay")}`)
        message.reply({ content: `${client.emoji("ertu_onay")} ${member.toString()} üyesi, ${message.author} tarafından, \`${reason}\` nedeniyle uyarıldı! Ceza Numarası: (\`#${penal.id}\`)`}).then((e) => setTimeout(() => { e.delete(); }, 50000));
        if (ertucuk.Mainframe.dmMessages) member.send({ content: `**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından, **${reason}** sebebiyle uyarıldınız!`}).catch(() => {});
        
        const data = await penals.find({ guildID: message.guild.id, userID: member.user.id, type: 'Uyarı'})

        if (data && data.length >= 5) {
          
          try {
             await member.timeout(3600000, '5 Uyarı')
          } catch {
            return
          }
         
          data.forEach(async (i) => {
            await penals.findByIdAndDelete(i._id)
          })

          await message.channel.send({
            content: `${member.toString()} üyesinin toplam ceza sayısı 5 olduğu için 1 saat timeout cezası aldı.`
          })
        }

        const log = new EmbedBuilder()
        .setDescription(`
        ${member.user.tag} adlı kullanıcıya **${message.author.tag}** tarafından uyarıldı.  Ceza Numarası: (\`#${penal.id}\`)    
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
  };