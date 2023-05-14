const { ApplicationCommandOptionType,ActionRowBuilder,StringSelectMenuBuilder,EmbedBuilder,AttachmentBuilder} = require("discord.js");
const messageUserChannel = require("../../schemas/messageUserChannel");
const voiceUserChannel = require("../../schemas/voiceUserChannel");
const messageUser = require("../../schemas/messageUser");
const Canvas = require("canvas");
const voiceUser = require("../../schemas/voiceUser");
const inviteMemberSchema = require("../../schemas/inviteMember");
const regstats = require("../../schemas/registerStats");
const voiceUserParent = require("../../schemas/voiceUserParent");
const axios = require('axios');
const isimler = require("../../schemas/names");
const moment = require('moment');
const register = require("../../schemas/registerStats");
const inviterSchema = require("../../schemas/inviter");
const ertum = require("../../Settings/setup.json");
const { star , nokta } = require("../../Settings/Emojis.json")
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    name: "me",
    description: "",
    category: "NONE",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["stat","stats"],
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


        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        const member = message.guild.members.cache.get(target.id);


        const inviterData = await inviterSchema.findOne({ guildID: message.guild.id, userID: member.user.id });
        const total = inviterData ? inviterData.total : 0;
        const regular = inviterData ? inviterData.regular : 0;
        const bonus = inviterData ? inviterData.bonus : 0;
        const leave = inviterData ? inviterData.leave : 0;
        const fake = inviterData ? inviterData.fake : 0;
        const invMember = await inviteMemberSchema.find({ guildID: message.guild.id, inviter: member.user.id });
        const daily = invMember ? message.guild.members.cache.filter((m) => invMember.some((x) => x.userID === m.user.id) && Date.now() - m.joinedTimestamp < 1000 * 60 * 60 * 24).size : 0;
        const weekly = invMember ? message.guild.members.cache.filter((m) => invMember.some((x) => x.userID === m.user.id) && Date.now() - m.joinedTimestamp < 1000 * 60 * 60 * 24 * 7).size : 0;
        let tagged;
        if (ertum.ServerTag && ertum.ServerTag.length > 0) tagged = invMember ? message.guild.members.cache.filter((m) => invMember.some((x) => x.userID === m.user.id) && m.user.username.includes(ertum.ServerTag)).size : 0;
        else tagged = 0;
        const data = await regstats.findOne({ guildID: message.guild.id, userID: member.id });
    
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
        let messageTop;
        Active1.length > 0 ? messageTop = Active1.splice(0, 5).map((x, index) =>`\` ${index == 0 ? `1` : `${index + 1}`} \` <#${x.channelID}> \` ${Number(x.channelData).toLocaleString()} mesaj \``).join("\n") : messageTop = "Veri bulunmuyor."
        let voiceTop;
        Active2.length > 0 ? voiceTop = Active2.splice(0, 5).map((x, index) =>`\` ${index == 0 ? `1` : `${index + 1}`} \` <#${x.channelID}>    \` ${moment.duration(x.channelData).format("H [sa.], m [dk.]")} \` `).join("\n") : voiceTop = "Veri bulunmuyor."
    
        const messageData = await messageUser.findOne({ guildID: message.guild.id, userID: member.id });
        const voiceData = await voiceUser.findOne({ guildID: message.guild.id, userID: member.id });
        const messageWeekly = messageData ? messageData.weeklyStat : 0;
        const voiceWeekly = moment.duration(voiceData ? voiceData.weeklyStat : 0).format("H [sa.], m [dk.]");
        const messageDaily = messageData ? messageData.dailyStat : 0;
        const voiceDaily = moment.duration(voiceData ? voiceData.dailyStat : 0).format("H [sa.], m [dk.]");
        const streamData = moment.duration(voiceData ? voiceData.streamStat : 0).format("H [sa.], m [dk.]");

        if (member.user.bot) return;
    
        const row = new ActionRowBuilder()
        .addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('ertucum')
            .setPlaceholder(`${member.user.tag.toString()}'n detaylarını görüntüle! `)
            .addOptions([
              { label: 'Ses İstatistik Detay', description: 'Ses istatistiğininin bilgilerini görüntülemektedir.', value: 'ses', emoji: '🎤' },
              { label: 'Mesaj İstatistik Detay', description: 'Mesaj istatistiğinin bilgilerini görüntülemektedir.', value: 'mesaj', emoji: '✉️' },
              { label: 'İnvite Detay', description: 'Davet istatistiğini görüntülemektedir.', value: 'davet', emoji: '📩' },
              { label: `Menüyü Kapat`, value: 'iptal', emoji: '1102692516626710708'},
            ]),
        );

        let canvas = Canvas.createCanvas(1080, 400),
        
        ctx = canvas.getContext("2d");
        let background = await Canvas.loadImage("https://cdn.discordapp.com/attachments/1071541138055508061/1102690208606077089/ertu.png");
        ctx.drawImage(background, 0, 0, 1080, 400);
        ctx.textAlign = 'center';
        ctx.font = '23px Sans';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${Number(messageDaily).toLocaleString()} mesaj`, canvas.width / 1.75, 230);
        ctx.font = '23px Sans';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${Number(messageWeekly).toLocaleString()} mesaj`, canvas.width / 1.75, 290);
        ctx.font = '23px Sans';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${messageData ? messageData.topStat : 0} mesaj`, canvas.width / 1.75, 350);

        ctx.textAlign = 'center';
        ctx.font = '23px Sans';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${moment.duration(voiceData ? voiceData.dailyStat : 0).format("H [sa.], m [dk.]")}`, canvas.width / 1.12, 230);
        ctx.font = '23px Sans';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${voiceWeekly}`, canvas.width / 1.12, 290);
        ctx.font = '23px Sans';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${voiceDaily}`, canvas.width / 1.12, 350);

        ctx.font = '23px Sans';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${messageData ? messageData.topStat : 0} mesaj`, canvas.width / 4.07, 290);
        ctx.font = '23px Sans';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${moment.duration(voiceData ? voiceData.topStat : 0).format("H [sa.], m [dk.]")}`, canvas.width / 4.07, 230);
        ctx.font = '23px Sans';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${streamData}`, canvas.width / 4.07, 350);

        ctx.font = '50px Sans';
        
        ctx.fillText(`${target.user.tag}`, canvas.width / 4.00, 95);

        ctx.font = '28px Sans';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${moment(target.user.createdAt).format("L")}`, canvas.width / 1.45, 95);

        ctx.font = '28px Sans';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${moment(target.joinedAt).format("L")}`, canvas.width / 1.12, 95);
        let img;
        Canvas.loadImage(target.displayAvatarURL({ size: 128, extension: 'png' })).then(async (x) => {
          ctx.drawImage(x, 16, 20, 100, 100);
          ctx.restore();
          img = new AttachmentBuilder(canvas.toBuffer(), `oy-${message.author.id}.png`);

          let msg = await message.channel.send({ files: [img], components: [row] })
          const filter = i => i.user.id === message.member.id;
          const collector = await msg.createMessageComponentCollector({ filter: filter, time: 30000 });
 
 collector.on("collect", async (interaction) => {
     if (interaction.values[0] === "ses") {
       await interaction.deferUpdate();
       const embeds = new EmbedBuilder()
         .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 2048 }))
         .setDescription(`${member.toString()} üyesinin aşağıda **Ses** istatistikleri belirtilmiştir.`)
         .addFields(
           { name: " __**Toplam Ses**__", value: `\`\`\`fix\n${moment.duration(voiceData ? voiceData.topStat : 0).format("H [sa.], m [dk.]")}\n\`\`\``, inline: true},
           { name: "__**Haftalık Ses**__", value: `\`\`\`fix\n${moment.duration(voiceData ? voiceData.weeklyStat : 0).format("H [sa.], m [dk.]")}\n\`\`\``, inline: true},
           { name: "__**Günlük Ses**__", value: `\`\`\`fix\n${moment.duration(voiceData ? voiceData.dailyStat : 0).format("H [sa.], m [dk.]")}\n\`\`\``, inline: true},
           { name: `${star} __**Ses Kategori Sıralaması**__`, value: `
   ${nokta} Toplam: \` ${moment.duration(voiceData ? voiceData.topStat : 0).format("H [sa.], m [dk.]")} \`
   ${nokta} Public Odalar: \` ${await category(ertum.PublicRoomsCategory)} \`
   ${nokta} Secret Odalar: \` ${await category(ertum.PrivateRoomsCategory)} \` 
   ${nokta} Alone Odalar: \` ${await category(ertum.PrivateRoomsCategory)} \`
   ${nokta} Yönetim Yetkili Odaları: \` ${await category(ertum.ActivityCategorys)} \`
   ${nokta} Kayıt Odaları: \` ${await category(ertum.RegisterRoomCategory)} \`  
 `, inline: false},
           { name: `${star} __**Ses Kanal Sıralaması**__`, value: `${voiceTop} \n\n Genel sohbet ( \` ses \` ) sıralaması \`${moment(Date.now()).format("LLL")}\` tarihinde otomatik olarak güncellenmiştir.`, inline: false},
         )
       msg.edit({
         embeds: [embeds],
         components: [row],
         files: []
       })
     }
     if (interaction.values[0] === "davet") {
       await interaction.deferUpdate();
       const embeds = new EmbedBuilder()
         .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 2048 }))
         .setDescription(`Aşağıda ${member.toString()} üyesinin detaylı **Davet** istatistikleri görüntülenmektedir.
 
 **❯ Detaylı Davet Bilgisi:**(Toplam **${total}** davet)
 [\`${regular} gerçek, ${bonus} ekstra, ${leave} ayrılmış, ${fake} sahte\`]
 
 Günlük: \` ${daily} \`, Haftalık: \` ${weekly} \`
 `)
  
       msg.edit({
         embeds: [embeds],
         components: [row],
         files: []
       })
     }
 
     if (interaction.values[0] === "mesaj") {
       await interaction.deferUpdate();
 
       const embeds = new EmbedBuilder()
         .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 2048 }))
         .setDescription(`${member.toString()} üyesinin aşağıda **Mesaj** istatistikleri belirtilmiştir.`)
         .addFields(
{ name: "__**Toplam Mesaj**__", value: `\`\`\`fix\n${messageData ? messageData.topStat : 0} mesaj\n\`\`\` `, inline: true},
{ name: "__**Haftalık Mesaj**__", value: `\`\`\`fix\n${Number(messageWeekly).toLocaleString()} mesaj\n\`\`\` `, inline: true},
{ name: "__**Günlük Mesaj**__", value: `\`\`\`fix\n${Number(messageDaily).toLocaleString()} mesaj\n\`\`\` `, inline: true},
{ name: `${star} __**Mesaj Kanal Sıralaması**__`, value: `${messageTop} \n\n Genel sohbet( \` mesaj \` ) sıralaması \`${moment(Date.now()).format("LLL")}\` tarihinde otomatik olarak güncellenmiştir.`, inline: false},
         )
       msg.edit({
         embeds: [embeds],
         components: [row],
         files: []
       })
     }
    
     if (interaction.values[0] === "iptal") {
       await interaction.deferUpdate();
       if (msg) msg.delete();
}
})
})
},

    onSlash: async function (client, interaction) { },
  };