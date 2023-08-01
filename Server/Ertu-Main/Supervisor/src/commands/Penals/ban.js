const { ApplicationCommandOptionType, PermissionsBitField,EmbedBuilder } = require("discord.js");
const coin = require("../../../../../../Global/Schemas/coin");
const moment = require("moment");
const ceza = require("../../../../../../Global/Schemas/ceza");
const cezapuan = require("../../../../../../Global/Schemas/cezapuan")
const ertum = require("../../../../../../Global/Settings/Setup.json");
const ertucuk = require("../../../../../../Global/Settings/System");
const banLimit = new Map();
const { BsonDatabase,JsonDatabase,YamlDatabase } = require("five.db");
const db = new YamlDatabase();
moment.locale("tr");
const { red, green } = require("../../../../../../Global/Settings/Emojis.json")
const client = global.bot;
const kanal = require("../../../../../../Global/Settings/AyarName");

module.exports = {
    name: "ban",
    description: "Belirttiğinz Üyeyi Banlar",
    category: "PENAL",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["yargı","siktir","sg","uza"],
      usage: ".ban <@user/ID>",
    },
  

    onLoad: function (client) { },

    onCommand: async function (client, message, args) {

      let kanallar = kanal.KomutKullanımKanalİsim;
      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers) &&  !ertum.BanHammer.some(x => message.member.roles.cache.has(x))) { message.channel.send({ content:"Yeterli yetkin yok!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
        message.react(red)
        return }
        if (!args[0]) { message.channel.send({ content:"Banlanılacak üyeyi belirtmeyi unuttun!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
        message.react(red)
        return }
        const user = message.mentions.users.first() || message.guild.members.cache.get(args[0])
        if (!user) { message.channel.send({ content:"Böyle bir Kullanıcı bulamadım!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
        message.react(red)
        return }
        const reason = args.slice(1).join(" ") || "Belirtilmedi!";
        const member = message.guild.members.cache.get(user.id);
    
        if (message.guild.members.cache.has(user.id) && message.guild.members.cache.get(user.id).permissions.has(PermissionsBitField.Flags.ViewAuditLog)) return message.channel.send({ content:"Üst yetkiye sahip kişileri yasaklayamazsın!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
        if (message.guild.members.cache.has(user.id) && message.member.roles.highest.position <= message.guild.members.cache.get(user.id).roles.highest.position) return message.channel.send({ content:"Belirttiğin kişinin yetkisi ya senden yüksek yada aynı yetkidesiniz!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
        if (member && !member.bannable) return message.channel.send({ content:"Bu üyeyi banlayamıyorum!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
        if (ertucuk.Mainframe.banlimit > 0 && banLimit.has(message.author.id) && banLimit.get(message.author.id) == ertucuk.Mainframe.banlimit) return message.channel.send({ content:"Saatlik ban sınırına ulaştın!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
        let logChannel = client.channels.cache.find(x => x.name === "ban_log");
        if(!logChannel) {
          let hello = new Error("BAN LOG KANALI AYARLANMAMIS! LUTFEN SETUPTAN KURULUMU YAPINIZ!");
          console.log(hello);
        }
        
        message.react(green)
        if (ertucuk.Mainframe.dmMessages) user.send({ content:`**${message.guild.name}** sunucusundan, **${message.author.tag}** tarafından, **${reason}** sebebiyle banlandın!`}).catch(() => {});
        message.guild.members.ban(user.id, { reason: `${reason} | Yetkili: ${message.author.tag}` , days:1}).catch(() => {});
        db.push(`kullanıcı_${member.id}`,`\` BAN \` [${reason} - <t:${(Date.now() / 1000).toFixed()}>]`);

        message.react(green)
        message.reply({ content: `${member.user.id} ID'li kullanıcı başarıyla sunucudan yasaklandı!`});
    
        const log = new EmbedBuilder()
          .setDescription(`
          **${member.user.tag} adlı kullanıcıya **${message.author.tag}** tarafından ban atıldı.`)
          .addFields(
  { name: "Banlanan", value: `${member ? member.toString() : user.username}`, inline: true },
  { name: "Banlayan", value: `${message.author}`, inline: true},
  { name: "Sebep", value: `${reason}`, inline: true},)

          .setFooter({ text:`${moment(Date.now()).format("LLL")}` })
          logChannel.send({ embeds: [log]});
        await coin.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { coin: -100 } }, { upsert: true });
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { BanAmount: 1 } }, {upsert: true});
        await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { cezapuan: 100 } }, { upsert: true });
    
        const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });

        let punishmentLogChannel = client.channels.cache.find(x => x.name === "cezapuan_log");
        if(!punishmentLogChannel) {
          let hello = new Error("CEZA PUAN LOG KANALI AYARLANMAMIS! LUTFEN SETUPTAN KURULUMU YAPINIZ!");
          console.log(hello);
        }

        punishmentLogChannel.send({content: `\`${member}\` üyesi ban cezası alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`})
    
        if (ertucuk.Mainframe.banlimit > 0) {
          if (!banLimit.has(message.author.id)) banLimit.set(message.author.id, 1);
          else banLimit.set(message.author.id, banLimit.get(message.author.id) + 1);
          setTimeout(() => {
            if (banLimit.has(message.author.id)) banLimit.delete(message.author.id);
          }, 1000 * 60 * 60);
        }
     },

  };