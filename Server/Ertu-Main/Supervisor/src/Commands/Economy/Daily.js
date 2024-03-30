const { ApplicationCommandOptionType,ButtonBuilder, ActionRowBuilder, ButtonStyle,AttachmentBuilder,PermissionsBitField   } = require("discord.js");
const Coin = require("../../../../../../Global/Schemas/ekonomi");
const { red, green  } = require("../../../../../../Global/Settings/Emojis.json")
const kanal = require("../../../../../../Global/Settings/AyarName");
const ertucuk = require("../../../../../../Global/Settings/System");

module.exports = {
    name: "daily",
    description: "Günlük Para",
    category: "EKONOMI",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["günlük"],
      usage: ".günlük", 
    },
  

    onLoad: function (client) { },

    onCommand: async function (client, message, args, ertuembed) {
        let channels = ["bot-commands","coin","coin-chat"]
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !channels.includes(message.channel.name)) return message.reply({ content: `${channels.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 
 const member = message.member
 const data = await Coin.findOne({guildID:message.guild.id,userID:member.id})
 if(!data) return message.reply({embeds:[ertuembed.setDescription(`${message.member}, **Coin** Profiliniz bulunmamaktadır. \`.coin\` yazarak profilinizi oluşturabilirsiniz.`)]}) 
 if(Date.now() >= (data.dailyCoinDate + 86400000)){
     const sayi = await Math.floor(Math.random()*3);
     message.channel.send({
         files:[new AttachmentBuilder().setFile("https://cdn.discordapp.com/attachments/1075535580517113986/1078028663355879444/dhd.png")],
     components:[
         new ActionRowBuilder()
         .setComponents(
             new ButtonBuilder().setCustomId("1").setEmoji("🔴").setStyle(ButtonStyle.Secondary),
             new ButtonBuilder().setCustomId("2").setEmoji("🔴").setStyle(ButtonStyle.Secondary),
             new ButtonBuilder().setCustomId("3").setEmoji("🔴").setStyle(ButtonStyle.Secondary),
         )
     ]}).then(async msg =>{
         const collector = msg.createMessageComponentCollector({ time: 10000 });
 collector.on('collect', async (i) => {
     if (i.customId == `1`) {
         const coin = await Math.floor(Math.random() * 500);
         i.reply({ content: `**Tebrikler, __${coin}__ Adet \`${ertucuk.Server} Parası\` Kazandın!**`, ephemeral: true })
         await Coin.findOneAndUpdate({ guildID: message.guild.id, userID: i.user.id }, { $inc: { coin: coin } }, { upsert: true })
         await Coin.findOneAndUpdate({ guildID: message.guild.id, userID: i.user.id }, { $set: { dailyCoinDate: Date.now() } }, { upsert: true })
         if (msg) await msg.delete()
     }
     if (i.customId == `2`) {
         const coin = await Math.floor(Math.random() * 500);
         i.reply({ content: `**Tebrikler, __${coin}__ Adet \`${ertucuk.Server} Parası\` Kazandın!**`, ephemeral: true })
         await Coin.findOneAndUpdate({ guildID: message.guild.id, userID: i.user.id }, { $inc: { coin: coin } }, { upsert: true })
         await Coin.findOneAndUpdate({ guildID: message.guild.id, userID: i.user.id }, { $set: { dailyCoinDate: Date.now() } }, { upsert: true })
         if (msg) await msg.delete()
     }
     if (i.customId == `3`) {
         const coin = await Math.floor(Math.random() * 500);
         i.reply({ content: `**Tebrikler, __${coin}__ Adet \`${ertucuk.Server} Parası\` Kazandın!**`, ephemeral: true })
         await Coin.findOneAndUpdate({ guildID: message.guild.id, userID: i.user.id }, { $inc: { coin: coin } }, { upsert: true })
         await Coin.findOneAndUpdate({ guildID: message.guild.id, userID: i.user.id }, { $set: { dailyCoinDate: Date.now() } }, { upsert: true })
         if (msg) await msg.delete()
     } 
 })    
     })
     if(message) await message.react(`${client.emoji("ertu_onay")}`)
 }    else{
     if(message) await message.react(`${client.emoji("ertu_carpi")}`)
     message.reply({content:`**Günlük Coin Alamazsın! \n <t:${((data.dailyCoinDate+86400000)/1000).toFixed()}:R> günlük coin alabilirsin.**`})

 }
     },

  };