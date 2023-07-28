const { ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle,PermissionsBitField } = require("discord.js");
const canvafy = require("canvafy");
const moment = require("moment");
const Canvas = require('canvas')
const level = require("../../schemas/level");
const kanal = require("../../../../../../Global/Settings/AyarName");

const { registerFont } = require("canvas");
registerFont('./../../../Global/Assets/MarlinGeo-Black.otf', { family: 'Marlin Geo Black' })

module.exports = {
    name: "toplevel",
    description: "Sunucudaki leveli en çok olan üyeleri listeler",
    category: "STAT",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["toplevel","leveltop","levelsıralama","Toplevel","tlevel"],
      usage: ".toplevel", 
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

    onCommand: async function (client, message, args, ertuembed) {

      let kanallar = kanal.KomutKullanımKanalİsim;
if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 


        let rank1;
        let rank2;
        let rank3;
        let rank4;
        let rank5;
        let rank6;
        let rank7;
        let rank8;
        let rank9;
        let rank10;
        
        
        const data = await level.find({ guildID: message.guild.id });
        data.sort((a,b) => b.totalStat - a.totalStat).map((user, index) => {
        if(index == 0) rank1 = user.userID
        if(index == 1) rank2 = user.userID
        if(index == 2) rank3 = user.userID
        if(index == 3) rank4 = user.userID
        if(index == 4) rank5 = user.userID
        if(index == 5) rank6 = user.userID
        if(index == 6) rank7 = user.userID
        if(index == 7) rank8 = user.userID
        if(index == 8) rank9 = user.userID
        if(index == 9) rank10 = user.userID
        })
        
        data.sort((a,b) => b.totalStat - a.totalStat).map((user, index) => `${index + 1}. ${message.guild.members.cache.get(user.userID) ? message.guild.members.cache.get(user.userID) : "Kullanıcı Bulunamadı."} - (${user.level}.LVL)`).slice(0, 10).join("\n")
        
        
        const x1 = await level.findOne({ guildID: message.guild.id, userID: rank1 })
        const x2 = await level.findOne({ guildID: message.guild.id, userID: rank2 })
        const x3 = await level.findOne({ guildID: message.guild.id, userID: rank3 })
        const x4 = await level.findOne({ guildID: message.guild.id, userID: rank4 })
        const x5 = await level.findOne({ guildID: message.guild.id, userID: rank5 })
        const x6 = await level.findOne({ guildID: message.guild.id, userID: rank6 })
        const x7 = await level.findOne({ guildID: message.guild.id, userID: rank7 })
        const x8 = await level.findOne({ guildID: message.guild.id, userID: rank8 })
        const x9 = await level.findOne({ guildID: message.guild.id, userID: rank9 })
        const x10 = await level.findOne({ guildID: message.guild.id, userID: rank10 })
        
        
        const user1 = message.guild.members.cache.get(rank1);
        const user2 = message.guild.members.cache.get(rank2);
        const user3 = message.guild.members.cache.get(rank3);
        const user4 = message.guild.members.cache.get(rank4);
        const user5 = message.guild.members.cache.get(rank5);
        const user6 = message.guild.members.cache.get(rank6);
        const user7 = message.guild.members.cache.get(rank7);
        const user8 = message.guild.members.cache.get(rank8);
        const user9 = message.guild.members.cache.get(rank9);
        const user10 = message.guild.members.cache.get(rank10);
        ////////////////////////////////////////////////////////////////////////////
        let rank11;
        let rank22;
        let rank33;
        let rank44;
        let rank55;
        let rank66;
        let rank77;
        let rank88;
        let rank99;
        let rank100;
        
        
        const data2 = await level.find({ guildID: message.guild.id });
        data2.sort((a,b) => b.totalStat - a.totalStat).map((user, index) => {
        if(index == 0) rank11 = user.userID
        if(index == 1) rank22 = user.userID
        if(index == 2) rank33 = user.userID
        if(index == 3) rank44 = user.userID
        if(index == 4) rank55 = user.userID
        if(index == 5) rank66 = user.userID
        if(index == 6) rank77 = user.userID
        if(index == 7) rank88 = user.userID
        if(index == 8) rank99 = user.userID
        if(index == 9) rank100 = user.userID
        })
        
        data2.sort((a,b) => b.totalStat - a.totalStat).map((user, index) => `${index + 1}. ${message.guild.members.cache.get(user.userID) ? message.guild.members.cache.get(user.userID) : "Kullanıcı Bulunamadı."} - (${user.level}.LVL)`).slice(0, 10).join("\n")
        
        
        const xx1 = await level.findOne({ guildID: message.guild.id, userID: rank11 })
        const xx2 = await level.findOne({ guildID: message.guild.id, userID: rank22 })
        const xx3 = await level.findOne({ guildID: message.guild.id, userID: rank33 })
        const xx4 = await level.findOne({ guildID: message.guild.id, userID: rank44 })
        const xx5 = await level.findOne({ guildID: message.guild.id, userID: rank55 })
        const xx6 = await level.findOne({ guildID: message.guild.id, userID: rank66 })
        const xx7 = await level.findOne({ guildID: message.guild.id, userID: rank77 })
        const xx8 = await level.findOne({ guildID: message.guild.id, userID: rank88 })
        const xx9 = await level.findOne({ guildID: message.guild.id, userID: rank99 })
        const xx10 = await level.findOne({ guildID: message.guild.id, userID: rank100 })
        
        
        const user11 = message.guild.members.cache.get(rank11);
        const user22 = message.guild.members.cache.get(rank22);
        const user33 = message.guild.members.cache.get(rank33);
        const user44 = message.guild.members.cache.get(rank44);
        const user55 = message.guild.members.cache.get(rank55);
        const user66 = message.guild.members.cache.get(rank66);
        const user77 = message.guild.members.cache.get(rank77);
        const user88 = message.guild.members.cache.get(rank88);
        const user99 = message.guild.members.cache.get(rank99);
        const user100 = message.guild.members.cache.get(rank100);
    
        var Level = await level.find({ guildID: message.guild.id }).sort({ totalStat: -1 });
        var level31 = Level.filter(x=> message.guild.members.cache.get(x.userID)).splice(0, 10).map((x, index) => `${(index + 1,message.guild)} <@${x.userID}>: \`${moment.duration(x.totalStat).format("H [saat], m [dakika]")}\` ${x.userID == message.member.id ? "**(Siz)**":``}`).join(`\n`);
        const ses = `${level31.length > 0 ? level31 : "Veri Bulunmuyor."}`
    
        const luhuxlar = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('ses')
            .setLabel("Ses Seviye")
            .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
            .setCustomId('mesaj')
            .setLabel("Mesaj Seviye")
            .setStyle(ButtonStyle.Secondary),
        );
        let canvas = Canvas.createCanvas(640, 330),
            
        ctx = canvas.getContext("2d");
        let background = await Canvas.loadImage("https://cdn.discordapp.com/attachments/1129667498397143211/1129730358393450557/ertulevel.png");
        ctx.drawImage(background, 0, 0, 640, 330);
        const manitayadövmeseçmekfalan = await Canvas.loadImage(message.guild.iconURL({ extension: "jpg" }));
        ctx.drawImage(manitayadövmeseçmekfalan, 20, 20, 65, 65);
        var Box_Y = 0, Avatar_Y = 0, Tag_Y = 260, XP_Y = 55, Level_Y = 30, Rank_Y = 390;
        ctx.textAlign = 'center';
        ctx.font = '30px Marlin Geo Black';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${message.guild.name}`, 190, 65, 200, 400);
    
        ctx.textAlign = 'center';
        ctx.font = '20px Marlin Geo Black';
        ctx.fillStyle = '#00f2ff';
        ctx.fillText(`${user1 ? user1.displayName == user1.username ? "" + user1.username + " [Yok] " : user1.displayName : `Bulunamadı`}`, 145, 125, 200, 400,Tag_Y, 160);
    
        ctx.textAlign = 'center';
        ctx.font = '15px Marlin Geo Black';
        ctx.fillStyle = '#00f2ff';
        ctx.fillText(`${x1 ? x1.level : 0} lvl`, 285, 123, 200, 400,Tag_Y, 160)
    
        ctx.textAlign = 'center';
        ctx.font = '15px Marlin Geo Black';
        ctx.fillStyle = '#c5a63f';
        ctx.fillText(`${x2 ? x2.level : 0} lvl`, 285, 170, 200, 400,Tag_Y, 160)
    
        ctx.textAlign = 'center';
        ctx.font = '20px Marlin Geo Black';
        ctx.fillStyle = '#c5a63f';
        ctx.fillText(`${user2 ? user2.displayName == user2.username ? "" + user2.username + " [Yok] " : user2.displayName : `Bulunamadı`}`, 145, 170, 200, 400,Tag_Y, 160);
    
        ctx.textAlign = 'center';
        ctx.font = '20px Marlin Geo Black';
        ctx.fillStyle = '#c6883c';
        ctx.fillText(`${user3 ? user3.displayName == user3.username ? "" + user3.username + " [Yok] " : user3.displayName : `Bulunamadı`}`, 145, 215, 200, 400,Tag_Y, 160);
    
        ctx.textAlign = 'center';
        ctx.font = '15px Marlin Geo Black';
        ctx.fillStyle = '#c6883c';
        ctx.fillText(`${x3 ? x3.level : 0} lvl`, 285, 212, 200, 400,Tag_Y, 160)
    
        ctx.textAlign = 'center';
        ctx.font = '15px Marlin Geo Black';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${x4 ? x4.level : 0} lvl`, 285, 257, 200, 400,Tag_Y, 160)
    
        ctx.textAlign = 'center';
        ctx.font = "20px Marlin Geo Black";
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(user4 ? user4.displayName == user4.username ? "" + user4.username + " [Yok] " : user4.displayName : `Bulunamadı`, 145, 260, 200, 400,Tag_Y, 160);
    
        ctx.textAlign = 'center';
        ctx.font = '15px Marlin Geo Black';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${x5 ? x5.level : 0} lvl`, 285, 302, 200, 400,Tag_Y, 160)
    
        ctx.textAlign = 'center';
        ctx.font = '20px Marlin Geo Black';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${user5 ? user5.displayName == user5.username ? "" + user5.username + " [Yok] " : user5.displayName : `Bulunamadı`}`, 145, 305, 200, 400,Tag_Y, 160);
    
        ctx.textAlign = 'center';
        ctx.font = '20px Marlin Geo Black';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${user6 ? user6.displayName == user6.username ? "" + user6.username + " [Yok] " : user6.displayName : `Bulunamadı`}`, 465, 125, 200, 400, Tag_Y, 160);
        ctx.textAlign = 'center';
        ctx.font = '15px Marlin Geo Black';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${x6 ? x6.level : 0} lvl`, 600, 122, 200, 400,Tag_Y, 160)
        
        ctx.textAlign = 'center';
        ctx.font = '20px Marlin Geo Black';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${user7 ? user7.displayName == user7.username ? "" + user7.username + " [Yok] " : user7.displayName : `Bulunamadı`}`, 465, 170, 200, 400, Tag_Y, 160);
        ctx.textAlign = 'center';
        ctx.font = '15px Marlin Geo Black';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${x7 ? x7.level : 0} lvl`, 600, 170, 200, 400,Tag_Y, 160)
    
        ctx.textAlign = 'center';
        ctx.font = '15px Marlin Geo Black';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${x8 ? x8.level : 0} lvl`, 600, 215, 200, 400,Tag_Y, 160)
        ctx.textAlign = 'center';
        ctx.font = '20px Marlin Geo Black';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${user8 ? user8.displayName == user8.username ? "" + user8.username + " [Yok] " : user8.displayName : `Bulunamadı`}`, 465, 215, 200, 400, Tag_Y, 160);
    
        ctx.textAlign = 'center';
        ctx.font = '20px Marlin Geo Black';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${user9 ? user9.displayName == user9.username ? "" + user9.username + " [Yok] " : user9.displayName : `Bulunamadı`}`, 465, 260, 200, 400, Tag_Y, 160);
        ctx.textAlign = 'center';
        ctx.font = '15px Marlin Geo Black';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${x9 ? x9.level : 0} lvl`, 600, 260, 200, 400,Tag_Y, 160)
        ctx.textAlign = 'center';
        ctx.font = '20px Marlin Geo Black';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${user10 ? user10.displayName == user10.username ? "" + user10.username + " [Yok] " : user10.displayName : `Bulunamadı`}`, 465, 305, 200, 400, Tag_Y, 160);
        ctx.textAlign = 'center';
        ctx.font = '15px Marlin Geo Black';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${x10 ? x10.level : 0} lvl`, 600, 302, 200, 400,Tag_Y, 160)
    
    
        
    
        await message.channel.send({files: [{ attachment: canvas.toBuffer(), name: "ertulevel.png" }]})
        .then(msg=> {
            var filter = (button) => button.user.id === message.author.id;    
        const collector = msg.createMessageComponentCollector({ filter, time: 90000 });
        collector.on('collect', async (inter) => {
          await inter.deferUpdate();
          const button = inter.customId;
          if(button == "mesaj"){
            luhuxlar.components[0].setDisabled(false) 
            luhuxlar.components[1].setDisabled(true) 
            let canvas = Canvas.createCanvas(640, 330),
            
            ctx = canvas.getContext("2d");
            let background = await Canvas.loadImage("https://cdn.discordapp.com/attachments/1129667498397143211/1129730358393450557/ertulevel.png");
            ctx.drawImage(background, 0, 0, 640, 330);
            const manitayadövmeseçmekfalan = await Canvas.loadImage(message.guild.iconURL({ extension: "jpg" }));
            ctx.drawImage(manitayadövmeseçmekfalan, 20, 20, 65, 65);
            var Box_Y = 0, Avatar_Y = 0, Tag_Y = 260, XP_Y = 55, Level_Y = 30, Rank_Y = 390;
            ctx.textAlign = 'center';
            ctx.font = '30px Marlin Geo Black';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(`${message.guild.name}`, 190, 65, 200, 400);
        
            ctx.textAlign = 'center';
            ctx.font = '20px Marlin Geo Black';
            ctx.fillStyle = '#00f2ff';
            ctx.fillText(`${user11 ? user11.displayName == user11.username ? "" + user11.username + " [Yok] " : user11.displayName : `Bulunamadı`}`, 145, 125, 200, 400,Tag_Y, 160);
        
            ctx.textAlign = 'center';
            ctx.font = '15px Marlin Geo Black';
            ctx.fillStyle = '#00f2ff';
            ctx.fillText(`${x1 ? x1.level : 0} lvl`, 285, 123, 200, 400,Tag_Y, 160)
        
            ctx.textAlign = 'center';
            ctx.font = '15px Marlin Geo Black';
            ctx.fillStyle = '#c5a63f';
            ctx.fillText(`${x2 ? x2.level : 0} lvl`, 285, 170, 200, 400,Tag_Y, 160)
        
            ctx.textAlign = 'center';
            ctx.font = '20px Marlin Geo Black';
            ctx.fillStyle = '#c5a63f';
            ctx.fillText(`${user22 ? user22.displayName == user22.username ? "" + user22.username + " [Yok] " : user22.displayName : `Bulunamadı`}`, 145, 170, 200, 400,Tag_Y, 160);
        
            ctx.textAlign = 'center';
            ctx.font = '20px Marlin Geo Black';
            ctx.fillStyle = '#c6883c';
            ctx.fillText(`${user33 ? user33.displayName == user33.username ? "" + user33.username + " [Yok] " : user33.displayName : `Bulunamadı`}`, 145, 215, 200, 400,Tag_Y, 160);
        
            ctx.textAlign = 'center';
            ctx.font = '15px Marlin Geo Black';
            ctx.fillStyle = '#c6883c';
            ctx.fillText(`${x3 ? x3.level : 0} lvl`, 285, 212, 200, 400,Tag_Y, 160)
        
            ctx.textAlign = 'center';
            ctx.font = '15px Marlin Geo Black';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(`${x4 ? x4.level : 0} lvl`, 285, 257, 200, 400,Tag_Y, 160)
        
            ctx.textAlign = 'center';
            ctx.font = "20px Marlin Geo Black";
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(user44 ? user44.displayName == user44.username ? "" + user44.username + " [Yok] " : user44.displayName : `Bulunamadı`, 145, 260, 200, 400,Tag_Y, 160);
        
            ctx.textAlign = 'center';
            ctx.font = '15px Marlin Geo Black';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(`${x5 ? x5.level : 0} lvl`, 285, 302, 200, 400,Tag_Y, 160)
        
            ctx.textAlign = 'center';
            ctx.font = '20px Marlin Geo Black';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(`${user55 ? user55.displayName == user55.username ? "" + user55.username + " [Yok] " : user55.displayName : `Bulunamadı`}`, 145, 305, 200, 400,Tag_Y, 160);
        
            ctx.textAlign = 'center';
            ctx.font = '20px Marlin Geo Black';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(`${user66 ? user66.displayName == user66.username ? "" + user66.username + " [Yok] " : user66.displayName : `Bulunamadı`}`, 465, 125, 200, 400, Tag_Y, 160);
            ctx.textAlign = 'center';
            ctx.font = '15px Marlin Geo Black';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(`${x6 ? x6.level : 0} lvl`, 600, 122, 200, 400,Tag_Y, 160)
            
            ctx.textAlign = 'center';
            ctx.font = '20px Marlin Geo Black';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(`${user77 ? user77.displayName == user77.username ? "" + user77.username + " [Yok] " : user77.displayName : `Bulunamadı`}`, 465, 170, 200, 400, Tag_Y, 160);
            ctx.textAlign = 'center';
            ctx.font = '15px Marlin Geo Black';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(`${x7 ? x7.level : 0} lvl`, 600, 170, 200, 400,Tag_Y, 160)
        
            ctx.textAlign = 'center';
            ctx.font = '15px Marlin Geo Black';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(`${x8 ? x8.level : 0} lvl`, 600, 215, 200, 400,Tag_Y, 160)
            ctx.textAlign = 'center';
            ctx.font = '20px Marlin Geo Black';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(`${user88 ? user88.displayName == user88.username ? "" + user88.username + " [Yok] " : user88.displayName : `Bulunamadı`}`, 465, 215, 200, 400, Tag_Y, 160);
        
            ctx.textAlign = 'center';
            ctx.font = '20px Marlin Geo Black';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(`${user99 ? user99.displayName == user99.username ? "" + user99.username + " [Yok] " : user99.displayName : `Bulunamadı`}`, 465, 260, 200, 400, Tag_Y, 160);
            ctx.textAlign = 'center';
            ctx.font = '15px Marlin Geo Black';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(`${x9 ? x9.level : 0} lvl`, 600, 260, 200, 400,Tag_Y, 160)
            ctx.textAlign = 'center';
            ctx.font = '20px Marlin Geo Black';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(`${user100 ? user100.displayName == user100.username ? "" + user100.username + " [Yok] " : user100.displayName : `Bulunamadı`}`, 465, 305, 200, 400, Tag_Y, 160);
            ctx.textAlign = 'center';
            ctx.font = '15px Marlin Geo Black';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(`${x10 ? x10.level : 0} lvl`, 600, 302, 200, 400,Tag_Y, 160)
            await  msg.edit({components:[luhuxlar],files: [{ attachment: canvas.toBuffer(), name: "Card2.png" }]})
        
     }
     if(button == "ses"){
        luhuxlar.components[0].setDisabled(true) 
        luhuxlar.components[1].setDisabled(false) 
        let canvas = Canvas.createCanvas(640, 330),
            
        ctx = canvas.getContext("2d");
        let background = await Canvas.loadImage("https://cdn.discordapp.com/attachments/1066294817878986786/1113045267189604458/luhuxsex.png");
        ctx.drawImage(background, 0, 0, 640, 330);
        const manitayadövmeseçmekfalan = await Canvas.loadImage(message.guild.iconURL({ extension: "jpg" }));
        ctx.drawImage(manitayadövmeseçmekfalan, 20, 20, 65, 65);
        var Box_Y = 0, Avatar_Y = 0, Tag_Y = 260, XP_Y = 55, Level_Y = 30, Rank_Y = 390;
        ctx.textAlign = 'center';
        ctx.font = '30px Marlin Geo Black';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${message.guild.name}`, 190, 65, 200, 400);
    
        ctx.textAlign = 'center';
        ctx.font = '20px Marlin Geo Black';
        ctx.fillStyle = '#00f2ff';
        ctx.fillText(`${user1 ? user1.displayName == user1.username ? "" + user1.username + " [Yok] " : user1.displayName : `Bulunamadı`}`, 145, 125, 200, 400,Tag_Y, 160);
    
        ctx.textAlign = 'center';
        ctx.font = '15px Marlin Geo Black';
        ctx.fillStyle = '#00f2ff';
        ctx.fillText(`${x1 ? moment.duration(x1.totalStat).format("H [sa]") : 0}`, 285, 123, 200, 400,Tag_Y, 160)
    
        ctx.textAlign = 'center';
        ctx.font = '15px Marlin Geo Black';
        ctx.fillStyle = '#c5a63f';
        ctx.fillText(`${x2 ? moment.duration(x2.totalStat).format("H [sa]") : 0}`, 285, 170, 200, 400,Tag_Y, 160)
    
        ctx.textAlign = 'center';
        ctx.font = '20px Marlin Geo Black';
        ctx.fillStyle = '#c5a63f';
        ctx.fillText(`${user2 ? user2.displayName == user2.username ? "" + user2.username + " [Yok] " : user2.displayName : `Bulunamadı`}`, 145, 170, 200, 400,Tag_Y, 160);
    
        ctx.textAlign = 'center';
        ctx.font = '20px Marlin Geo Black';
        ctx.fillStyle = '#c6883c';
        ctx.fillText(`${user3 ? user3.displayName == user3.username ? "" + user3.username + " [Yok] " : user3.displayName : `Bulunamadı`}`, 145, 215, 200, 400,Tag_Y, 160);
    
        ctx.textAlign = 'center';
        ctx.font = '15px Marlin Geo Black';
        ctx.fillStyle = '#c6883c';
        ctx.fillText(`${x3 ? moment.duration(x3.totalStat).format("H [sa]") : 0}`, 285, 212, 200, 400,Tag_Y, 160)
    
        ctx.textAlign = 'center';
        ctx.font = '15px Marlin Geo Black';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${x4 ? moment.duration(x4.totalStat).format("H [sa]") : 0}`, 285, 257, 200, 400,Tag_Y, 160)
    
        ctx.textAlign = 'center';
        ctx.font = "20px Marlin Geo Black";
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(user4 ? user4.displayName == user4.username ? "" + user4.username + " [Yok] " : user4.displayName : `Bulunamadı`, 145, 260, 200, 400,Tag_Y, 160);
    
        ctx.textAlign = 'center';
        ctx.font = '15px Marlin Geo Black';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${x5 ? moment.duration(x5.totalStat).format("H [sa]") : 0}`, 285, 302, 200, 400,Tag_Y, 160)
    
        ctx.textAlign = 'center';
        ctx.font = '20px Marlin Geo Black';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${user5 ? user5.displayName == user5.username ? "" + user5.username + " [Yok] " : user5.displayName : `Bulunamadı`}`, 145, 305, 200, 400,Tag_Y, 160);
    
        ctx.textAlign = 'center';
        ctx.font = '20px Marlin Geo Black';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${user6 ? user6.displayName == user6.username ? "" + user6.username + " [Yok] " : user6.displayName : `Bulunamadı`}`, 465, 125, 200, 400, Tag_Y, 160);
        ctx.textAlign = 'center';
        ctx.font = '15px Marlin Geo Black';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${x6 ? moment.duration(x6.totalStat).format("H [sa]") : 0}`, 600, 122, 200, 400,Tag_Y, 160)
        
        ctx.textAlign = 'center';
        ctx.font = '20px Marlin Geo Black';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${user7 ? user7.displayName == user7.username ? "" + user7.username + " [Yok] " : user7.displayName : `Bulunamadı`}`, 465, 170, 200, 400, Tag_Y, 160);
        ctx.textAlign = 'center';
        ctx.font = '15px Marlin Geo Black';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${x7 ? moment.duration(x7.totalStat).format("H [sa]") : 0}`, 600, 170, 200, 400,Tag_Y, 160)
    
        ctx.textAlign = 'center';
        ctx.font = '15px Marlin Geo Black';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${x8 ? moment.duration(x8.totalStat).format("H [sa]") : 0}`, 600, 215, 200, 400,Tag_Y, 160)
        ctx.textAlign = 'center';
        ctx.font = '20px Marlin Geo Black';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${user8 ? user8.displayName == user8.username ? "" + user8.username + " [Yok] " : user8.displayName : `Bulunamadı`}`, 465, 215, 200, 400, Tag_Y, 160);
    
        ctx.textAlign = 'center';
        ctx.font = '20px Marlin Geo Black';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${user9 ? user9.displayName == user9.username ? "" + user9.username + " [Yok] " : user9.displayName : `Bulunamadı`}`, 465, 260, 200, 400, Tag_Y, 160);
        ctx.textAlign = 'center';
        ctx.font = '15px Marlin Geo Black';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${x9 ? moment.duration(x9.totalStat).format("H [sa]") : 0}`, 600, 260, 200, 400,Tag_Y, 160)
        ctx.textAlign = 'center';
        ctx.font = '20px Marlin Geo Black';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${user10 ? user10.displayName == user10.username ? "" + user10.username + " [Yok] " : user10.displayName : `Bulunamadı`}`, 465, 305, 200, 400, Tag_Y, 160);
        ctx.textAlign = 'center';
        ctx.font = '15px Marlin Geo Black';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${x10 ? moment.duration(x10.totalStat).format("H [sa]") : 0}`, 600, 302, 200, 400,Tag_Y, 160)
    
    
        
    
        await msg.edit({components:[luhuxlar],files: [{ attachment: canvas.toBuffer(), name: "Card.png" }]})
    
     }
    
    }) })
     },

    onSlash: async function (client, interaction) { },
  };