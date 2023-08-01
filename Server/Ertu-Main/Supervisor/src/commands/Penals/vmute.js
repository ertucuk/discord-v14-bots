const { ApplicationCommandOptionType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { BsonDatabase,JsonDatabase,YamlDatabase } = require("five.db");
const db = new YamlDatabase();
const coin = require("../../../../../../Global/Schemas/coin");
const ceza = require("../../../../../../Global/Schemas/ceza");
const cezapuan = require("../../../../../../Global/Schemas/cezapuan")
const vmuteLimit = new Map();
const moment = require("moment");
moment.locale("tr");
const ms = require("ms");
const ertum = require("../../../../../../Global/Settings/Setup.json")
const ertucuk = require("../../../../../../Global/Settings/System");
const { red, green } = require("../../../../../../Global/Settings/Emojis.json")
const kanal = require("../../../../../../Global/Settings/AyarName");

module.exports = {
    name: "vmute",
    description: "Kullanıcıyı ses kanallarından susturursunuz.",
    category: "PENAL",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["sesmute"],
      usage: ".vmute <@user/ID>",
    },
  

    onLoad: function (client) { },

    onCommand: async function (client, message, args) {

      let kanallar = kanal.KomutKullanımKanalİsim;
if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !ertum.VMuteHammer.some(x => message.member.roles.cache.has(x))) 
        {
        message.react(red)
        message.channel.send({content: "Yeterli yetkin bulunmuyor!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) {
        message.react(red)
        message.channel.send({content:"Bir üye belirtmelisin!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
        if (ertum.VMutedRole.some(x => member.roles.cache.has(x))) 
        {
        message.react(red)
        message.channel.send({content: "Bu üye zaten susturulmuş!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
        if (message.member.roles.highest.position <= member.roles.highest.position) 
        {
        message.react(red)
        message.channel.send({content:"Kendinle aynı yetkide ya da daha yetkili olan birini susturamazsın!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
        if (!member.manageable) 
        {
        message.react(red)
        message.channel.send({ content:"Bu üyeyi susturamıyorum!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
        if (ertucuk.Mainframe.voicemutelimit > 0 && vmuteLimit.has(message.author.id) && vmuteLimit.get(message.author.id) == ertucuk.Mainframe.voicemutelimit) 
        {
        message.react(red)
        message.channel.send({ content:"Saatlik susturma sınırına ulaştın!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
    
        let logChannel = client.channels.cache.find(x => x.name === "vmute_log");
        if(!logChannel) {
          let hello = new Error("VOICE MUTE LOG KANALI AYARLANMAMIS! LUTFEN SETUPTAN KURULUMU YAPINIZ!");
          console.log(hello);
        }
        let punishmentLogChannel = client.channels.cache.find(x => x.name === "cezapuan_log");
        if(!punishmentLogChannel) {
          let hello = new Error("CEZA PUAN LOG KANALI AYARLANMAMIS! LUTFEN SETUPTAN KURULUMU YAPINIZ!");
          console.log(hello);
        }

        const row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('vmute')
                .setPlaceholder(`Sesli kanalları cezaları`)
                .addOptions([
                    { label: 'Kışkırtma, Trol ve Dalgacı Davranış (5 Dakika)', description: '5 Dakika', value: 'vmute1', emoji: '1127327012701360148'},
                    { label: 'Özel Odalara İzinsiz Giriş ve Trol (1 Saat)', description: '1 Saat', value: 'vmute2', emoji: '1127327012701360148'},
                    { label: 'Küfür, Argo, Hakaret ve Rahatsız Edici Davranış (5 Dakika)', description: '5 Dakika', value: 'vmute3', emoji: '1127327012701360148'},
                    { label: 'Abartı, Küfür ve Taciz Kullanımı (30 Dakika)', description: '30 Dakika', value: 'vmute4', emoji: '1127327012701360148'},
                    { label: 'Dini, Irki ve Siyasi değerlere Hakaret (2 Hafta)', description: '2 Hafta', value: 'vmute5', emoji: '1127327012701360148'},
                    { label: 'Sunucu Kötüleme ve Kişisel Hakaret (1 Saat)', description: '1 Saat', value: 'vmute6', emoji: '1127327012701360148'},
                    { label: 'Soundpad, Bass gibi Uygulama Kullanmak (30 Dakika)', description: '30 Dakika', value: 'vmute7', emoji: '1127327012701360148'},
                 ]),
        );
    
        const duration = args[1] ? ms(args[1]) : undefined;
     
        if (duration) {
          const reason = args.slice(2).join(" ") || "Belirtilmedi!";
        
          await coin.findOneAndUpdate({ guildID: member.guild.id, userID: member.user.id }, { $inc: { coin: -20 } }, { upsert: true });
          await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
          await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { VoiceMuteAmount: 1 } }, {upsert: true});
          await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
          await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { cezapuan: 10 } }, { upsert: true });
          const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });
          if(punishmentLogChannel) punishmentLogChannel.send({content:`${member} üyesi \`voice mute cezası\` alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`});
          member.roles.add(ertum.VMutedRole);
          if (member.voice.channelId && !member.voice.serverMute) {
            member.voice.setMute(true);
            member.roles.add(ertum.VMutedRole);
          }
          db.push(`kullanıcı_${member.id}`,`\` VOICE-MUTE \` [${reason} - <t:${(Date.now() / 1000).toFixed()}>]`);
          message.react(green)
          if(msg) msg.delete();
          await message.channel.send({ content:`${green} ${member.toString()} üyesi, ${message.author} tarafından, \`${reason}\` nedeniyle **sesli kanallarda** susturuldu! `}).then((e) => setTimeout(() => { e.delete(); }, 50000));
           message.react(green)
          if (ertucuk.Mainframe.dmMessages) member.send({ content:`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından, **${reason}** sebebiyle, <t:${Math.floor((Date.now() + duration) / 1000)}:R>'ya kadar **sesli kanallarda** susturuldunuz.`}).catch(() => {});
      
          setTimeout(async () => {
            let cezaBittiLog = new EmbedBuilder()
            .setAuthor({ name: member.displayName, iconURL: member.user.avatarURL({ dynamic: true }) })
            .setDescription(`${member} adlı üyenin ses mute süresi bitti.`)
            .setTimestamp()
            member.roles.remove(ertum.VMutedRole);
            await logChannel.send({ embeds : [cezaBittiLog] }); 
          }, duration);


          const log = new EmbedBuilder()
            .setDescription(`
            ${member.user.tag} adlı kullanıcıya **${message.author.tag}** tarafından Ses-Mutesi atıldı.    
            `)
            .addFields(
                { name: "Cezalandırılan", value: `${member ? member.toString() : user.username}`, inline: true},
                { name: "Cezalandıran", value: `${message.author}`, inline: true},
                { name: "Ceza Bitiş", value: `<t:${Math.floor((Date.now() + duration) / 1000)}:R>`, inline: true},
                { name: "Ceza Sebebi", value: `\`\`\`fix\n${reason}\n\`\`\``, inline: false},
                            )
          .setFooter({ text:`${moment(Date.now()).format("LLL")}    ` })
    await logChannel.send({ embeds: [log]});
       
          if (ertucuk.Mainframe.voicemutelimit > 0) {
            if (!vmuteLimit.has(message.author.id)) vmuteLimit.set(message.author.id, 1);
            else vmuteLimit.set(message.author.id, vmuteLimit.get(message.author.id) + 1);
            setTimeout(() => {
              if (vmuteLimit.has(message.author.id)) vmuteLimit.delete(message.author.id);
            }, 1000 * 60 * 60);
          }
        } else if (!duration) {
          var msg = await message.channel.send({ embeds: [new EmbedBuilder()
          .setAuthor({name:message.guild.name,iconURL:message.guild.iconURL()})
          .setDescription(`Aşağıda bulunan menüden sesli kanallarından susturmak istediğiniz ${member.toString()} için uygun olan ceza sebebini ve süresini seçiniz!`)],
          components: [row]})
            }
        
        if (msg) {
        const filter = i => i.user.id === message.member.id;
        const collector = await msg.createMessageComponentCollector({ filter: filter, time: 30000 });
            
        collector.on("collect", async (interaction) => {
        
        if (interaction.values[0] === "vmute1") {
        await interaction.deferUpdate();
        const duration = "5m" ? ms("5m") : undefined;
        const reason = "Kışkırtma, Trol ve Dalgacı Davranış";
    
        await coin.findOneAndUpdate({ guildID: member.guild.id, userID: member.user.id }, { $inc: { coin: -20 } }, { upsert: true });
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { VoiceMuteAmount: 1 } }, {upsert: true});
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
        await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { cezapuan: 10 } }, { upsert: true });
        const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });
        if(punishmentLogChannel) punishmentLogChannel.send({content:`${member} üyesi \`voice mute cezası\` alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`});
        member.roles.add(ertum.VMutedRole);
        if (member.voice.channelId && !member.voice.serverMute) {
          member.voice.setMute(true);
          member.roles.add(ertum.VMutedRole);
        }
        db.push(`kullanıcı_${member.id}`,`\` VOICE-MUTE \` [${reason} - <t:${(Date.now() / 1000).toFixed()}>]`);
        message.react(green)
        if(msg) msg.delete();
        await message.channel.send({ content:`${green} ${member.toString()} üyesi, ${message.author} tarafından, \`${reason}\` nedeniyle **sesli kanallarda** susturuldu! `}).then((e) => setTimeout(() => { e.delete(); }, 50000));
         message.react(green)
        if (ertucuk.Mainframe.dmMessages) member.send({ content:`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından, **${reason}** sebebiyle, <t:${Math.floor((Date.now() + duration) / 1000)}:R>'ya kadar **sesli kanallarda** susturuldunuz.`}).catch(() => {});
    
        const log = new EmbedBuilder()
        .setDescription(`
        ${member.user.tag} adlı kullanıcıya **${message.author.tag}** tarafından Ses-Mutesi atıldı.    
        `)
        .addFields(
            { name: "Cezalandırılan", value: `${member ? member.toString() : user.username}`, inline: true},
            { name: "Cezalandıran", value: `${message.author}`, inline: true},
            { name: "Ceza Bitiş", value: `<t:${Math.floor((Date.now() + duration) / 1000)}:R>`, inline: true},
            { name: "Ceza Sebebi", value: `\`\`\`fix\n${reason}\n\`\`\``, inline: false},
                        )
      .setFooter({ text:`${moment(Date.now()).format("LLL")}    ` })
    await logChannel.send({ embeds: [log]});
        if (ertucuk.Mainframe.voicemutelimit > 0) {
          if (!vmuteLimit.has(message.author.id)) vmuteLimit.set(message.author.id, 1);
          else vmuteLimit.set(message.author.id, vmuteLimit.get(message.author.id) + 1);
          setTimeout(() => {
            if (vmuteLimit.has(message.author.id)) vmuteLimit.delete(message.author.id);
          }, 1000 * 60 * 60);
        }
        }
        
        if (interaction.values[0] === "vmute2") {
        await interaction.deferUpdate();
        const duration = "1h" ? ms("1h") : undefined;
        const reason = "Özel Odalara İzinsiz Giriş ve Trol";
    
        await coin.findOneAndUpdate({ guildID: member.guild.id, userID: member.user.id }, { $inc: { coin: -20 } }, { upsert: true });
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { VoiceMuteAmount: 1 } }, {upsert: true});
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
        await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { cezapuan: 10 } }, { upsert: true });
        const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });
        if(punishmentLogChannel) punishmentLogChannel.send({content:`${member} üyesi \`voice mute cezası\` alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`});
        member.roles.add(ertum.VMutedRole);
        if (member.voice.channelId && !member.voice.serverMute) {
          member.voice.setMute(true);
          member.roles.add(ertum.VMutedRole);
        }
        db.push(`kullanıcı_${member.id}`,`\` VOICE-MUTE \` [${reason} - <t:${(Date.now() / 1000).toFixed()}>]`);
        message.react(green)
        if(msg) msg.delete();
        await message.channel.send({ content:`${green} ${member.toString()} üyesi, ${message.author} tarafından, \`${reason}\` nedeniyle **sesli kanallarda** susturuldu! `}).then((e) => setTimeout(() => { e.delete(); }, 50000));
         message.react(green)
        if (ertucuk.Mainframe.dmMessages) member.send({ content:`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından, **${reason}** sebebiyle, <t:${Math.floor((Date.now() + duration) / 1000)}:R>'ya kadar **sesli kanallarda** susturuldunuz.`}).catch(() => {});
    
        const log = new EmbedBuilder()
            .setDescription(`
            ${member.user.tag} adlı kullanıcıya **${message.author.tag}** tarafından Ses-Mutesi atıldı.    
            `)
            .addFields(
{ name: "Cezalandırılan", value: `${member ? member.toString() : user.username}`, inline: true},
{ name: "Cezalandıran", value: `${message.author}`, inline: true},
{ name: "Ceza Bitiş", value: `<t:${Math.floor((Date.now() + duration) / 1000)}:R>`, inline: true},
{ name: "Ceza Sebebi", value: `\`\`\`fix\n${reason}\n\`\`\``, inline: false},
            )
    .setFooter({ text:`${moment(Date.now()).format("LLL")}`})
    await logChannel.send({ embeds: [log]});
     
        if (ertucuk.Mainframe.voicemutelimit > 0) {
          if (!vmuteLimit.has(message.author.id)) vmuteLimit.set(message.author.id, 1);
          else vmuteLimit.set(message.author.id, vmuteLimit.get(message.author.id) + 1);
          setTimeout(() => {
            if (vmuteLimit.has(message.author.id)) vmuteLimit.delete(message.author.id);
          }, 1000 * 60 * 60);
        }
        }
        
        if (interaction.values[0] === "vmute3") {
        await interaction.deferUpdate();
        const duration = "5m" ? ms("5m") : undefined;
        const reason = "Küfür, Argo, Hakaret ve Rahatsız Edici Davranış";
    
        await coin.findOneAndUpdate({ guildID: member.guild.id, userID: member.user.id }, { $inc: { coin: -20 } }, { upsert: true });
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { VoiceMuteAmount: 1 } }, {upsert: true});
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
        await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { cezapuan: 10 } }, { upsert: true });
        const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });
        if(punishmentLogChannel) punishmentLogChannel.send({content:`${member} üyesi \`voice mute cezası\` alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`});
        member.roles.add(ertum.VMutedRole);
        if (member.voice.channelId && !member.voice.serverMute) {
          member.voice.setMute(true);
          member.roles.add(ertum.VMutedRole);
        }
        db.push(`kullanıcı_${member.id}`,`\` VOICE-MUTE \` [${reason} - <t:${(Date.now() / 1000).toFixed()}>]`);
        message.react(green)
        if(msg) msg.delete();
        await message.channel.send({ content:`${green} ${member.toString()} üyesi, ${message.author} tarafından, \`${reason}\` nedeniyle **sesli kanallarda** susturuldu! `}).then((e) => setTimeout(() => { e.delete(); }, 50000));
         message.react(green)
        if (ertucuk.Mainframe.dmMessages) member.send({ content:`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından, **${reason}** sebebiyle, <t:${Math.floor((Date.now() + duration) / 1000)}:R>'ya kadar **sesli kanallarda** susturuldunuz.`}).catch(() => {});
    
        const log = new EmbedBuilder()
        .setDescription(`
        ${member.user.tag} adlı kullanıcıya **${message.author.tag}** tarafından Ses-Mutesi atıldı.    
        `)
        .addFields(
            { name: "Cezalandırılan", value: `${member ? member.toString() : user.username}`, inline: true},
            { name: "Cezalandıran", value: `${message.author}`, inline: true},
            { name: "Ceza Bitiş", value: `<t:${Math.floor((Date.now() + duration) / 1000)}:R>`, inline: true},
            { name: "Ceza Sebebi", value: `\`\`\`fix\n${reason}\n\`\`\``, inline: false},
                        )
      .setFooter({ text:`${moment(Date.now()).format("LLL")}    ` })
    await logChannel.send({ embeds: [log]});
     
        if (ertucuk.Mainframe.voicemutelimit > 0) {
          if (!vmuteLimit.has(message.author.id)) vmuteLimit.set(message.author.id, 1);
          else vmuteLimit.set(message.author.id, vmuteLimit.get(message.author.id) + 1);
          setTimeout(() => {
            if (vmuteLimit.has(message.author.id)) vmuteLimit.delete(message.author.id);
          }, 1000 * 60 * 60);
        }
        }
    
        if (interaction.values[0] === "vmute4") {
        await interaction.deferUpdate();
        const duration = "30m" ? ms("30m") : undefined;
        const reason = "Abartı, Küfür ve Taciz Kullanımı";
    
        await coin.findOneAndUpdate({ guildID: member.guild.id, userID: member.user.id }, { $inc: { coin: -20 } }, { upsert: true });
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { VoiceMuteAmount: 1 } }, {upsert: true});
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
        await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { cezapuan: 10 } }, { upsert: true });
        const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });
        if(punishmentLogChannel) punishmentLogChannel.send({content:`${member} üyesi \`voice mute cezası\` alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`});
        member.roles.add(ertum.VMutedRole);
        if (member.voice.channelId && !member.voice.serverMute) {
          member.voice.setMute(true);
          member.roles.add(ertum.VMutedRole);
        }
        db.push(`kullanıcı_${member.id}`,`\` VOICE-MUTE \` [${reason} - <t:${(Date.now() / 1000).toFixed()}>]`);
        message.react(green)
        if(msg) msg.delete();
        await message.channel.send({ content:`${green} ${member.toString()} üyesi, ${message.author} tarafından, \`${reason}\` nedeniyle **sesli kanallarda** susturuldu! `}).then((e) => setTimeout(() => { e.delete(); }, 50000));
         message.react(green)
        if (ertucuk.Mainframe.dmMessages) member.send({ content:`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından, **${reason}** sebebiyle, <t:${Math.floor((Date.now() + duration) / 1000)}:R>'ya kadar **sesli kanallarda** susturuldunuz.`}).catch(() => {});
    
        const log = new EmbedBuilder()
            .setDescription(`
            ${member.user.tag} adlı kullanıcıya **${message.author.tag}** tarafından Ses-Mutesi atıldı.    
            `)
            .addFields(
                { name: "Cezalandırılan", value: `${member ? member.toString() : user.username}`, inline: true},
                { name: "Cezalandıran", value: `${message.author}`, inline: true},
                { name: "Ceza Bitiş", value: `<t:${Math.floor((Date.now() + duration) / 1000)}:R>`, inline: true},
                { name: "Ceza Sebebi", value: `\`\`\`fix\n${reason}\n\`\`\``, inline: false},
                            )
          .setFooter({ text:`${moment(Date.now()).format("LLL")}    ` })
    await logChannel.send({ embeds: [log]});
     
        if (ertucuk.Mainframe.voicemutelimit > 0) {
          if (!vmuteLimit.has(message.author.id)) vmuteLimit.set(message.author.id, 1);
          else vmuteLimit.set(message.author.id, vmuteLimit.get(message.author.id) + 1);
          setTimeout(() => {
            if (vmuteLimit.has(message.author.id)) vmuteLimit.delete(message.author.id);
          }, 1000 * 60 * 60);
        }
        }
        
        if (interaction.values[0] === "vmute5") {
        await interaction.deferUpdate();
        const duration = "2w" ? ms("2w") : undefined;
        const reason = "Dini, Irki ve Siyasi değerlere Hakaret";
    
        await coin.findOneAndUpdate({ guildID: member.guild.id, userID: member.user.id }, { $inc: { coin: -20 } }, { upsert: true });
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { VoiceMuteAmount: 1 } }, {upsert: true});
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
        await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { cezapuan: 10 } }, { upsert: true });
        const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });
        if(punishmentLogChannel) punishmentLogChannel.send({content:`${member} üyesi \`voice mute cezası\` alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`});
        member.roles.add(ertum.VMutedRole);
        if (member.voice.channelId && !member.voice.serverMute) {
          member.voice.setMute(true);
          member.roles.add(ertum.VMutedRole);
        }
        db.push(`kullanıcı_${member.id}`,`\` VOICE-MUTE \` [${reason} - <t:${(Date.now() / 1000).toFixed()}>]`);
        message.react(green)
        if(msg) msg.delete();
        await message.channel.send({ content:`${green} ${member.toString()} üyesi, ${message.author} tarafından, \`${reason}\` nedeniyle **sesli kanallarda** susturuldu! `}).then((e) => setTimeout(() => { e.delete(); }, 50000));
         message.react(green)
        if (ertucuk.Mainframe.dmMessages) member.send({ content:`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından, **${reason}** sebebiyle, <t:${Math.floor((Date.now() + duration) / 1000)}:R>'ya kadar **sesli kanallarda** susturuldunuz.`}).catch(() => {});
    
        const log = new EmbedBuilder()
            .setDescription(`
            ${member.user.tag} adlı kullanıcıya **${message.author.tag}** tarafından Ses-Mutesi atıldı.    
            `)
            .addFields(
                { name: "Cezalandırılan", value: `${member ? member.toString() : user.username}`, inline: true},
                { name: "Cezalandıran", value: `${message.author}`, inline: true},
                { name: "Ceza Bitiş", value: `<t:${Math.floor((Date.now() + duration) / 1000)}:R>`, inline: true},
                { name: "Ceza Sebebi", value: `\`\`\`fix\n${reason}\n\`\`\``, inline: false},
                            )
          .setFooter({ text:`${moment(Date.now()).format("LLL")}`})
    await logChannel.send({ embeds: [log]});
        if (ertucuk.Mainframe.voicemutelimit > 0) {
          if (!vmuteLimit.has(message.author.id)) vmuteLimit.set(message.author.id, 1);
          else vmuteLimit.set(message.author.id, vmuteLimit.get(message.author.id) + 1);
          setTimeout(() => {
            if (vmuteLimit.has(message.author.id)) vmuteLimit.delete(message.author.id);
          }, 1000 * 60 * 60);
        }
        }
        
        if (interaction.values[0] === "vmute6") {
        await interaction.deferUpdate();
        const duration = "1h" ? ms("1h") : undefined;
        const reason = "Sunucu Kötüleme ve Kişisel Hakaret";
    
        await coin.findOneAndUpdate({ guildID: member.guild.id, userID: member.user.id }, { $inc: { coin: -20 } }, { upsert: true });
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { VoiceMuteAmount: 1 } }, {upsert: true});
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
        await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { cezapuan: 10 } }, { upsert: true });
        const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });
        if(punishmentLogChannel) punishmentLogChannel.send({content:`${member} üyesi \`voice mute cezası\` alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`});
        member.roles.add(ertum.VMutedRole);
        if (member.voice.channelId && !member.voice.serverMute) {
          member.voice.setMute(true);
          member.roles.add(ertum.VMutedRole);
        }
        db.push(`kullanıcı_${member.id}`,`\` VOICE-MUTE \` [${reason} - <t:${(Date.now() / 1000).toFixed()}>]`);
        message.react(green)
        if(msg) msg.delete();
        await message.channel.send({ content:`${green} ${member.toString()} üyesi, ${message.author} tarafından, \`${reason}\` nedeniyle **sesli kanallarda** susturuldu! `}).then((e) => setTimeout(() => { e.delete(); }, 50000));
         message.react(green)
        if (ertucuk.Mainframe.dmMessages) member.send({ content:`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından, **${reason}** sebebiyle, <t:${Math.floor((Date.now() + duration) / 1000)}:R>'ya kadar **sesli kanallarda** susturuldunuz.`}).catch(() => {});
    
        const log = new EmbedBuilder()
        .setDescription(`
        ${member.user.tag} adlı kullanıcıya **${message.author.tag}** tarafından Ses-Mutesi atıldı.    
        `)
        .addFields(
            { name: "Cezalandırılan", value: `${member ? member.toString() : user.username}`, inline: true},
            { name: "Cezalandıran", value: `${message.author}`, inline: true},
            { name: "Ceza Bitiş", value: `<t:${Math.floor((Date.now() + duration) / 1000)}:R>`, inline: true},
            { name: "Ceza Sebebi", value: `\`\`\`fix\n${reason}\n\`\`\``, inline: false},
                        )
      .setFooter({ text:`${moment(Date.now()).format("LLL")}`})
    await logChannel.send({ embeds: [log]});
     
        if (ertucuk.Mainframe.voicemutelimit > 0) {
          if (!vmuteLimit.has(message.author.id)) vmuteLimit.set(message.author.id, 1);
          else vmuteLimit.set(message.author.id, vmuteLimit.get(message.author.id) + 1);
          setTimeout(() => {
            if (vmuteLimit.has(message.author.id)) vmuteLimit.delete(message.author.id);
          }, 1000 * 60 * 60);
        }
        }
        
        if (interaction.values[0] === "vmute7") {
        await interaction.deferUpdate();
        const duration = "30m" ? ms("30m") : undefined;
        const reason = "Soundpad, Bass gibi Uygulama Kullanmak";
    
        await coin.findOneAndUpdate({ guildID: member.guild.id, userID: member.user.id }, { $inc: { coin: -20 } }, { upsert: true });
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { VoiceMuteAmount: 1 } }, {upsert: true});
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
        await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { cezapuan: 10 } }, { upsert: true });
        const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });
        if(punishmentLogChannel) punishmentLogChannel.send({content:`${member} üyesi \`voice mute cezası\` alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`});
        member.roles.add(ertum.VMutedRole);
        if (member.voice.channelId && !member.voice.serverMute) {
          member.voice.setMute(true);
          member.roles.add(ertum.VMutedRole);
        }
        db.push(`kullanıcı_${member.id}`,`\` VOICE-MUTE \` [${reason} - <t:${(Date.now() / 1000).toFixed()}>]`);
        message.react(green)
        if(msg) msg.delete();
        await message.channel.send({ content:`${green} ${member.toString()} üyesi, ${message.author} tarafından, \`${reason}\` nedeniyle **sesli kanallarda** susturuldu! `}).then((e) => setTimeout(() => { e.delete(); }, 50000));
         message.react(green)
        if (ertucuk.Mainframe.dmMessages) member.send({ content:`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından, **${reason}** sebebiyle, <t:${Math.floor((Date.now() + duration) / 1000)}:R>'ya kadar **sesli kanallarda** susturuldunuz.`}).catch(() => {});
    
        const log = new EmbedBuilder()
            .setDescription(`
            ${member.user.tag} adlı kullanıcıya **${message.author.tag}** tarafından Ses-Mutesi atıldı.    
            `)
            .addFields(
                { name: "Cezalandırılan", value: `${member ? member.toString() : user.username}`, inline: true},
                { name: "Cezalandıran", value: `${message.author}`, inline: true},
                { name: "Ceza Bitiş", value: `<t:${Math.floor((Date.now() + duration) / 1000)}:R>`, inline: true},
                { name: "Ceza Sebebi", value: `\`\`\`fix\n${reason}\n\`\`\``, inline: false},
                            )
          .setFooter({ text:`${moment(Date.now()).format("LLL")}`})
    await logChannel.send({ embeds: [log]});
        if (ertucuk.Mainframe.voicemutelimit > 0) {
          if (!vmuteLimit.has(message.author.id)) vmuteLimit.set(message.author.id, 1);
          else vmuteLimit.set(message.author.id, vmuteLimit.get(message.author.id) + 1);
          setTimeout(() => {
            if (vmuteLimit.has(message.author.id)) vmuteLimit.delete(message.author.id);
          }, 1000 * 60 * 60);
        }
        }

        })
        }


     },

  };