const { ApplicationCommandOptionType, PermissionsBitField,ActionRowBuilder, StringSelectMenuBuilder,EmbedBuilder } = require("discord.js");
const moment = require("moment");
const ceza = require("../../../../../../Global/Schemas/ceza");
const cezapuan = require("../../../../../../Global/Schemas/cezapuan")
const jailLimit = new Map();
const { BsonDatabase,JsonDatabase,YamlDatabase } = require("five.db");
const db = new YamlDatabase();
const ms = require("ms")
moment.locale("tr");
const ertum = require("../../../../../../Global/Settings/Setup.json")
const ertucuk = require("../../../../../../Global/Settings/System");
const { red, green  } = require("../../../../../../Global/Settings/Emojis.json")
const kanal = require("../../../../../../Global/Settings/AyarName");

module.exports = {
    name: "jail",
    description: "Bellirttiğiniz kullanıcıyı karantinaya atar",
    category: "STAFF",
    cooldown: 0,
    command: {
      enabled: true,  
      aliases: ["karantina","cezalı"],
      usage: ".jail <@user/ID>",
    },
  

    onLoad: function (client) { },

    onCommand: async function (client, message, args) {

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
        if (ertucuk.Mainframe.jaillimit > 0 && jailLimit.has(message.author.id) && jailLimit.get(message.author.id) == ertucuk.Mainframe.jaillimit) 
        {
        message.react(`${client.emoji("ertu_carpi")}`)
        message.channel.send({ content:"Saatlik jail sınırına ulaştın!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }

        let logChannel = client.channels.cache.find(x => x.name === "jail_log");
        let punishmentLogChannel = client.channels.cache.find(x => x.name === "cezapuan_log");
        if(!logChannel) {
          let hello = new Error("JAİL LOG KANALI AYARLANMAMIS! LUTFEN SETUPTAN KURULUMU YAPINIZ!");
          console.log(hello);
        }
        if(!punishmentLogChannel) {
          let hello = new Error("CEZA PUAN LOG KANALI AYARLANMAMIS! LUTFEN SETUPTAN KURULUMU YAPINIZ!");
          console.log(hello);
        }
        
          
        const row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('jail')
                .setPlaceholder(`Jail cezaları`)
                .addOptions([
                    { label: 'Cinsellik, taciz ve ağır hakaret', description: '1 Hafta', value: 'jail1', emoji: '1127327012701360148'},
                    { label: 'Sunucu kurallarına uyum sağlamamak', description: '3 Gün', value: 'jail2', emoji: '1127327012701360148'},
                    { label: 'Sesli/Mesajlı/Ekran P. DM Taciz)', description: '1 Gün', value: 'jail3', emoji: '1127327012701360148'},
                    { label: 'Dini, Irki ve Siyasi değerlere Hakaret', description: '1 Ay', value: 'jail4', emoji: '1127327012701360148'},
                    { label: 'Abartı rahatsız edici yaklaşımda bulunmak', description: '2 Hafta', value: 'jail5', emoji: '1127327012701360148'},
                    { label: 'Sunucu içerisi abartı trol / Kayıt trol yapmak', description: '3 Gün', value: 'jail6', emoji: '1127327012701360148'},
                    { label: 'Sunucu Kötüleme / Saygısız Davranış', description: '1 Ay', value: 'jail7', emoji: '1127327012701360148'},
                 ]),
        );
    
    const duration = args[1] ? ms(args[1]) : undefined;
    
    if (duration) {
      const reason = args.slice(2).join(" ") || "Belirtilmedi!";
    
      await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
      await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
      await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { JailAmount: 1 } }, {upsert: true});
      
      await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { cezapuan: 15 } }, { upsert: true });
      const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });
      punishmentLogChannel.send({ content: `${member} üyesi ban cezası alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`})
      member.roles.cache.has(ertum.BoosterRole) ? member.roles.set([ertum.BoosterRole, ertum.JailedRoles[0]]) : member.roles.set(ertum.JailedRoles)
      message.react(`${client.emoji("ertu_onay")}`)
      const penal = await client.penalize(message.guild.id, member.id, 'Jail', true, message.author.id, reason, true, Math.floor(Date.now() + duration))
      if(msg) msg.delete();
      await message.channel.send({ embeds: [new EmbedBuilder().setDescription(` ${member.toString()} kullanıcısı başarıyla **"${reason}"** sebebiyle <t:${Math.floor((Date.now() + duration) / 1000)}:R> süre boyunca karantinaya atıldı. (Ceza Numarası: \`#${penal.id}\`)`)]})
      if (ertucuk.Mainframe.dmMessages) member.send({ content:`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından, **${reason}** sebebiyle, <t:${Math.floor((Date.now() + duration) / 1000)}:R>'ya kadar jaillendiniz.`}).catch(() => {});
      
      const log = new EmbedBuilder()
            .setDescription(`
           **${member.user.tag}** adlı kullanıcıya **${message.author.tag}** tarafından Jail atıldı. Ceza Numarası: (\`${penal.id}\`)        
            `)
            .addFields(
{ name: "Cezalandırılan", value: `${member ? member.toString() : user.username}`, inline: true},
{ name: "Cezalandıran", value: `${message.author}`, inline: true},
{ name: "Ceza Bitiş", value: `<t:${Math.floor((Date.now() + duration) / 1000)}:R>`, inline: true},
{ name: "Ceza Sebebi", value: `\`\`\`fix\n${reason}\n\`\`\``, inline: false},
            )
            .setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})`})
          await logChannel.send({ embeds : [log]});
        
    
      if (ertucuk.Mainframe.jaillimit > 0) {
        if (!jailLimit.has(message.author.id)) jailLimit.set(message.author.id, 1);
        else jailLimit.set(message.author.id, jailLimit.get(message.author.id) + 1);
        setTimeout(() => {
          if (jailLimit.has(message.author.id)) jailLimit.delete(message.author.id);
        }, 1000 * 60 * 60);
      }
    } else if (!duration) {
      var msg = await message.channel.send({ embeds: [new EmbedBuilder()
      .setAuthor({name:message.guild.name,iconURL:message.guild.iconURL()})
      .setDescription(`Aşağıda bulunan menüden cezalıya atmak istediğiniz ${member.toString()} için uygun olan ceza sebebini ve süresini seçiniz!`)],
      components: [row]})
    }
    
    if (msg) {
        const filter = i => i.user.id === message.member.id;
        const collector = await msg.createMessageComponentCollector({ filter: filter, time: 30000 });

    collector.on("collect", async (interaction) => {
    
    if (interaction.values[0] === "jail1") {
    await interaction.deferUpdate();
    const duration = "1w" ? ms("1w") : undefined;
    const reason = "Cinsellik, taciz ve ağır hakaret";
    
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { JailAmount: 1 } }, {upsert: true});
    
    await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { cezapuan: 15 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });
    punishmentLogChannel.send({ content: `${member} üyesi ban cezası alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`})
    member.roles.cache.has(ertum.BoosterRole) ? member.roles.set([ertum.BoosterRole, ertum.JailedRoles[0]]) : member.roles.set(ertum.JailedRoles)
    message.react(`${client.emoji("ertu_onay")}`)
    const penal = await client.penalize(message.guild.id, member.id, 'Jail', true, message.author.id, reason, true, Math.floor(Date.now() + duration))
    if(msg) msg.delete();
    await message.channel.send({ embeds: [new EmbedBuilder().setDescription(` ${member.toString()} kullanıcısı başarıyla **"${reason}"** sebebiyle <t:${Math.floor((Date.now() + duration) / 1000)}:R> süre boyunca karantinaya atıldı. (Ceza Numarası: \`#${penal.id}\`)`)]})
    if (ertucuk.Mainframe.dmMessages) member.send({ content:`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından, **${reason}** sebebiyle, <t:${Math.floor((Date.now() + duration) / 1000)}:R>'ya kadar jaillendiniz.`}).catch(() => {});
    
    const log = new EmbedBuilder()
    .setDescription(`
   **${member.user.tag}** adlı kullanıcıya **${message.author.tag}** tarafından Jail atıldı. Ceza Numarası: (\`${penal.id}\`)        
    `)
    .addFields(
        { name: "Cezalandırılan", value: `${member ? member.toString() : user.username}`, inline: true},
        { name: "Cezalandıran", value: `${message.author}`, inline: true},
        { name: "Ceza Bitiş", value: `<t:${Math.floor((Date.now() + duration) / 1000)}:R>`, inline: true},
        { name: "Ceza Sebebi", value: `\`\`\`fix\n${reason}\n\`\`\``, inline: false},
                    )
   .setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
    
    await logChannel.send({ embeds: [log]});
    
    if (ertucuk.Mainframe.jaillimit > 0) {
      if (!jailLimit.has(message.author.id)) jailLimit.set(message.author.id, 1);
      else jailLimit.set(message.author.id, jailLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (jailLimit.has(message.author.id)) jailLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
    }
    
    if (interaction.values[0] === "jail2") {
    await interaction.deferUpdate();
    const duration = "3d" ? ms("3d") : undefined;
    const reason = "Sunucu kurallarına uyum sağlamamak";
    
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { JailAmount: 1 } }, {upsert: true});
    
    await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { cezapuan: 15 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });
    punishmentLogChannel.send({ content: `${member} üyesi ban cezası alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`})
    member.roles.cache.has(ertum.BoosterRole) ? member.roles.set([ertum.BoosterRole, ertum.JailedRoles[0]]) : member.roles.set(ertum.JailedRoles)
    message.react(`${client.emoji("ertu_onay")}`)
    const penal = await client.penalize(message.guild.id, member.id, 'Jail', true, message.author.id, reason, true, Math.floor(Date.now() + duration))
    
    if(msg) msg.delete();
    await message.channel.send({ embeds: [new EmbedBuilder().setDescription(` ${member.toString()} kullanıcısı başarıyla **"${reason}"** sebebiyle <t:${Math.floor((Date.now() + duration) / 1000)}:R> süre boyunca karantinaya atıldı. (Ceza Numarası: \`#${penal.id}\`)`)]})
    if (ertucuk.Mainframe.dmMessages) member.send({ content:`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından, **${reason}** sebebiyle, <t:${Math.floor((Date.now() + duration) / 1000)}:R>'ya kadar jaillendiniz.`}).catch(() => {});
    
    const log = new EmbedBuilder()
    .setDescription(`
   **${member.user.tag}** adlı kullanıcıya **${message.author.tag}** tarafından Jail atıldı. Ceza Numarası: (\`${penal.id}\`)        
    `)
    .addFields(
        { name: "Cezalandırılan", value: `${member ? member.toString() : user.username}`, inline: true},
        { name: "Cezalandıran", value: `${message.author}`, inline: true},
        { name: "Ceza Bitiş", value: `<t:${Math.floor((Date.now() + duration) / 1000)}:R>`, inline: true},
        { name: "Ceza Sebebi", value: `\`\`\`fix\n${reason}\n\`\`\``, inline: false},
                    )
   .setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
    
    await logChannel.send({ embeds: [log]});
    
    if (ertucuk.Mainframe.jaillimit > 0) {
      if (!jailLimit.has(message.author.id)) jailLimit.set(message.author.id, 1);
      else jailLimit.set(message.author.id, jailLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (jailLimit.has(message.author.id)) jailLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
    }
    
    if (interaction.values[0] === "jail3") {
    await interaction.deferUpdate();
    const duration = "1d" ? ms("1d") : undefined;
    const reason = "Sesli/Mesajlı/Ekran P. DM Taciz";
    
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { JailAmount: 1 } }, {upsert: true});
    
    await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { cezapuan: 15 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });
    punishmentLogChannel.send({ content: `${member} üyesi ban cezası alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`})
    member.roles.cache.has(ertum.BoosterRole) ? member.roles.set([ertum.BoosterRole, ertum.JailedRoles[0]]) : member.roles.set(ertum.JailedRoles)
    message.react(`${client.emoji("ertu_onay")}`)
    const penal = await client.penalize(message.guild.id, member.id, 'Jail', true, message.author.id, reason, true, Math.floor(Date.now() + duration))
    
    if(msg) msg.delete();
    await message.channel.send({ embeds: [new EmbedBuilder().setDescription(` ${member.toString()} kullanıcısı başarıyla **"${reason}"** sebebiyle <t:${Math.floor((Date.now() + duration) / 1000)}:R> süre boyunca karantinaya atıldı. (Ceza Numarası: \`#${penal.id}\`)`)]})
    if (ertucuk.Mainframe.dmMessages) member.send({ content:`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından, **${reason}** sebebiyle, <t:${Math.floor((Date.now() + duration) / 1000)}:R>'ya kadar jaillendiniz.`}).catch(() => {});
    
    const log = new EmbedBuilder()
    .setDescription(`
   **${member.user.tag}** adlı kullanıcıya **${message.author.tag}** tarafından Jail atıldı. Ceza Numarası: (\`${penal.id}\`)        
    `)
    .addFields(
        { name: "Cezalandırılan", value: `${member ? member.toString() : user.username}`, inline: true},
        { name: "Cezalandıran", value: `${message.author}`, inline: true},
        { name: "Ceza Bitiş", value: `<t:${Math.floor((Date.now() + duration) / 1000)}:R>`, inline: true},
        { name: "Ceza Sebebi", value: `\`\`\`fix\n${reason}\n\`\`\``, inline: false},
                    )
    .setFooter({ text:`${moment(Date.now()).format("LLL")}` })
    
    await logChannel.send({ embeds: [log]});
    
    if (ertucuk.Mainframe.jaillimit > 0) {
      if (!jailLimit.has(message.author.id)) jailLimit.set(message.author.id, 1);
      else jailLimit.set(message.author.id, jailLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (jailLimit.has(message.author.id)) jailLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
    }
    
    if (interaction.values[0] === "jail4") {
    await interaction.deferUpdate();
    const duration = "4w" ? ms("4w") : undefined;
    const reason = "Dini, Irki ve Siyasi değerlere Hakaret";
    
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { JailAmount: 1 } }, {upsert: true});
    
    await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { cezapuan: 15 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });
    punishmentLogChannel.send({ content: `${member} üyesi ban cezası alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`})
    member.roles.cache.has(ertum.BoosterRole) ? member.roles.set([ertum.BoosterRole, ertum.JailedRoles[0]]) : member.roles.set(ertum.JailedRoles)
    message.react(`${client.emoji("ertu_onay")}`)
    const penal = await client.penalize(message.guild.id, member.id, 'Jail', true, message.author.id, reason, true, Math.floor(Date.now() + duration))
    
    if(msg) msg.delete();
    await message.channel.send({ embeds: [new EmbedBuilder().setDescription(` ${member.toString()} kullanıcısı başarıyla **"${reason}"** sebebiyle <t:${Math.floor((Date.now() + duration) / 1000)}:R> süre boyunca karantinaya atıldı. (Ceza Numarası: \`#${penal.id}\`)`)]})
    if (ertucuk.Mainframe.dmMessages) member.send({ content:`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından, **${reason}** sebebiyle, <t:${Math.floor((Date.now() + duration) / 1000)}:R>'ya kadar jaillendiniz.`}).catch(() => {});
    
    const log = new EmbedBuilder()
    .setDescription(`
   **${member.user.tag}** adlı kullanıcıya **${message.author.tag}** tarafından Jail atıldı. Ceza Numarası: (\`${penal.id}\`)        
    `)
    .addFields(
        { name: "Cezalandırılan", value: `${member ? member.toString() : user.username}`, inline: true},
        { name: "Cezalandıran", value: `${message.author}`, inline: true},
        { name: "Ceza Bitiş", value: `<t:${Math.floor((Date.now() + duration) / 1000)}:R>`, inline: true},
        { name: "Ceza Sebebi", value: `\`\`\`fix\n${reason}\n\`\`\``, inline: false},
                    )
   .setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
    
    await logChannel.send({ embeds: [log]});
    
    if (ertucuk.Mainframe.jaillimit > 0) {
      if (!jailLimit.has(message.author.id)) jailLimit.set(message.author.id, 1);
      else jailLimit.set(message.author.id, jailLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (jailLimit.has(message.author.id)) jailLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
    }
    
    if (interaction.values[0] === "jail5") {
    await interaction.deferUpdate();
    const duration = "2w" ? ms("2w") : undefined;
    const reason = "Abartı rahatsız edici yaklaşımda bulunmak!";
    
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { JailAmount: 1 } }, {upsert: true});
    
    await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { cezapuan: 15 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });
    punishmentLogChannel.send({ content: `${member} üyesi ban cezası alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`})
    member.roles.cache.has(ertum.BoosterRole) ? member.roles.set([ertum.BoosterRole, ertum.JailedRoles[0]]) : member.roles.set(ertum.JailedRoles)
    message.react(`${client.emoji("ertu_onay")}`)
    const penal = await client.penalize(message.guild.id, member.id, 'Jail', true, message.author.id, reason, true, Math.floor(Date.now() + duration))
    
    if(msg) msg.delete();
    await message.channel.send({ embeds: [new EmbedBuilder().setDescription(` ${member.toString()} kullanıcısı başarıyla **"${reason}"** sebebiyle <t:${Math.floor((Date.now() + duration) / 1000)}:R> süre boyunca karantinaya atıldı. (Ceza Numarası: \`#${penal.id}\`)`)]})
    if (ertucuk.Mainframe.dmMessages) member.send({ content:`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından, **${reason}** sebebiyle, <t:${Math.floor((Date.now() + duration) / 1000)}:R>'ya kadar jaillendiniz.`}).catch(() => {});
    
    const log = new EmbedBuilder()
    .setDescription(`
   **${member.user.tag}** adlı kullanıcıya **${message.author.tag}** tarafından Jail atıldı. Ceza Numarası: (\`${penal.id}\`)        
    `)
    .addFields(
        { name: "Cezalandırılan", value: `${member ? member.toString() : user.username}`, inline: true},
        { name: "Cezalandıran", value: `${message.author}`, inline: true},
        { name: "Ceza Bitiş", value: `<t:${Math.floor((Date.now() + duration) / 1000)}:R>`, inline: true},
        { name: "Ceza Sebebi", value: `\`\`\`fix\n${reason}\n\`\`\``, inline: false},
                    )
   .setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
    
    await logChannel.send({ embeds: [log]});
    
    if (ertucuk.Mainframe.jaillimit > 0) {
      if (!jailLimit.has(message.author.id)) jailLimit.set(message.author.id, 1);
      else jailLimit.set(message.author.id, jailLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (jailLimit.has(message.author.id)) jailLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
    }
    
    if (interaction.values[0] === "jail6") {
    await interaction.deferUpdate();
    const duration = "3d" ? ms("3d") : undefined;
    const reason = "Sunucu içerisi abartı trol / Kayıt trol yapmak!";
    
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { JailAmount: 1 } }, {upsert: true});
    
    await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { cezapuan: 15 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });
    punishmentLogChannel.send({ content: `${member} üyesi ban cezası alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`})
    member.roles.cache.has(ertum.BoosterRole) ? member.roles.set([ertum.BoosterRole, ertum.JailedRoles[0]]) : member.roles.set(ertum.JailedRoles)
    message.react(`${client.emoji("ertu_onay")}`)
    const penal = await client.penalize(message.guild.id, member.id, 'Jail', true, message.author.id, reason, true, Math.floor(Date.now() + duration))
    
    if(msg) msg.delete();
    await message.channel.send({ embeds: [new EmbedBuilder().setDescription(` ${member.toString()} kullanıcısı başarıyla **"${reason}"** sebebiyle <t:${Math.floor((Date.now() + duration) / 1000)}:R> süre boyunca karantinaya atıldı. (Ceza Numarası: \`#${penal.id}\`)`)]})
    if (ertucuk.Mainframe.dmMessages) member.send({ content:`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından, **${reason}** sebebiyle, <t:${Math.floor((Date.now() + duration) / 1000)}:R>'ya kadar jaillendiniz.`}).catch(() => {});
    
    const log = new EmbedBuilder()
    .setDescription(`
   **${member.user.tag}** adlı kullanıcıya **${message.author.tag}** tarafından Jail atıldı. Ceza Numarası: (\`${penal.id}\`)        
    `)
    .addFields(
        { name: "Cezalandırılan", value: `${member ? member.toString() : user.username}`, inline: true},
        { name: "Cezalandıran", value: `${message.author}`, inline: true},
        { name: "Ceza Bitiş", value: `<t:${Math.floor((Date.now() + duration) / 1000)}:R>`, inline: true},
        { name: "Ceza Sebebi", value: `\`\`\`fix\n${reason}\n\`\`\``, inline: false},
                    )
   .setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
    
    await logChannel.send({ embeds: [log]});
    
    if (ertucuk.Mainframe.jaillimit > 0) {
      if (!jailLimit.has(message.author.id)) jailLimit.set(message.author.id, 1);
      else jailLimit.set(message.author.id, jailLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (jailLimit.has(message.author.id)) jailLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
    }
    
    if (interaction.values[0] === "jail7") {
    await interaction.deferUpdate();
    const duration = "4w" ? ms("4w") : undefined;
    const reason = "Sunucu Kötüleme / Saygısız Davranış";
    
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { JailAmount: 1 } }, {upsert: true});
    
    await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { cezapuan: 15 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });
    punishmentLogChannel.send({ content: `${member} üyesi ban cezası alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`})
    member.roles.cache.has(ertum.BoosterRole) ? member.roles.set([ertum.BoosterRole, ertum.JailedRoles[0]]) : member.roles.set(ertum.JailedRoles)
    message.react(`${client.emoji("ertu_onay")}`)
    const penal = await client.penalize(message.guild.id, member.id, 'Jail', true, message.author.id, reason, true, Math.floor(Date.now() + duration))
    
    if(msg) msg.delete();
    await message.channel.send({ embeds: [new EmbedBuilder().setDescription(` ${member.toString()} kullanıcısı başarıyla **"${reason}"** sebebiyle <t:${Math.floor((Date.now() + duration) / 1000)}:R> süre boyunca karantinaya atıldı. (Ceza Numarası: \`#${penal.id}\`)`)]})
    if (ertucuk.Mainframe.dmMessages) member.send({ content:`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından, **${reason}** sebebiyle, <t:${Math.floor((Date.now() + duration) / 1000)}:R>'ya kadar jaillendiniz.`}).catch(() => {});
    
    const log = new EmbedBuilder()
    .setDescription(`
   **${member.user.tag}** adlı kullanıcıya **${message.author.tag}** tarafından Jail atıldı. Ceza Numarası: (\`${penal.id}\`)        
    `)
    .addFields(
        { name: "Cezalandırılan", value: `${member ? member.toString() : user.username}`, inline: true},
        { name: "Cezalandıran", value: `${message.author}`, inline: true},
        { name: "Ceza Bitiş", value: `<t:${Math.floor((Date.now() + duration) / 1000)}:R>`, inline: true},
        { name: "Ceza Sebebi", value: `\`\`\`fix\n${reason}\n\`\`\``, inline: false},
                    )
   .setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
    
    await logChannel.send({ embeds: [log]});
    
    if (ertucuk.Mainframe.jaillimit > 0) {
      if (!jailLimit.has(message.author.id)) jailLimit.set(message.author.id, 1);
      else jailLimit.set(message.author.id, jailLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (jailLimit.has(message.author.id)) jailLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
    }
    
    if (interaction.values[0] === "jail8") {
    await interaction.deferUpdate();
    if(msg) msg.delete();
    interaction.followUp({ content: `${client.emoji("ertu_onay")} Jail Atma işlemi başarıyla iptal edildi.`, ephemeral: true });
    }
    })
    }



     },

  };