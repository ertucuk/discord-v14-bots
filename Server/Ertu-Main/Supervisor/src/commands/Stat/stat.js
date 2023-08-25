const { ApplicationCommandOptionType, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, AttachmentBuilder ,ComponentType,PermissionsBitField } = require("discord.js"); 
  
 const messageUserChannel = require("../../../../../../Global/Schemas/messageUserChannel"); 
 const voiceUserChannel = require("../../../../../../Global/Schemas/voiceUserChannel"); 
 const streamerUserChannel = require("../../../../../../Global/Schemas/streamerUserChannel"); 
 const cameraUserChannel = require("../../../../../../Global/Schemas/cameraUserChannel"); 
 const messageUser = require("../../../../../../Global/Schemas/messageUser"); 
 const voiceUser = require("../../../../../../Global/Schemas/voiceUser"); 
 const voiceUserParent = require("../../../../../../Global/Schemas/voiceUserParent"); 
 const streamerUser = require("../../../../../../Global/Schemas/streamerUser"); 
 const cameraUser = require("../../../../../../Global/Schemas/cameraUser"); 
 const inviteMemberSchema = require("../../../../../../Global/Schemas/inviteMember"); 
 const inviterSchema = require("../../../../../../Global/Schemas/inviter"); 
  
 const kanal = require("../../../../../../Global/Settings/AyarName"); 
 const moment = require('moment'); 
 const Canvas = require("canvas"); 
 require("moment-duration-format") 
 moment.duration("hh:mm:ss").format() 
 const ertum = require("../../../../../../Global/Settings/Setup.json"); 
 const ertucuk = require("../../../../../../Global/Settings/System"); 
 const { star, nokta, ok, loading,green } = require("../../../../../../Global/Settings/Emojis.json") 
  
 const { registerFont } = require("canvas"); 
 registerFont('./../../../Global/Assets/MarlinGeo-Black.otf', { family: 'Marlin Geo Black' }) 
  
 module.exports = { 
   name: "me", 
   description: "Kullanıcının istatistik verilerini gösterir.", 
   category: "STAT", 
   cooldown: 0, 
   command: { 
     enabled: true, 
     aliases: ["stat", "stats"], 
     usage: ".stat", 
   }, 
  
   onLoad: function (client) { }, 
  
   onCommand: async function (client, message, args) { 
  
     let kanallar = kanal.KomutKullanımKanalİsim; 
 if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000));  
  
     const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member; 
     const member = message.guild.members.cache.get(target.id); 
  
     let ertu = await message.reply({ content: `${loading} | **${member.user.username}** kullanıcısının verileri yükleniyor. Lütfen bekleyin!` }) 
  
     const inviterData = await inviterSchema.findOne({ guildID: message.guild.id, userID: member.user.id }); 
     const total = inviterData ? inviterData.total : 0; 
     const regular = inviterData ? inviterData.regular : 0; 
     const bonus = inviterData ? inviterData.bonus : 0; 
     const leave = inviterData ? inviterData.leave : 0; 
     const fake = inviterData ? inviterData.fake : 0; 
     const invMember = await inviteMemberSchema.find({ guildID: message.guild.id, inviter: member.user.id }); 
     const davetettigim = invMember ? invMember.filter(ertu => message.guild.members.cache.get(ertu.userID)).slice(0, 10).map((ertu, index) => message.guild.members.cache.get(ertu.userID)).join(", ") : "Veri Yok" 
     const daily = invMember ? message.guild.members.cache.filter((m) => invMember.some((x) => x.userID === m.user.id) && Date.now() - m.joinedTimestamp < 1000 * 60 * 60 * 24).size : 0; 
     const weekly = invMember ? message.guild.members.cache.filter((m) => invMember.some((x) => x.userID === m.user.id) && Date.now() - m.joinedTimestamp < 1000 * 60 * 60 * 24 * 7).size : 0; 
  
     const category = async (parentsArray) => { 
       const data = await voiceUserParent.find({ guildID: message.guild.id, userID: member.id }); 
       const voiceUserParentData = data.filter((x) => parentsArray.includes(x.parentID)); 
       let voiceStat = 0; 
       for (var i = 0; i <= voiceUserParentData.length; i++) { 
         voiceStat += voiceUserParentData[i] ? voiceUserParentData[i].parentData : 0; 
       } 
       return moment.duration(voiceStat).format("H [sa.], m [dk.] s [saniye]"); 
     }; 
  
     const Active1 = await messageUserChannel.find({ guildID: message.guild.id, userID: member.id }).sort({ channelData: -1 }); 
     const Active2 = await voiceUserChannel.find({ guildID: message.guild.id, userID: member.id }).sort({ channelData: -1 }); 
     const Active3 = await streamerUserChannel.find({ guildID: message.guild.id, userID: member.user.id }).sort({ channelData: -1 }); 
     const Active4 = await cameraUserChannel.find({ guildID: message.guild.id, userID: member.user.id }).sort({ channelData: -1 }); 
     let messageTop; 
     Active1.length > 0 ? messageTop = Active1.splice(0, 5).map((x, index) => ` ${rakam(index == 0 ? `1` : `${index + 1}`)}  <#${x.channelID}> \` ${Number(x.channelData).toLocaleString()} mesaj \``).join("\n") : messageTop = "Veri bulunmuyor." 
     let voiceTop; 
     Active2.length > 0 ? (voiceTop = Active2.splice(0, 5).map((x, index) => ` ${rakam(index == 0 ? `1` : `${index + 1}`)}  <#${x.channelID}>: \`${moment.duration(x.channelData).format("H [Saat], m [Dakika], s [Saniye]")}\``).join("\n")) : (voiceTop = "Detaylı Ses bilgisi bulunmamaktadır."); 
     let streamTop; 
     Active3.length > 0 ? (streamTop = Active3.splice(0, 5).map((x, index) => ` ${rakam(index == 0 ? `1` : `${index + 1}`)}  <#${x.channelID}>: \`${moment.duration(x.channelData).format("H [Saat], m [Dakika], s [Saniye]")}\``).join("\n")) : (streamTop = "Detaylı Yayın bilgisi bulunmamaktadır."); 
     let cameraTop; 
     Active4.length > 0 ? (cameraTop = Active4.splice(0, 5).map((x, index) => ` ${rakam(index == 0 ? `1` : `${index + 1}`)}  <#${x.channelID}>: \`${moment.duration(x.channelData).format("H [Saat], m [Dakika], s [Saniye]")}\``).join("\n")) : (cameraTop = "Detaylı Kamera bilgisi bulunmamaktadır."); 
  
     const messageData = await messageUser.findOne({ guildID: message.guild.id, userID: member.id }); 
     const voiceData = await voiceUser.findOne({ guildID: message.guild.id, userID: member.id }); 
     const messageWeekly = messageData ? messageData.weeklyStat : 0; 
     const voiceWeekly = moment.duration(voiceData ? voiceData.weeklyStat : 0).format("H [saat], m [dakika]"); 
     const messageDaily = messageData ? messageData.dailyStat : 0; 
     const voiceDaily = moment.duration(voiceData ? voiceData.dailyStat : 0).format("H [saat], m [dakika]"); 
     const streamData = await streamerUser.findOne({ guildID: message.guild.id, userID: member.user.id }); 
     const cameraData = await cameraUser.findOne({ guildID: message.guild.id, userID: member.user.id }); 
  
  
  
     /// DEVELOPED BY CRANE&ERTU 
     const topChannels = await messageUserChannel.aggregate([ 
       { $match: { userID: member.id } }, 
       { $sort: { channelData: -1 } }, 
       { $limit: 3 } 
     ]); 
  
     const topVoices = await voiceUserChannel.aggregate([ 
       { $match: { userID: member.id } }, 
       { $sort: { channelData: -1 } }, 
       { $limit: 3 } 
     ]); 
  
     const getChannelName = (channelID) => { 
       const channel = client.channels.cache.get(channelID); 
       return channel ? channel.name : false; 
     } 
  
     if (member.user.bot) return; 
  
    const row = new ActionRowBuilder() 
    .addComponents( 
      new StringSelectMenuBuilder() 
        .setCustomId('ertucum') 
        .setPlaceholder(`${member.user.tag.toString()} kullanıcısının detaylarını görüntüle!`) 
        .addOptions([ 
          { label: 'Ses İstatistik Detay', description: 'Detaylı Ses istatistiğininin bilgilerini görüntülemektedir.', value: 'ses', emoji: '1089491399067566141' }, 
          { label: 'Mesaj İstatistik Detay', description: 'Detaylı Mesaj istatistiğinin bilgilerini görüntülemektedir.', value: 'mesaj', emoji: '1089491370982522950' }, 
          { label: 'Davet Detay', description: 'Detaylı Davet istatistiğini görüntülemektedir.', value: 'davet', emoji: '1089505823346143303' }, 
          { label: 'Yayın Detay', description: 'Detaylı Yayın istatistiğini görüntülemektedir.', value: 'yayin', emoji: '1144687570647793754' }, 
          { label: 'Kamera Detay', description: 'Detaylı Kamera istatistiğini görüntülemektedir.', value: 'kamera', emoji: '1144687959417819216' }, 
          { label: `Menüyü Kapat`, value: 'iptal', emoji: '1102692516626710708' }, 
        ]), 
    ); 
  
     let canvas = Canvas.createCanvas(1080, 400), 
       ctx = canvas.getContext("2d"); 
     let background = await Canvas.loadImage("https://cdn.discordapp.com/attachments/1093491636094369813/1114621604702474260/ErtuStat.png"); 
     ctx.drawImage(background, 0, 0, 1080, 400); 
  
     ctx.font = '45px "Marlin Geo Black"'; 
     let uname = target.user.username; 
     if (uname.length > 5) { 
       uname = uname.slice(0, 5); 
     } 
     ctx.fillText(`${uname}`, canvas.width / 6.00, 90); 
     ctx.font = '28px "Marlin Geo Black"'; 
     ctx.fillText(`${moment(target.user.createdAt).format("LL")}`, canvas.width / 1.67, 100, 200, 400); 
  
     ctx.font = '28px "Marlin Geo Black"'; 
     ctx.fillText(`${moment(target.joinedAt).format("LL")}`, canvas.width / 1.24, 100, 200, 400); 
  
     ctx.font = '16px "Marlin Geo Black"'; 
     ctx.fillStyle = '#ffffff'; 
     ctx.fillText(`Ses Süresi`, canvas.width / 11.75, 205); 
  
     ctx.font = '17px "Marlin Geo Black"'; 
     ctx.fillStyle = '#090909'; 
     ctx.fillText(`${moment.duration(voiceData ? voiceData.topStat : 0).format("H [sa.] m [dk.]")}`, canvas.width / 4.84, 208, 100, 400); 
  
     ctx.font = '16px "Marlin Geo Black"'; 
     ctx.fillStyle = '#ffffff'; 
     ctx.fillText(`Mesaj Sayısı`, canvas.width / 13.00, 255); 
  
     ctx.font = '17px "Marlin Geo Black"'; 
     ctx.fillStyle = '#090909'; 
     ctx.fillText(`${messageData ? messageData.topStat : 0} mesaj`, canvas.width / 4.75, 255, 100, 400); 
  
     ctx.font = '16px "Marlin Geo Black"'; 
     ctx.fillStyle = '#ffffff'; 
     ctx.fillText(`Yayın Süresi`, canvas.width / 13.00, 303); 
  
     ctx.font = '17px "Marlin Geo Black"'; 
     ctx.fillStyle = '#090909'; 
     ctx.fillText(`${moment.duration(streamData ? streamData.topStat : 0).format("H [sa], m [dk]")}`, canvas.width / 4.75, 303, 100, 400); 
  
     ctx.font = '16px "Marlin Geo Black"'; 
     ctx.fillStyle = '#ffffff'; 
     ctx.fillText(`Kamera Süresi`, canvas.width / 14.00, 355); 
  
     ctx.font = '17px "Marlin Geo Black"'; 
     ctx.fillStyle = '#090909'; 
     ctx.fillText(`${moment.duration(cameraData ? cameraData.topStat : 0).format("H [sa], m [dk]")}`, canvas.width / 4.75, 355, 100, 400); 
  
     /////////////////////////////////////////////////////////// 
  
     for (let i = 0; i < topChannels.length; i++) { 
       const element = topChannels[i]; 
       const sayi = i * 60; 
       ctx.font = '16px "Marlin Geo Black"'; 
       ctx.fillStyle = '#ffffff'; 
       ctx.fillText(`${getChannelName(element.channelID) ? "#" + getChannelName(element.channelID) : element ? "#" + element.channelName : ""}`, canvas.width / 2.70, i > 0 ? 217 + sayi : 217); 
       ctx.font = '17px "Marlin Geo Black"'; 
       ctx.fillStyle = '#090909'; 
       ctx.fillText(`${element ? element.channelData + " mesaj" : ""}`, canvas.width / 1.95, i > 0 ? 217 + sayi : 217, 100, 400); 
     } 
  
     for (let i = 0; i < topVoices.length; i++) { 
       const element = topVoices[i]; 
       const sayi = i * 60; 
       ctx.font = '16px "Marlin Geo Black"'; 
       ctx.fillStyle = '#ffffff'; 
       ctx.fillText(`${getChannelName(element.channelID) ? getChannelName(element.channelID) : element ? element.channelName : ""}`, canvas.width / 1.42, i > 0 ? 217 + sayi : 217); 
       ctx.font = '17px "Marlin Geo Black"'; 
       ctx.fillStyle = '#090909'; 
       ctx.fillText(`${element ? moment.duration(element.channelData).format("H [sa.] m [dk.]") : ""}`, canvas.width / 1.17, i > 0 ? 217 + sayi : 217, 100, 400); 
     } 
  
     Canvas.loadImage(target.displayAvatarURL({ size: 128, extension: 'png' })).then(async (x) => { 
       ctx.beginPath(); 
       ctx.arc(62, 73, 61, 0, Math.PI * 2, false); 
       ctx.closePath(); 
       ctx.clip(); 
       ctx.drawImage(x, 14, 25, 95, 96.5); 
       ctx.restore(); 
       let img = new AttachmentBuilder(canvas.toBuffer(), { name: 'ertu.png'}); 
  
       message.react(green) 
       let msg = await ertu.edit({ content: ``, files: [img], components: [row] }) 
       const filter = i => i.user.id === message.member.id; 
       const collector = msg.createMessageComponentCollector({ filter, time: 90000 }); 
  
       collector.on("collect", async (interaction) => { 
         if(interaction.isStringSelectMenu()) { 
         if (interaction.values[0] === "mesaj") { 
             await interaction.deferUpdate(); 
  
             const embeds = new EmbedBuilder() 
               .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 2048 })) 
               .setDescription(`${member.toString()} üyesinin aşağıda detaylı **Mesaj** istatistikleri belirtilmiştir.`) 
               .addFields( 
                 { name: "__**Toplam Mesaj**__", value: `\`\`\`cs\n${messageData ? messageData.topStat : 0} mesaj\n\`\`\` `, inline: true }, 
                 { name: "__**Haftalık Mesaj**__", value: `\`\`\`cs\n${messageData ? messageData.weeklyStat : 0} mesaj\n\`\`\` `, inline: true }, 
                 { name: "__**Günlük Mesaj**__", value: `\`\`\`cs\n${messageData ? messageData.dailyStat : 0} mesaj\n\`\`\` `, inline: true }, 
                 { name: `${star} __**Mesaj Kanal Sıralaması**__`, value:` ${messageTop ? `${messageTop}` : 'Veri Yok'}  `, inline: false }, 
               ) 
  
             msg.edit({ embeds: [embeds], components: [row], files: [] }) 
           } 
         if (interaction.values[0] === "ses") { 
           await interaction.deferUpdate(); 
           const embeds = new EmbedBuilder() 
             .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 2048 })) 
             .setDescription(`${member.toString()} üyesinin aşağıda detaylı **Ses** istatistikleri belirtilmiştir.`) 
             .addFields( 
               { name: "__**Toplam Ses**__", value: `\`\`\`cs\n${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}\n\`\`\``, inline: true }, 
               { name: "__**Haftalık Ses**__", value: `\`\`\`cs\n${voiceWeekly}\n\`\`\``, inline: true }, 
               { name: "__**Günlük Ses**__", value: `\`\`\`cs\n${voiceDaily}\n\`\`\``, inline: true }, 
               { 
                 name: `${star} __**Ses Kategori Sıralaması**__`, value: ` 
 ${nokta} Toplam: \` ${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")} \` 
 ${nokta} Public Odalar: \` ${await category(ertum.PublicRoomsCategory)} \` 
 ${nokta} Secret Odalar: \` ${await category(ertum.SecretRoomsCategory)} \`  
 ${nokta} Alone Odalar: \` ${await category(ertum.PrivateRoomsCategory)} \` 
 ${nokta} Yetkili Odaları: \` ${await category(ertum.ActivityCategorys)} \` 
 ${nokta} Kayıt Odaları: \` ${await category(ertum.RegisterRoomCategory)} \`   
 `, inline: false 
               }, 
               { name: `${star} __**Ses Kanal Sıralaması**__`, value: `${voiceTop}`, inline: false }, 
             ) 
           msg.edit({ embeds: [embeds], components: [row], files: [] }) 
         } 
  
         if (interaction.values[0] === "davet") { 
           await interaction.deferUpdate(); 
           const embeds = new EmbedBuilder() 
           .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 2048 })) 
           .setDescription(`Aşağıda ${member.toString()} üyesinin detaylı **Davet** istatistikleri görüntülenmektedir. 
  
 Toplam **${total}** davet. 
 \` ${regular} gerçek \` 
 \` ${bonus} bonus \` 
 \` ${leave} ayrılmış \` 
 \` ${fake} fake \` 
        
 Günlük: \`${daily}\`, Haftalık: \`${weekly}\` 
  
 **❯ Davet ettiği tüm kişiler;** 
 ${davetettigim ? `${davetettigim}` : 'Veri Yok'} 
 `) 
  
           msg.edit({ embeds: [embeds], components: [row], files: [] }) 
         } 
  
         if (interaction.values[0] === "yayin") { 
           await interaction.deferUpdate(); 
           const embeds = new EmbedBuilder() 
           .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 2048 })) 
           .setDescription(`Aşağıda ${member.toString()} üyesinin detaylı **Yayın** istatistikleri görüntülenmektedir.`) 
           .addFields( 
             { name: "__**Toplam Yayın**__", value: `\`\`\`cs\n${moment.duration(streamData ? streamData.topStat : 0).format("H [saat], m [dakika]")}\n\`\`\``, inline: true }, 
             { name: "__**Haftalık Yayın**__", value: `\`\`\`cs\n${moment.duration(streamData ? streamData.weeklyStat : 0).format("H [saat], m [dakika]")}\n\`\`\``, inline: true }, 
             { name: "__**Günlük Yayın**__", value: `\`\`\`cs\n${moment.duration(streamData ? streamData.dailyStat : 0).format("H [saat], m [dakika]")}\n\`\`\``, inline: true },   
             { name: `${star} __**Yayın Kanal Sıralaması**__`, value: `${streamTop}`, inline: false }, 
           ) 
  
           msg.edit({ embeds: [embeds], components: [row], files: [] }) 
         } 
  
         if (interaction.values[0] === "kamera") { 
           await interaction.deferUpdate(); 
           let page = 1; 
           const embeds = new EmbedBuilder() 
             .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 2048 }))  
             .setDescription(`Aşağıda ${member.toString()} üyesinin detaylı **Kamera** istatistikleri görüntülenmektedir.`) 
             .addFields( 
               { name: "__**Toplam Kamera**__", value: `\`\`\`cs\n${moment.duration(cameraData ? cameraData.topStat : 0).format("H [saat], m [dakika]")}\n\`\`\``, inline: true }, 
               { name: "__**Haftalık Kamera**__", value: `\`\`\`cs\n${moment.duration(cameraData ? cameraData.weeklyStat : 0).format("H [saat], m [dakika]")}\n\`\`\``, inline: true }, 
               { name: "__**Günlük Kamera**__", value: `\`\`\`cs\n${moment.duration(cameraData ? cameraData.dailyStat : 0).format("H [saat], m [dakika]")}\n\`\`\``, inline: true },   
               { name: `${star} __**Kamera Kanal Sıralaması**__`, value: `${cameraTop}`, inline: false }, 
             ) 
           msg.edit({ embeds: [embeds], components: [row], files: [] }) 
         } 
         if (interaction.values[0] === "iptal") { 
           await interaction.deferUpdate(); 
           if (msg) msg.delete(); 
         } 
       }}) 
     }) 
  
   }, 
 }; 
  
 const rakam = client.sayıEmoji = (sayi) => { 
   var ertu = sayi.toString().replace(/ /g, "     "); 
   var ertu2 = ertu.match(/([0-9])/g); 
   ertu = ertu.replace(/([a-zA-Z])/g, "Belirlenemiyor").toLowerCase(); 
   if (ertu2) { 
     ertu = ertu.replace(/([0-9])/g, d => { 
       return { 
         '0': client.emoji("sayiEmoji_sifir") !== null ? client.emoji("sayiEmoji_sifir") : "\` 0 \`", 
         '1': client.emoji("sayiEmoji_bir") !== null ? client.emoji("sayiEmoji_bir") : "\` 1 \`", 
         '2': client.emoji("sayiEmoji_iki") !== null ? client.emoji("sayiEmoji_iki") : "\` 2 \`", 
         '3': client.emoji("sayiEmoji_uc") !== null ? client.emoji("sayiEmoji_uc") : "\` 3 \`", 
         '4': client.emoji("sayiEmoji_dort") !== null ? client.emoji("sayiEmoji_dort") : "\` 4 \`", 
         '5': client.emoji("sayiEmoji_bes") !== null ? client.emoji("sayiEmoji_bes") : "\` 5 \`", 
         '6': client.emoji("sayiEmoji_alti") !== null ? client.emoji("sayiEmoji_alti") : "\` 6 \`", 
         '7': client.emoji("sayiEmoji_yedi") !== null ? client.emoji("sayiEmoji_yedi") : "\` 7 \`", 
         '8': client.emoji("sayiEmoji_sekiz") !== null ? client.emoji("sayiEmoji_sekiz") : "\` 8 \`", 
         '9': client.emoji("sayiEmoji_dokuz") !== null ? client.emoji("sayiEmoji_dokuz") : "\` 9 \`" 
       }[d]; 
     }); 
   } 
   return ertu; 
 }
