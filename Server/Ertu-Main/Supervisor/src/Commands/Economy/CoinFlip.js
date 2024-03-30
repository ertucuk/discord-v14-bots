const { ApplicationCommandOptionType,PermissionsBitField  } = require("discord.js");
const Coin = require("../../../../../../Global/Schemas/ekonomi");
const kanal = require("../../../../../../Global/Settings/AyarName");
const { red, green  } = require("../../../../../../Global/Settings/Emojis.json")
const ertucuk = require("../../../../../../Global/Settings/System");

module.exports = {
    name: "coinflip",
    description: "Para döndürürsünüz.",
    category: "EKONOMI",
    cooldown: 5,
    command: {
      enabled: true,
      aliases: ["cf"],
      usage: ".cf <1-50000>", 
    },
  

    onLoad: function (client) { },

    onCommand: async function (client, message, args, ertuembed) {

    if (!message.guild) return;

    
    let channels = ["bot-commands","coin","coin-chat"]
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !channels.includes(message.channel.name)) return message.reply({ content: `${channels.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

    let betCoin = Number(args[0])
    if(!betCoin || !Number(args[0])) return message.reply({content:`Kaç coin ile oynamak istiyorsun ?`})
    if(betCoin >= 50001) return message.reply({content:"50.000 coinden fazla bir coin ile oyun oynamayazsın"})

    const messageMemberCoinData = await Coin.findOne({guildID:message.guild.id,userID:message.member.id})
    if(!messageMemberCoinData) return message.reply({embeds:[ertuembed.setDescription(`${message.member}, **Coin** Profiliniz bulunmamaktadır. \`.coin\` yazarak profilinizi oluşturabilirsiniz.`)]}) 
    if(messageMemberCoinData.coin < betCoin) return message.reply({content:`Bu miktarla oynayabilmek için **${betCoin - messageMemberCoinData.coin}** daha ${ertucuk.Server} Parasına ihtiyacın var.`}) 
    
    let carpma = betCoin * 2

    let mesaj = await message.reply({ content:`
**Bahis Devam Ediyor!** 
\` ${carpma} ${ertucuk.Server} Parası \` için bahis döndürülüyor!
    
Belirlenen Miktar: \` ${betCoin} ${ertucuk.Server} Parası \``})
    
                let randomizeCoinCal = Math.floor(Math.random() * 10) + 1;
                if(randomizeCoinCal <= 5) {
                await Coin.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: -betCoin } }, { upsert: true });
                setTimeout(() => { 
                  mesaj.edit({ content:`
**Bahis Bitti!** 
\` ${carpma} ${ertucuk.Server} Parası \` için bahis döndürülme durdu ve kaybettin!
    
${client.emoji("ertu_carpi")} **Kaybettin!** Bu oyunu kazanamadın!
Kaybedilen Miktar: \` ${betCoin} ${ertucuk.Server} Parası \``})
                }, 2000)
                } else {
                await Coin.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: +carpma } }, { upsert: true });
                setTimeout(() => { 
                  mesaj.edit({ content:`
**Bahis Bitti!** 
\` ${carpma} ${ertucuk.Server} Parası \` için bahis döndürülme durdu ve kazandın!
                 
:tada: **Tebrikler!** Bu oyunu kazandın!
Kazanılan Miktar: \` ${carpma} ${ertucuk.Server} Parası \``})
                }, 2000)
            }
     },
  };