const { ApplicationCommandOptionType, PermissionsBitField,ActionRowBuilder, StringSelectMenuBuilder,EmbedBuilder } = require("discord.js");
const moment = require("moment");
const ceza = require("../../../../../../Global/Schemas/ceza");
const cezapuan = require("../../../../../../Global/Schemas/cezapuan")
const jailLimit = new Map();
const ms = require("ms")
moment.locale("tr");
const ertum = require("../../../../../../Global/Settings/Setup.json")
const ertucuk = require("../../../../../../Global/Settings/System");
const { red, green  } = require("../../../../../../Global/Settings/Emojis.json")
const kanal = require("../../../../../../Global/Settings/AyarName");
const penals = require("../../../../../../Global/Schemas/penals");

module.exports = {
    name: "reklam",
    description: "Kullanıcıyı reklam nedeniyle jaillersiniz.",
    category: "STAFF",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["ads"],
      usage: ".reklam <@User/ID>", 
    },
  

    onLoad: function (client) { },

    onCommand: async function (client, message, args) {

        if (!message.guild) return;
        let kanallar = kanal.KomutKullanımKanalİsim;
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !ertum.JailHammer.some(x => message.member.roles.cache.has(x))) 
        {
        message.react(`${client.emoji("ertu_carpi")}`)
        message.channel.send({ content:"Yeterli yetkin bulunmuyor!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) { message.channel.send({ content:"Bir üye belirtmelisin!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
        message.react(`${client.emoji("ertu_carpi")}`) 
        return }
        if (ertum.JailedRoles.some(x => member.roles.cache.has(x))) { message.channel.send({ content:"Bu üye zaten jailde!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
        message.react(`${client.emoji("ertu_carpi")}`) 
        return }
        if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send({ content: "Kendinle aynı yetkide ya da daha yetkili olan birini jailleyemezsin!"});
        if (!member.manageable) return message.channel.send({ content:"Bu üyeyi jailleyemiyorum!"});

        let logChannel = client.channels.cache.find(x => x.name === "jail_log");
        let punishmentLogChannel = client.channels.cache.find(x => x.name === "cezapuan_log");
        if(!logChannel) {
          let hello = new Error("REKLAM LOG KANALI AYARLANMAMIS! LUTFEN SETUPTAN KURULUMU YAPINIZ!");
          console.log(hello);
        }
        if(!punishmentLogChannel) {
          let hello = new Error("CEZA PUAN LOG KANALI AYARLANMAMIS! LUTFEN SETUPTAN KURULUMU YAPINIZ!");
          console.log(hello);
        }
        message.reply({content: `Kullanıcıyı reklam'dan dolayı karantinaya atmak için ekran görüntüsü atınız.`}).then(() => {message.channel.awaitMessages({filter: (m) => m.member.id === message.author.id,max: 1,time: 120000}).then(async ertu => {
          if (!ertu.first().attachments?.first()) { 
            return message.channel.send({ content:"Lütfen sadece ekran görüntüsü atınız."}).delete(5)
          }

          const reason = "Reklam Yaptı!";
          await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
          await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
          await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { JailAmount: 1 } }, {upsert: true});
          await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { cezapuan: 20 } }, { upsert: true });
          const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });
          punishmentLogChannel.send({ content: `${member} üyesi Jail (Reklam) cezası alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`})
          member.roles.cache.has(ertum.BoosterRole) ? member.roles.set([ertum.BoosterRole, ertum.JailedRoles[0]]) : member.roles.set(ertum.JailedRoles)
          message.react(`${client.emoji("ertu_onay")}`)
          const penal = await client.penalize(message.guild.id, member.id, 'Reklam', true, message.author.id, reason)

          penal.proofImage = ertu.first().attachments.first().proxyURL
          penal.save()


          message.reply({ content:`${client.emoji("ertu_onay")} ${member.toString()} üyesi, ${message.author} tarafından, \`${reason}\` nedeniyle jaillendi! Ceza Numarası: (\`#${penal.id}\`)`}).then((e) => setTimeout(() => { e.delete(); }, 50000));
          if (ertucuk.Mainframe.dmMessages) member.send({ content:`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından, **${reason}** sebebiyle jaillendiniz.`, files: [ertu.first().attachments.first()]}).catch(() => {});

          const log = new EmbedBuilder()
          .setDescription(`**${member.user.tag}** adlı kullanıcıya **${message.author.tag}** tarafından Reklam Cezası atıldı. Ceza Numarası: (\`#${penal.id}\`)`)
          .addFields(
          { name: "Cezalandırılan", value: `${member ? member.toString() : member.user.username}`, inline: true},
          { name: "Cezalandıran", value: `${message.author}`, inline: true},
          { name: "Ceza Sebebi", value: `${reason}`, inline: true},
                  )
          .setFooter({ text:`${moment(Date.now()).format("LLL")}` })
          .setImage(ertu.first().attachments.first().proxyURL)
            await logChannel.send({ embeds: [log]});
          }).catch(err => message.reply({ content :`${client.emoji("ertu_carpi")} Ekran görüntüsü atılmadığı için reklam işlemi iptal edildi.`}) + console.log(err));
          });
     },
  };