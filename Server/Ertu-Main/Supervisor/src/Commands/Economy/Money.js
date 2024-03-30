const { ApplicationCommandOptionType,PermissionsBitField, AttachmentBuilder,ActionRowBuilder,ButtonStyle, ButtonBuilder  } = require("discord.js");
const Coin = require("../../../../../../Global/Schemas/ekonomi");
const kanal = require("../../../../../../Global/Settings/AyarName");
const Canvas = require('canvas')
Canvas.registerFont(`../../../Global/Assets/theboldfont.ttf`, { family: "Bold" });
const ayarlar = require("../../../../../../Global/Settings/System");

module.exports = {
    name: "coin",
    description: "Paranızı gösterrir",
    category: "EKONOMI",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["param","coinim","money","cash"],
      usage: ".coin", 
    },
  

    onLoad: function (client) { },

    onCommand: async function (client, message, args, ertuembed) { 

      let channels = ["bot-commands","coin","coin-chat"]
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !channels.includes(message.channel.name)) return message.reply({ content: `${channels.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

      const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member

      let data =  await Coin.findOne({ guildID:message.guild.id, userID: member.id});
      if(!data) data = await Coin.findOneAndUpdate({guildID:message.guild.id,userID:member.id},{$set:{coin:1000,beklemeSuresi:Date.now(),gameSize:0,profilOlusturma:Date.now(),hakkimda:"Girilmedi",evlilik:false,evlendigi:undefined,dailyCoinDate:(Date.now() - 86400000)}},{upsert:true, new:true})
       
         const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
          .setLabel("Mağaza")
          .setCustomId("magaza")
          .setStyle(ButtonStyle.Secondary),
          
          new ButtonBuilder()
          .setLabel("Günlük Al")
          .setCustomId("günlük")
          .setStyle(ButtonStyle.Success)
      )
        let canvas = Canvas.createCanvas(1080, 400),
        ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(0 + Number(30), 0);
        ctx.lineTo(0 + 1080 - Number(30), 0);
        ctx.quadraticCurveTo(0 + 1080, 0, 0 + 1080, 0 + Number(30));
        ctx.lineTo(0 + 1080, 0 + 400 - Number(30));
        ctx.quadraticCurveTo(
        0 + 1080,
        0 + 400,
        0 + 1080 - Number(30),
        0 + 400
        );
        ctx.lineTo(0 + Number(30), 0 + 400);
        ctx.quadraticCurveTo(0, 0 + 400, 0, 0 + 400 - Number(30));
        ctx.lineTo(0, 0 + Number(30));
        ctx.quadraticCurveTo(0, 0, 0 + Number(30), 0);
        ctx.closePath();
        ctx.clip();
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 1080, 400);
        let background = await Canvas.loadImage(client.guilds.cache.get(ayarlar.ServerID).banner ? client.guilds.cache.get(ayarlar.ServerID).banner ? client.guilds.cache.get(ayarlar.ServerID).bannerURL({extension:"png"}) + `?size=4096` : ayarlar.BackGround : ayarlar.BackGround);
        ctx.drawImage(background, 0, 0, 1080, 400);
        ctx.restore();
        ctx.beginPath();
        ctx.globalAlpha = 0.5
        ctx.fillStyle = "#000000";

        ctx.moveTo(50,  22);
        ctx.lineTo(canvas.width - 50,  22);
        ctx.quadraticCurveTo(canvas.width - 50,  22, canvas.width -  22, 50);
        ctx.lineTo(canvas.width -  22, canvas.height - 50);
        ctx.quadraticCurveTo(canvas.width - 25, canvas.height -  22, canvas.width - 50, canvas.height -  22);
        ctx.lineTo(50, canvas.height - 22);
        ctx.quadraticCurveTo(25, canvas.height -  22,  22, canvas.height - 50);
        ctx.lineTo( 22, 50);
        ctx.quadraticCurveTo( 22,  22, 50,  22);
        ctx.fill();
        ctx.globalAlpha = 1
        ctx.closePath();
        ctx.stroke();
        let coin = await Canvas.loadImage("https://cdn.discordapp.com/emojis/998211961462464532.png?size=96&quality=lossless")
         ctx.drawImage(coin, canvas.width - 740, 200, 75, 65);
         ctx.fillStyle = "#000000"; 
         ctx.lineWidth = 3;
         ctx.fillStyle = "#e7d02e";
         ctx.font = applyText(canvas, member.user.displayName + " UYESININ HESABI", 40, 600, "Bold");
        ctx.fillText(member.user.displayName + " UYESININ HESABI", canvas.width - 740, canvas.height - 230);
       ctx.font = "30px Bold";
       ctx.strokeStyle = "#e7d02e";
       ctx.lineWidth = 3;
       ctx.strokeText(data.coin.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + " "+ ayarlar.Server + " PARASI", canvas.width - 650, 240);
       ctx.fillStyle = "#ffffff";
       ctx.fillText(data.coin.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + " "+ ayarlar.Server + " PARASI", canvas.width - 650, 240);
       ctx.font = "70px Bold";
       ctx.strokeStyle = "#000000";
       ctx.lineWidth = 8;
       ctx.strokeText(ayarlar.Server, canvas.width - 650, canvas.height - 300);
       ctx.fillStyle = "#e7d02e";
       ctx.fillText(ayarlar.Server, canvas.width - 650, canvas.height - 300);
   
       ctx.beginPath();
       ctx.lineWidth = 10;
       ctx.strokeStyle = "#e7d02e";
       ctx.arc(193, 200, 130, 0, Math.PI * 2, true);
       ctx.stroke();
       ctx.closePath();
       ctx.clip();
       const avatar = await Canvas.loadImage(member.user.avatar ? member.user.avatarURL({ extension: "jpg" }) : "https://cdn.discordapp.com/attachments/1102669633372311675/1116873769823256596/0oO5sAneb9lJP6l8c6DH4aj6f85qNpplQVHmPmbbBxAukDnlO7DarDW0b-kEIHa8SQ.png");
       ctx.drawImage(avatar, 58, 70, 270, 270);
        
       const img = new AttachmentBuilder().setFile(canvas.toBuffer())

        data = await Coin.findOne({guildID:message.guild.id,userID:member.id})
        let msg = await message.reply({content: `💳 | ${member.id == message.member.id ? `${member}` : `${member} üyesinin`} **${ayarlar.Server} Parası**  ${member.id == message.member.id ? "hesabın" : "hesabı"} aşağıda görüntülenmektedir.`, files: [img], components: [row]})
        const collector = msg.createMessageComponentCollector({ time: 30000 });

        collector.on("collect", async (button) => {
          if (button.user.id != member.id) {
            return await button.reply({
              content: `Bu butonları sadece ${member} kullanabilir.`,
              ephemeral: true
            })
          }
          if(button.customId === "magaza") {
            let kom = client.commands.find(x => x.name == "market")
            if(kom) kom.onCommand(client, message, args, ertuembed)
            msg.delete().catch(err => {})
            button.deferUpdate().catch(err => {})
          }

          if(button.customId === "günlük") {
            let kom = client.commands.find(x => x.name == "daily")
            if(kom) kom.onCommand(client, message, args, ertuembed)
            msg.delete().catch(err => {})
            button.deferUpdate().catch(err => {})
          }
        
        });
       


    },

  };
  
function numberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function applyText(canvas, text, defaultFontSize, width, font){
  const ctx = canvas.getContext("2d");
  do {
      ctx.font = `${(defaultFontSize -= 1)}px ${font}`;
  } while (ctx.measureText(text).width > width);
  return ctx.font;
}
