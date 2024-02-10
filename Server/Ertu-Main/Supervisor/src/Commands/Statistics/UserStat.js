const {  ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, AttachmentBuilder ,ComponentType,PermissionsBitField } = require("discord.js");
const friendShip = require("../../../../../../Global/Schemas/friendShip.js");
const { GetTools } = require("../../Extras/GetTools.js");
const kanal = require("../../../../../../Global/Settings/AyarName");
const moment = require('moment');
require("moment-duration-format")
moment.duration("hh:mm:ss").format()
const Canvas = require('@napi-rs/canvas')
const friendShip2 = require("../../../../../../Global/Schemas/chatFriend");
const { MessageStat, MessageUserChannel, VoiceStat, VoiceUserChannel, StreamerStat, StreamerUserChannel, CameraStat, CameraUserChannel } = require("../../../../../../Global/Models")

module.exports = {
  name: "stat",
  description: "Kullanıcının istatistik verilerini gösterir.",
  category: "STAT",
  cooldown: 0,
  command: {
    enabled: true,
    aliases: ["stat", "stats","istatistik","verilerim"],
    usage: ".stat",
  },
 
  onLoad: function (client) { },

  onCommand: async function (client, message, args) {

let kanallar = kanal.KomutKullanımKanalİsim;
if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
const mesajData = await MessageStat.findOne({ guildID: message.guild.id, userID: member.id });
const sesData = await VoiceStat.findOne({ guildID: message.guild.id, userID: member.id });

async function fetchUserData(memberId) {
  const [
      GetDataAge,
  ] = await Promise.all([
      GetTools.GetDataAge(message.guild.id, memberId),      
  ]);
  return {
      GetDataAge,
  };
}

const userData = await fetchUserData(member.id);
const GetAge = userData.GetDataAge;

const messageData = await MessageStat.find({ guildID: message.guild.id });
messageData.sort((a, b) => b.TotalStat - a.TotalStat);
const index = messageData.findIndex((x) => x.userID === member.user.id);
const sıralama = index === -1 ? "Verisi Yok." : `${index + 1}. sırada`; 

const voiceData = await VoiceStat.find({ guildID: message.guild.id });
voiceData.sort((a, b) => b.TotalStat - a.TotalStat);
const index2 = voiceData.findIndex((x) => x.userID === member.user.id);
const sıralama2 = index2 === -1 ? "Verisi Yok." : `${index2 + 1}. sırada`;

const streamData = await StreamerStat.find({ guildID: message.guild.id });
streamData.sort((a, b) => b.TotalStat - a.TotalStat);
const index3 = streamData.findIndex((x) => x.userID === member.user.id);
const sıralama3 = index3 === -1 ? "Verisi Yok." : `${index3 + 1}. sırada`; 

const cameraData = await CameraStat.find({ guildID: message.guild.id });
cameraData.sort((a, b) => b.TotalStat - a.TotalStat);
const index4 = cameraData.findIndex((x) => x.userID === member.user.id);
const sıralama4 = index4 === -1 ? "Verisi Yok." : `${index4 + 1}. sırada`; 

const colorMap = {
  0: "#A7F9F9",
  1: "#F6CD46",
  2: "#C1853C",
};

const textColor = colorMap[index] || "#FFFFFF";
const textColor2 = colorMap[index2] || "#FFFFFF";
const textColor3 = colorMap[index3] || "#FFFFFF";
const textColor4 = colorMap[index4] || "#FFFFFF";

const TopChannels = await MessageUserChannel.aggregate([{ $match: { userID: member.id } }, { $sort: { ChannelData: -1 } }, { $limit: 1 }]); 
const TopVoices = await VoiceUserChannel.aggregate([{ $match: { userID: member.id } }, { $sort: { ChannelData: -1 } }, { $limit: 1 }]); 

const getChannelName = (channelID) => {
const channel = client.channels.cache.get(channelID);
return channel ? channel.name : false;
}

const document = await friendShip.find({ id: member.id });
const topFriends = document && document.voiceFriends 
  ? 
    Object.keys(document.voiceFriends)
      .map(c => ({ id: c, total: document.voiceFriends[c] }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 1) 
  : 'Bulunmuyor.'

const theTopFriend = message.client.users.cache.get(topFriends[0].id)
// Friend Ship System End
//######################################-##################################################
// Friend Ship2 System Start
var chatFriend = await friendShip2.find({ userID: member.id }).sort({ yanitSayi: -1 });
chatFriend = chatFriend.length > 0 ? await client.users.fetch(chatFriend[0]?.repliedUser) : undefined;
// Friend Ship2 System End

let canvas = Canvas.createCanvas(1152, 585), 
    ctx = canvas.getContext("2d"); 
    let background = await Canvas.loadImage("https://cdn.discordapp.com/attachments/1128367598900355213/1156591765722243123/ertustat.png"); 
    ctx.drawImage(background, 0, 0, 1152, 585); 

    ctx.font = '40px "DINNextLTPro-Bold"';
    ctx.fillStyle = '#FFFFFF';
    let ertu = member.user.username;
    ctx.fillText(`${ertu}`, canvas.width / 10.00, 63);

    ctx.font = '24px "DINNextLTPro-Bold"';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`${GetAge ?? "Verisi Yok"}`, canvas.width / 1.32, 63);

    ctx.font = '21px "DINNextLTPro-Bold"';
    ctx.fillStyle = textColor2
    ctx.fillText(`${sıralama2}`, canvas.width / 5.60, 183);

    ctx.font = '21px "DINNextLTPro-Bold"';
    ctx.fillStyle = textColor
    ctx.fillText(`${sıralama}`, canvas.width / 5.60, 233);

    ctx.font = '21px "DINNextLTPro-Bold"';
    ctx.fillStyle = textColor3
    ctx.fillText(`${sıralama3}`, canvas.width / 5.60, 283);

    ctx.font = '21px "DINNextLTPro-Bold"';
    ctx.fillStyle = textColor4
    ctx.fillText(`${sıralama4}`, canvas.width / 5.60, 333);

    ctx.font = '21px "DINNextLTPro-Bold"';
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`${mesajData  ? mesajData.TotalStat : 0} mesaj`, canvas.width / 1.97, 183, 200, 400);

    ctx.font = '21px "DINNextLTPro-Bold"';
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`${mesajData  ? mesajData.DailyStat : 0} mesaj`, canvas.width / 1.97, 233, 200, 400);

    ctx.font = '21px "DINNextLTPro-Bold"';
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`${mesajData  ? mesajData.WeeklyStat : 0} mesaj`, canvas.width / 1.97, 283, 200, 400);

    ctx.font = '21px "DINNextLTPro-Bold"';
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`${mesajData  ? mesajData.MonthlyStat : 0} mesaj`, canvas.width / 1.97, 333, 200, 400);

    ctx.font = '21px "DINNextLTPro-Bold"';
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`${sesData ? formatDurations(sesData.TotalStat) : "Veri Yok."}`, canvas.width / 1.20, 183, 200, 400);

    ctx.font = '21px "DINNextLTPro-Bold"';
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`${sesData ? formatDurations(sesData.DailyStat) : "Veri Yok."}`, canvas.width / 1.20, 233, 200, 400);

    ctx.font = '21px "DINNextLTPro-Bold"';
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`${sesData ? formatDurations(sesData.WeeklyStat) : "Veri Yok."}`, canvas.width / 1.20, 283, 200, 400);

    ctx.font = '21px "DINNextLTPro-Bold"';
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`${sesData ? formatDurations(sesData.MonthlyStat) : "Veri Yok."}`, canvas.width / 1.20, 333, 200, 400);

    for (let i = 0; i < TopChannels.length; i++) {
        const element = TopChannels[i];
        ctx.font = '19px "DINNextLTPro-Bold"';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${getChannelName(element.ChannelID) ? "#" + getChannelName(element.ChannelID) : element ? "#" + element.ChannelName : ""}`, canvas.width / 11.30, 463);
        ctx.font = '19px "DINNextLTPro-Bold"';
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(`${element ? element.ChannelData + " mesaj" : ""}`, canvas.width / 3.00, 463);;
      }
  
      for (let i = 0; i < TopVoices.length; i++) {
        const element = TopVoices[i];
        ctx.font = '19px "DINNextLTPro-Bold"';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${getChannelName(element.ChannelID) ? getChannelName(element.ChannelID) : element ? element.ChannelID : ""}`, canvas.width / 11.30, 512);
        ctx.font = '19px "DINNextLTPro-Bold"';
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(`${element ? formatDurations(element.ChannelData) : "Veri Yok."}`, canvas.width / 3.00, 512);
      }

    ctx.font = '23px "DINNextLTPro-Bold"';
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`${chatFriend ? `${chatFriend.username}` : "Bulunamadı."}`, canvas.width / 1.23, 463, 200, 400);
    
    ctx.font = '23px "DINNextLTPro-Bold"';
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`${theTopFriend ? theTopFriend.username : 'Bulunamadı.'}`, canvas.width / 1.23, 515, 200, 400);

    let image = await Canvas.loadImage(member.displayAvatarURL({ size: 128, extension: 'png' }))
    ctx.save();
    roundedImage(ctx,27,12,75,75,28);
    ctx.clip();
    ctx.drawImage(image, 27, 12, 75, 75);
    ctx.restore();

    let img = canvas.toBuffer('image/png')
    message.reply({ content: ``,files:[img]})
  },
};

function formatDurations(milliseconds) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let timeString = "";

    if (hours > 0) {
        const minutes2 = minutes % 60;
        timeString += hours + "," + (minutes2 < 10 ? "0" : "") + minutes2 + " saat";
    } else if (minutes > 0) {
        const seconds2 = seconds % 60;
        timeString += minutes + "," + (seconds2 < 10 ? "0" : "") + seconds2 + " dakika";
    } else {
        timeString += seconds + " saniye";
    }

    return timeString.trim();
}

  /**
     * roundedImage()
     * @property {ctx} ctx Canvas ctx
     * @param {object} ctx Canvas ctx 
     * @param {number|bigint} x Number
     * @param {number|bigint} y Number
     * @param {number|bigint} width Number
     * @param {number|bigint} height Number
     * @param {number|boolean} radius Number Or Boolean
     * @returns {roundedImage}
     * @example roundedImage(ctx,50,50,500,300,10)
     * @example roundedImage(ctx,50,50,500,300,true)
     */
  function roundedImage(ctx,x, y, width, height, radius) {
    if (radius === true) radius = 5;
    if (!radius || typeof radius !== "number") radius = 0;

    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();

    return ctx;
}