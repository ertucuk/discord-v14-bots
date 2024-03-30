const { ApplicationCommandOptionType, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, AttachmentBuilder, ComponentType, PermissionsBitField, ButtonBuilder, ButtonStyle } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const kanal = require("../../../../../../Global/Settings/AyarName");
const Canvas = require('@napi-rs/canvas')
const { MessageStat, MessageUserChannel, VoiceStat, VoiceUserChannel, StreamerStat, StreamerUserChannel, CameraStat, CameraUserChannel } = require("../../../../../../Global/Models")

module.exports = {
    name: "top",
    description: "Kullanıcıların istatiklerini sıralar.",
    category: "STAT",
    cooldown: 0,
    command: {
        enabled: true,
        aliases: ["topstat"],
        usage: ".top",
    },


    onLoad: function (client) { },

    onCommand: async function (client, message, args, ertuembed) {

        const StartTime = Date.now()

        let kanallar = kanal.KomutKullanımKanalİsim;
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.` }).then((e) => setTimeout(() => { e.delete(); }, 10000));
        
        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('ertucum')
                    .setPlaceholder('Detaylı veriler için menüden seçim yapın!')
                    .addOptions([
                        { label: 'En Fazla Mesaj Atan Kullanıcılar', value: 'mesaj', emoji: '1089491370982522950' },
                        { label: 'En Fazla Seste Duran Kullanıcılar', value: 'ses', emoji: '1089491399067566141' },
                        { label: 'En Fazla Yayın Açan Kullanıcılar', value: 'yayin', emoji: '1144687570647793754' },
                        { label: 'En Fazla Kamera Açan Kullanıcılar', value: 'kamera', emoji: '1144687959417819216' },
                    ]),
            );

        message.react(`${client.emoji("ertu_onay")}`)
        let msg = await message.channel.send({ content: "Sıralamasını görmek istediğiniz listeyi seçin.", components: [row]})
        const filter = i => i.user.id === message.member.id;
        const collector = msg.createMessageComponentCollector({filter, time: 60000});
        collector.on("collect", async (interaction) => {

            if (interaction.values[0] === "mesaj") {
              await interaction.deferUpdate();
                let data = await MessageStat.aggregate([{ $match: { guildID: message.guild.id } }, { $sort: { TotalStat: -1 } }]); 
                let image = await dataToCanvas("mesaj",data,message.guild);
                msg.edit({content: ``,components:[],embeds:[new EmbedBuilder().setImage("attachment://top.png")],files:[{attachment:image,name:"top.png"}]}).catch(err=>{})
            }

            if (interaction.values[0] === "ses") {
              await interaction.deferUpdate();
                let data = await VoiceStat.aggregate([{ $match: { guildID: message.guild.id } }, { $sort: { TotalStat: -1 } }]); 
                let image = await dataToCanvas("ses",data,message.guild);
                msg.edit({content: ``,components:[],embeds:[new EmbedBuilder().setImage("attachment://top.png")],files:[{attachment:image,name:"top.png"}]}).catch(err=>{})
            }

            if (interaction.values[0] === "yayin") {
              await interaction.deferUpdate();
                let data = await StreamerStat.find({guildID: message.guild.id});
                let image = await dataToCanvas("yayin",data,message.guild);
                msg.edit({content: ``,components:[],embeds:[new EmbedBuilder().setImage("attachment://top.png")],files:[{attachment:image,name:"top.png"}]}).catch(err=>{})

            }

            if (interaction.values[0] === "kamera") {
              await interaction.deferUpdate();
                let data = await CameraStat.find({guildID: message.guild.id});
                let image = await dataToCanvas("kamera",data,message.guild);
                msg.edit({content: ``,components:[],embeds:[new EmbedBuilder().setImage("attachment://top.png")],files:[{attachment:image,name:"top.png"}]}).catch(err=>{})
            }
        })
    },
};

async function dataToCanvas(type, longData,guild) {
    var back;
    switch (type) {
        case 'mesaj':
            back = "https://cdn.discordapp.com/attachments/1093491636094369813/1147216454920437841/top.png"
            break;
        case 'ses':
            back = "https://cdn.discordapp.com/attachments/1071541138055508061/1147502068580487218/top_2.jpg"
            break;
        case 'yayin':
            back = "https://cdn.discordapp.com/attachments/1071541138055508061/1147649077106966578/yayinntopp.png"
            break;
        case 'kamera':
            back = "https://cdn.discordapp.com/attachments/1071541138055508061/1147816416498692136/kamerattop1.png"
            break;
    }


    const canvas = Canvas.createCanvas(1280, 660);
    const ctx = canvas.getContext("2d");

    const background = await Canvas.loadImage(back);
    ctx.drawImage(background, 0, 0, 1280, 660);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '45px "NotoSansSymbols2-Regular"';
    const ertu = guild.name;
    ctx.fillText(`${ertu}`, canvas.width / 9.10, 90);

    var top = longData.filter(x => guild.members.cache.get(x.userID) && !guild.members.cache.get(x.userID).user.bot).sort((a,b) => b.TotalStat - a.TotalStat);
    const maxWidth = 100;
    const startY = 245;
    const userListLeft = [];
    const userListRight = [];

    top.forEach((data,i) =>{
        if(i > 6){
        userListRight.push({username:`${guild.members.cache.get(data.userID).user.username}`,TotalStat:data.TotalStat.toString()})
        }else{
        userListLeft.push({username:`${guild.members.cache.get(data.userID).user.username}`,TotalStat:data.TotalStat.toString()})
        }
    })

    userListLeft.forEach((data,i) =>{ 
      const user = data;
      const sayi = i * 90;
      const textColor = i < 3 ? ['#A7F9F9', '#F6CD46', '#C1853C'][i] : '#FFFFFF';

      ctx.font = '30px "Segoe UI"';
      ctx.fillStyle = textColor;
      ctx.textAlign = 'left';
      ctx.fillText(`${user.username}`, canvas.width / 9.10, startY + sayi);

      ctx.font = '27px "Segoe UI"';
      ctx.fillStyle = textColor;
      ctx.textAlign = 'left';

      if (type !== "mesaj") {
          var TotalStat;
          if (user.TotalStat >= 3600000) {
            TotalStat = moment.duration(Math.floor(data.TotalStat)).format('H [sa]')
           } else if (user.TotalStat < 3600000) {
            TotalStat = moment.duration(Math.floor(data.TotalStat)).format('m [dk]')
           } else if (user.TotalStat < 60000) {
              TotalStat = false
            }           
            ctx.textAlign = "end";
            ctx.fillText(`${TotalStat == false ? ` `: TotalStat}`, 610, startY + sayi);
      } else {
        
      if (parseInt(user.TotalStat) > 9) {
          ctx.textAlign = "end";
          ctx.fillText(user.TotalStat, 610, startY + sayi);
      } else {
          if (ctx.measureText(user.TotalStat).width > maxWidth) {
              const startX = canvas.width / 2.15 + maxWidth - ctx.measureText(user.TotalStat).width;
              ctx.fillText(user.TotalStat, startX, startY + sayi);
          } else {
              ctx.fillText(user.TotalStat, canvas.width / 2.15, startY + sayi);
          }
      }
    }
  })

  userListRight.forEach((data,i) =>{ 
      const user = data;
      const sayi = i * 90;
      const textColor = '#FFFFFF';

      ctx.font = '30px "Segoe UI"';
      ctx.fillStyle = textColor;
      ctx.textAlign = 'left';
      ctx.fillText(`${user.username}`, canvas.width / 1.66, startY + sayi);

      ctx.font = '27px "Segoe UI"';
      ctx.fillStyle = textColor;
      ctx.textAlign = 'left';       

      if(type !== "mesaj"){
          var TotalStat;
          if (user.TotalStat >= 3600000) {
              TotalStat = moment.duration(Math.floor(data.TotalStat)).format('H [sa]')
            } else if (user.TotalStat < 3600000) {
              TotalStat = moment.duration(Math.floor(data.TotalStat)).format('m [dk]')
            } else if (user.TotalStat < 60000) {
              TotalStat = false
            }           
            ctx.textAlign = "end";
            ctx.fillText(`${TotalStat == false ? ` `: TotalStat}`, 1236, startY + sayi);
      }else{

      if (parseInt(user.TotalStat) > 9) {
          ctx.textAlign = "end";
          ctx.fillText(user.TotalStat, 1236, startY + sayi);
      } else {
          if (ctx.measureText(user.TotalStat).width > maxWidth) {
              const startX = canvas.width / 1.04 + maxWidth - ctx.measureText(user.TotalStat).width;
              ctx.fillText(user.TotalStat, startX, startY + sayi);
          } else {
              ctx.fillText(user.TotalStat, canvas.width / 1.05, startY + sayi);
          }
      }
  }
  })
    let image = await Canvas.loadImage(guild.iconURL({ size: 128, extension: 'png' }))
    ctx.beginPath();
    ctx.arc(62, 73, 61, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(image, 14, 25, 95, 96.5);
    ctx.restore();

    return canvas.toBuffer('image/png');
}