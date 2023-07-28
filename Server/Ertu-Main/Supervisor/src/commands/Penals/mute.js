const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionsBitField, PermissionFlagsBits } = require("discord.js");
const coin = require("../../schemas/coin");
const ceza = require("../../schemas/ceza");
const cezapuan = require("../../schemas/cezapuan")
const ertum = require("../../../../../../Global/Settings/Setup.json")
const settings = require("../../../../../../Global/Settings/System");
const { BsonDatabase,JsonDatabase,YamlDatabase } = require("five.db");
const db = new YamlDatabase();
const muteLimit = new Map();
const moment = require("moment");
moment.locale("tr");
const ms = require("ms");
const kanal = require("../../../../../../Global/Settings/AyarName");

module.exports = {
    name: "mute",
    description: "Belirttiğiniz kullanıcıyı metin kanallarından susturur.",
    category: "PENAL",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: [],
      usage: ".mute <@user/ID>",
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

      let kanallar = kanal.KomutKullanımKanalİsim;
      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !ertum.CMuteHammer.some(x => message.member.roles.cache.has(x))) 
    {
    
    message.channel.send({ content:"Yeterli yetkin bulunmuyor!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return } 
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) { message.channel.send({ content:"Bir üye belirtmelisin!"}) 
    
    return }
    if (ertum.MutedRole.some(x => member.roles.cache.has(x))) { message.channel.send({ content:"Bu üye zaten susturulmuş!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
    
    return }
    if (message.member.roles.highest.position <= member.roles.highest.position) 
    {
    
    message.channel.send({ content:"Kendinle aynı yetkide ya da daha yetkili olan birini susturamazsın!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return
    }
    if (!member.manageable) 
    {
    
    message.channel.send({ content:"Bu üyeyi susturamıyorum!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return
    }
    if (settings.Mainframe.chatmutelimit > 0 && muteLimit.has(message.author.id) && muteLimit.get(message.author.id) == settings.Mainframe.chatmutelimit) 
    {
    
    message.channel.send({ content:"Saatlik susturma sınırına ulaştın!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return
    }

    let logChannel = client.channels.cache.find(x => x.name === "mute_log");
    let punishmentLogChannel = client.channels.cache.find(x => x.name === "cezapuan_log");
    if(!logChannel) {
      let hello = new Error("MUTE LOG KANALI AYARLANMAMIS! LUTFEN SETUPTAN KURULUMU YAPINIZ!");
      console.log(hello);
    }
    if(!punishmentLogChannel) {
      let hello = new Error("CEZA PUAN LOG KANALI AYARLANMAMIS! LUTFEN SETUPTAN KURULUMU YAPINIZ!");
      console.log(hello);
    }


    const row = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('mute')
            .setPlaceholder(`Metin kanalları cezaları`)
            .addOptions([
                { label: 'Kışkırtma, Trol ve Dalgacı Davranış', description: '5 Dakika', value: 'mute1', emoji: '1127327012701360148'},
                { label: 'Flood,Spam ve Capslock Kullanımı', description: '5 Dakika', value: 'mute2', emoji: '1127327012701360148'},
                { label: 'Metin Kanallarını Amacı Dışında Kullanmak', description: '10 Dakika', value: 'mute3', emoji: '1127327012701360148'},
                { label: 'Küfür, Argo, Hakaret ve Rahatsız Edici Davranış', description: '15 Dakika', value: 'mute4', emoji: '1127327012701360148'},
                { label: 'Abartı, Küfür ve Taciz Kullanımı', description: '30 Dakika', value: 'mute5', emoji: '1127327012701360148'},
                { label: 'Dini, Irki ve Siyasi değerlere Hakaret', description: '14 Gün', value: 'mute6', emoji: '1127327012701360148'},
                { label: 'Sunucu Kötüleme ve Kişisel Hakaret', description: '1 Saat', value: 'mute7', emoji: '1127327012701360148'},
             ]),
    );

    const duration = args[1] ? ms(args[1]) : undefined;
 
    if (duration) {
      const reason = args.slice(2).join(" ") || "Belirtilmedi!";
    
      await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
      await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
      await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { MuteAmount: 1 } }, {upsert: true});
      await coin.findOneAndUpdate({ guildID: member.guild.id, userID: member.user.id }, { $inc: { coin: -20 } }, { upsert: true });
      await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { cezapuan: 20 } }, { upsert: true });
      const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });
      if(punishmentLogChannel) punishmentLogChannel.send({ content:`${member} üyesi \`chat mute cezası\` alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`});
      
      member.roles.add(ertum.MutedRole);
      db.push(`kullanıcı_${member.id}`,`\` MUTE \` [${reason} - <t:${(Date.now() / 1000).toFixed()}>]`);
      if(ananin) ananin.delete();
      await message.channel.send({ content:` ${member.toString()} üyesi, ${message.author} tarafından, \`${reason}\` nedeniyle susturuldu! `}).then((e) => setTimeout(() => { e.delete(); }, 50000));
      if (settings.Mainframe.dmMessages) member.send({ content:`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından, **${reason}** sebebiyle, <t:${Math.floor((Date.now() + duration) / 1000)}:R>'ya kadar susturuldunuz.`}).catch(() => {});

      setTimeout(async () => {
        let cezaBittiLog = new EmbedBuilder()
        .setAuthor({ name: member.displayName, iconURL: member.user.avatarURL({ dynamic: true }) })
        .setDescription(`${member} adlı üyenin chat mute süresi bitti.`)
        .setTimestamp()
        member.roles.remove(ertum.MutedRole);
        await logChannel.send({ embeds : [cezaBittiLog] }); 
      }, duration);

      const log = new EmbedBuilder()
        .setDescription(`
        ${member.user.tag} adlı kullanıcıya **${message.author.tag}** tarafından Chat-Mutesi atıldı.    
        `)
        .addFields(    
 { name: "Cezalandırılan", value: `  ${member ? member.toString() : user.username} `, inline: true},    
 { name: "Cezalandıran", value: `${message.author}`, inline: true},
 { name: "Ceza Bitiş", value: `<t:${Math.floor((Date.now() + duration) / 1000)}:R>`, inline: true},
 { name: "Ceza Sebebi", value: `\`\`\`fix\n${reason}\n\`\`\``, inline: false},
        )
        .setFooter({ text:`${moment(Date.now()).format("LLL")}    ` })
        await logChannel.send({ embeds : [log]});
    
      if (settings.Mainframe.chatmutelimit > 0) {
        if (!muteLimit.has(message.author.id)) muteLimit.set(message.author.id, 1);
        else muteLimit.set(message.author.id, muteLimit.get(message.author.id) + 1);
        setTimeout(() => {
          if (muteLimit.has(message.author.id)) muteLimit.delete(message.author.id);
        }, 1000 * 60 * 60);
      }

    } else if (!duration) {
      var ananin = await message.channel.send({ embeds: [new EmbedBuilder()
      .setAuthor({name:message.guild.name,iconURL:message.guild.iconURL()})
      .setDescription(`Aşağıda bulunan menüden metin kanallarından susturmak istediğiniz ${member.toString()} için uygun olan ceza sebebini ve süresini seçiniz!`)],
       components: [row]})
    }
    
   if (ananin) {
   const filter = i => i.user.id === message.member.id;
   const collector = await ananin.createMessageComponentCollector({ filter: filter, time: 30000 });
        
    collector.on("collect", async (interaction) => {
    
    if (interaction.values[0] === "mute1") {
    await interaction.deferUpdate();
    const duration = "5m" ? ms("5m") : undefined;
    const reason = "Kışkırtma, Trol ve Dalgacı Davranış";

    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { MuteAmount: 1 } }, {upsert: true});
    await coin.findOneAndUpdate({ guildID: member.guild.id, userID: member.user.id }, { $inc: { coin: -20 } }, { upsert: true });
    await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { cezapuan: 8 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });
    if(punishmentLogChannel) punishmentLogChannel.send({ content:`${member} üyesi \`chat mute cezası\` alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`});
    
    member.roles.add(ertum.MutedRole);
     db.push(`kullanıcı_${member.id}`,`\` MUTE \` [${reason} - <t:${(Date.now() / 1000).toFixed()}>]`);
    if(ananin) ananin.delete();
    interaction.followUp({ content:` ${member.toString()} üyesi, ${message.author} tarafından, \`${reason}\` nedeniyle susturuldu! `}).then((e) => setTimeout(() => { e.delete(); }, 50000));
    if (settings.Mainframe.dmMessages) member.send({ content:`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından, **${reason}** sebebiyle, <t:${Math.floor((Date.now() + duration) / 1000)}:R>'ya kadar susturuldunuz.`}).catch(() => {});
    setTimeout(async () => {
      let cezaBittiLog = new EmbedBuilder()
      .setAuthor({ name: member.displayName })
      member.roles.remove(ertum.MutedRole);
      await logChannel.send({ embeds : [cezaBittiLog]}); 
    }, duration)
    const log = new EmbedBuilder()
        .setDescription(`
        ${member.user.tag} adlı kullanıcıya **${message.author.tag}** tarafından Chat-Mutesi atıldı.    
        `)
        .addFields(    
          { name: "Cezalandırılan", value: `  ${member ? member.toString() : user.username} `, inline: true},    
          { name: "Cezalandıran", value: `${message.author}`, inline: true},
          { name: "Ceza Bitiş", value: `<t:${Math.floor((Date.now() + duration) / 1000)}:R>`, inline: true},
          { name: "Ceza Sebebi", value: `\`\`\`fix\n${reason}\n\`\`\``, inline: false},
                 )
      .setFooter({ text:`${moment(Date.now()).format("LLL")}    ` })
  await logChannel.send({ embeds : [log]});

          if (settings.Mainframe.chatmutelimit > 0) {
        if (!muteLimit.has(message.author.id)) muteLimit.set(message.author.id, 1);
        else muteLimit.set(message.author.id, muteLimit.get(message.author.id) + 1);
        setTimeout(() => {
          if (muteLimit.has(message.author.id)) muteLimit.delete(message.author.id);
        }, 1000 * 60 * 60);
      }
    }
    
    if (interaction.values[0] === "mute2") {
    await interaction.deferUpdate();
    const duration = "5m" ? ms("5m") : undefined;
    const reason = "Flood,Spam ve Capslock Kullanımı";
    
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { MuteAmount: 1 } }, {upsert: true});
    await coin.findOneAndUpdate({ guildID: member.guild.id, userID: member.user.id }, { $inc: { coin: -20 } }, { upsert: true });
    await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { cezapuan: 8 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });
    if(punishmentLogChannel) punishmentLogChannel.send({ content:`${member} üyesi \`chat mute cezası\` alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`});
    
    member.roles.add(ertum.MutedRole);
            db.push(`kullanıcı_${member.id}`,`\` MUTE \` [${reason} - <t:${(Date.now() / 1000).toFixed()}>]`);
    if(ananin) ananin.delete();
    interaction.followUp({ content:` ${member.toString()} üyesi, ${message.author} tarafından, \`${reason}\` nedeniyle susturuldu! `}).then((e) => setTimeout(() => { e.delete(); }, 50000));
    if (settings.Mainframe.dmMessages) member.send({ content:`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından, **${reason}** sebebiyle, <t:${Math.floor((Date.now() + duration) / 1000)}:R>'ya kadar susturuldunuz.`}).catch(() => {});
    


    const log = new EmbedBuilder()
        .setDescription(`
        ${member.user.tag} adlı kullanıcıya **${message.author.tag}** tarafından Chat-Mutesi atıldı.    
        `)
        .addFields(    
          { name: "Cezalandırılan", value: `  ${member ? member.toString() : user.username} `, inline: true},    
          { name: "Cezalandıran", value: `${message.author}`, inline: true},
          { name: "Ceza Bitiş", value: `<t:${Math.floor((Date.now() + duration) / 1000)}:R>`, inline: true},
          { name: "Ceza Sebebi", value: `\`\`\`fix\n${reason}\n\`\`\``, inline: false},
                 )
      .setFooter({ text:`${moment(Date.now()).format("LLL")}    ` })
      await logChannel.send({ embeds : [log]});

    if (settings.Mainframe.chatmutelimit > 0) {
      if (!muteLimit.has(message.author.id)) muteLimit.set(message.author.id, 1);
      else muteLimit.set(message.author.id, muteLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (muteLimit.has(message.author.id)) muteLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
  }
    
    if (interaction.values[0] === "mute3") {
    await interaction.deferUpdate();
    const duration = "10m" ? ms("10m") : undefined;
    const reason = "Metin Kanallarını Amacı Dışında Kullanmak";
    
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { MuteAmount: 1 } }, {upsert: true});
    await coin.findOneAndUpdate({ guildID: member.guild.id, userID: member.user.id }, { $inc: { coin: -20 } }, { upsert: true });
    await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { cezapuan: 8 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });
    if(punishmentLogChannel) punishmentLogChannel.send({ content:`${member} üyesi \`chat mute cezası\` alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`});
    
    member.roles.add(ertum.MutedRole);
            db.push(`kullanıcı_${member.id}`,`\` MUTE \` [${reason} - <t:${(Date.now() / 1000).toFixed()}>]`);
    if(ananin) ananin.delete();
    interaction.followUp({ content:` ${member.toString()} üyesi, ${message.author} tarafından, \`${reason}\` nedeniyle susturuldu! `}).then((e) => setTimeout(() => { e.delete(); }, 50000));
    if (settings.Mainframe.dmMessages) member.send({ content:`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından, **${reason}** sebebiyle, <t:${Math.floor((Date.now() + duration) / 1000)}:R>'ya kadar susturuldunuz.`}).catch(() => {});
    
    const log = new EmbedBuilder()
    .setDescription(`
    ${member.user.tag} adlı kullanıcıya **${message.author.tag}** tarafından Chat-Mutesi atıldı.    
    `)
    .addFields(    
      { name: "Cezalandırılan", value: `  ${member ? member.toString() : user.username} `, inline: true},    
      { name: "Cezalandıran", value: `${message.author}`, inline: true},
      { name: "Ceza Bitiş", value: `<t:${Math.floor((Date.now() + duration) / 1000)}:R>`, inline: true},
      { name: "Ceza Sebebi", value: `\`\`\`fix\n${reason}\n\`\`\``, inline: false},
             )
      .setFooter({ text:`${moment(Date.now()).format("LLL")}    ` })
      await logChannel.send({ embeds : [log]});
    
    if (settings.Mainframe.chatmutelimit > 0) {
      if (!muteLimit.has(message.author.id)) muteLimit.set(message.author.id, 1);
      else muteLimit.set(message.author.id, muteLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (muteLimit.has(message.author.id)) muteLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
  }

    if (interaction.values[0] === "mute4") {
    await interaction.deferUpdate();
    const duration = "15m" ? ms("15m") : undefined;
    const reason = "Küfür, Argo, Hakaret ve Rahatsız Edici Davranış";
    
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { MuteAmount: 1 } }, {upsert: true});
    await coin.findOneAndUpdate({ guildID: member.guild.id, userID: member.user.id }, { $inc: { coin: -20 } }, { upsert: true });
    await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { cezapuan: 8 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });
    if(punishmentLogChannel) punishmentLogChannel.send({ content:`${member} üyesi \`chat mute cezası\` alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`});
    
    member.roles.add(ertum.MutedRole);
            db.push(`kullanıcı_${member.id}`,`\` MUTE \` [${reason} - <t:${(Date.now() / 1000).toFixed()}>]`);
    if(ananin) ananin.delete();
    interaction.followUp({ content:` ${member.toString()} üyesi, ${message.author} tarafından, \`${reason}\` nedeniyle susturuldu! `}).then((e) => setTimeout(() => { e.delete(); }, 50000));
    if (settings.Mainframe.dmMessages) member.send({ content:`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından, **${reason}** sebebiyle, <t:${Math.floor((Date.now() + duration) / 1000)}:R>'ya kadar susturuldunuz.`}).catch(() => {});
    
    const log = new EmbedBuilder()
        .setDescription(`
        ${member.user.tag} adlı kullanıcıya **${message.author.tag}** tarafından Chat-Mutesi atıldı.    
        `)
        .addFields(    
          { name: "Cezalandırılan", value: `  ${member ? member.toString() : user.username} `, inline: true},    
          { name: "Cezalandıran", value: `${message.author}`, inline: true},
          { name: "Ceza Bitiş", value: `<t:${Math.floor((Date.now() + duration) / 1000)}:R>`, inline: true},
          { name: "Ceza Sebebi", value: `\`\`\`fix\n${reason}\n\`\`\``, inline: false},
                 )
      .setFooter({ text:`${moment(Date.now()).format("LLL")}    ` })
      await logChannel.send({ embeds : [log]});
    
    if (settings.Mainframe.chatmutelimit > 0) {
      if (!muteLimit.has(message.author.id)) muteLimit.set(message.author.id, 1);
      else muteLimit.set(message.author.id, muteLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (muteLimit.has(message.author.id)) muteLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
  }
    
    if (interaction.values[0] === "mute5") {
    await interaction.deferUpdate();
    const duration = "30m" ? ms("30m") : undefined;
    const reason = "Abartı, Küfür ve Taciz Kullanımı";
    
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { MuteAmount: 1 } }, {upsert: true});
    await coin.findOneAndUpdate({ guildID: member.guild.id, userID: member.user.id }, { $inc: { coin: -20 } }, { upsert: true });
    await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { cezapuan: 8 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });
    if(punishmentLogChannel) punishmentLogChannel.send({ content:`${member} üyesi \`chat mute cezası\` alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`});
    
    member.roles.add(ertum.MutedRole);
            db.push(`kullanıcı_${member.id}`,`\` MUTE \` [${reason} - <t:${(Date.now() / 1000).toFixed()}>]`);
    if(ananin) ananin.delete();
    interaction.followUp({ content:` ${member.toString()} üyesi, ${message.author} tarafından, \`${reason}\` nedeniyle susturuldu! `}).then((e) => setTimeout(() => { e.delete(); }, 50000));
    if (settings.Mainframe.dmMessages) member.send({ content:`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından, **${reason}** sebebiyle, <t:${Math.floor((Date.now() + duration) / 1000)}:R>'ya kadar susturuldunuz.`}).catch(() => {});
    
    const log = new EmbedBuilder()
    .setDescription(`
    ${member.user.tag} adlı kullanıcıya **${message.author.tag}** tarafından Chat-Mutesi atıldı.    
    `)
    .addFields(    
      { name: "Cezalandırılan", value: `  ${member ? member.toString() : user.username} `, inline: true},    
      { name: "Cezalandıran", value: `${message.author}`, inline: true},
      { name: "Ceza Bitiş", value: `<t:${Math.floor((Date.now() + duration) / 1000)}:R>`, inline: true},
      { name: "Ceza Sebebi", value: `\`\`\`fix\n${reason}\n\`\`\``, inline: false},
             )
    
      .setFooter({ text:`${moment(Date.now()).format("LLL")}    ` })
      await logChannel.send({ embeds : [log]});
    
    if (settings.Mainframe.chatmutelimit > 0) {
      if (!muteLimit.has(message.author.id)) muteLimit.set(message.author.id, 1);
      else muteLimit.set(message.author.id, muteLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (muteLimit.has(message.author.id)) muteLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
  }
    
    if (interaction.values[0] === "mute6") {
    await interaction.deferUpdate();
    const duration = "2w" ? ms("2w") : undefined;
    const reason = "Dini, Irki ve Siyasi değerlere Hakaret";
    
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { MuteAmount: 1 } }, {upsert: true});
    await coin.findOneAndUpdate({ guildID: member.guild.id, userID: member.user.id }, { $inc: { coin: -20 } }, { upsert: true });
    await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { cezapuan: 8 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });
    if(punishmentLogChannel) punishmentLogChannel.send({ content:`${member} üyesi \`chat mute cezası\` alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`});
    
    member.roles.add(ertum.MutedRole);
            db.push(`kullanıcı_${member.id}`,`\` MUTE \` [${reason} - <t:${(Date.now() / 1000).toFixed()}>]`);
    if(ananin) ananin.delete();
    interaction.followUp({ content:` ${member.toString()} üyesi, ${message.author} tarafından, \`${reason}\` nedeniyle susturuldu! `}).then((e) => setTimeout(() => { e.delete(); }, 50000));
    if (settings.Mainframe.dmMessages) member.send({ content:`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından, **${reason}** sebebiyle, <t:${Math.floor((Date.now() + duration) / 1000)}:R>'ya kadar susturuldunuz.`}).catch(() => {});
    
    const log = new EmbedBuilder()
        .setDescription(`
        ${member.user.tag} adlı kullanıcıya **${message.author.tag}** tarafından Chat-Mutesi atıldı.    

        `)
        .addFields(    
          { name: "Cezalandırılan", value: `  ${member ? member.toString() : user.username} `, inline: true},    
          { name: "Cezalandıran", value: `${message.author}`, inline: true},
          { name: "Ceza Bitiş", value: `<t:${Math.floor((Date.now() + duration) / 1000)}:R>`, inline: true},
          { name: "Ceza Sebebi", value: `\`\`\`fix\n${reason}\n\`\`\``, inline: false},
                 )
      .setFooter({ text:`${moment(Date.now()).format("LLL")}    ` })
      await logChannel.send({ embeds : [log]});
    
    if (settings.Mainframe.chatmutelimit > 0) {
      if (!muteLimit.has(message.author.id)) muteLimit.set(message.author.id, 1);
      else muteLimit.set(message.author.id, muteLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (muteLimit.has(message.author.id)) muteLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
  }
    
    if (interaction.values[0] === "mute7") {
    await interaction.deferUpdate();
    const duration = "1h" ? ms("1h") : undefined;
    const reason = "Sunucu Kötüleme ve Kişisel Hakaret";
    
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { MuteAmount: 1 } }, {upsert: true});
    await coin.findOneAndUpdate({ guildID: member.guild.id, userID: member.user.id }, { $inc: { coin: -20 } }, { upsert: true });
    await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { cezapuan: 8 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });
    if(punishmentLogChannel) punishmentLogChannel.send({ content:`${member} üyesi \`chat mute cezası\` alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`});
    
    member.roles.add(ertum.MutedRole);
    db.push(`kullanıcı_${member.id}`,`\` MUTE \` [${reason} - <t:${(Date.now() / 1000).toFixed()}>]`);
    if(ananin) ananin.delete();
    interaction.followUp({ content:` ${member.toString()} üyesi, ${message.author} tarafından, \`${reason}\` nedeniyle susturuldu! `}).then((e) => setTimeout(() => { e.delete(); }, 50000));
    if (settings.Mainframe.dmMessages) member.send({ content:`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından, **${reason}** sebebiyle, <t:${Math.floor((Date.now() + duration) / 1000)}:R>'ya kadar susturuldunuz.`}).catch(() => {});
    
    const log = new EmbedBuilder()
    .setDescription(`
  ${member.user.tag} adlı kullanıcıya **${message.author.tag}** tarafından Chat-Mutesi atıldı.    
    `)
    .addFields(    
      { name: "Cezalandırılan", value: `  ${member ? member.toString() : user.username} `, inline: true},    
      { name: "Cezalandıran", value: `${message.author}`, inline: true},
      { name: "Ceza Bitiş", value: `<t:${Math.floor((Date.now() + duration) / 1000)}:R>`, inline: true},
      { name: "Ceza Sebebi", value: `\`\`\`fix\n${reason}\n\`\`\``, inline: false},
    )
      .setFooter({ text:`${moment(Date.now()).format("LLL")}    ` })
      await logChannel.send({ embeds : [log]});
    
    if (settings.Mainframe.chatmutelimit > 0) {
      if (!muteLimit.has(message.author.id)) muteLimit.set(message.author.id, 1);
      else muteLimit.set(message.author.id, muteLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (muteLimit.has(message.author.id)) muteLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
  }
    })
    }
     },

    onSlash: async function (client, interaction) { },
  };