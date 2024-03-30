const { ApplicationCommandOptionType,ActionRowBuilder, ButtonBuilder, ButtonStyle,PermissionsBitField  } = require("discord.js");
const CoinDb = require("../../../../../../Global/Schemas/ekonomi");
const kanal = require("../../../../../../Global/Settings/AyarName");
const ertucuk = require("../../../../../../Global/Settings/System");

module.exports = {
    name: "yazitura",
    description: "Yazı Tura atarsınız",
    category: "EKONOMI",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["yazıtura","yazi-tura","yazı-tura","yt"],
      usage: ".yazitura <1-50000>", 
    },
  

    onLoad: function (client) { },

    onCommand: async function (client, message, args,ertuembed) {
      let channels = ["bot-commands","coin","coin-chat"]
      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !channels.includes(message.channel.name)) return message.reply({ content: `${channels.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 
        let betCoin = Number(args[0])
        if(!betCoin || !Number(args[0])) return message.reply({content:`Kaç coin ile oynamak istiyorsun ?`})
        if(betCoin >= 50000) return message.reply({content:"50.000 coinden fazla bir coin ile oyun oynamayazsın"})
        
        const messageMemberCoinData = await CoinDb.findOne({guildID:message.guild.id,userID:message.member.id})
        if(!messageMemberCoinData) return message.reply({embeds:[ertuembed.setDescription(`${message.member}, **Coin** Profiliniz bulunmamaktadır. \`.coin\` yazarak profilinizi oluşturabilirsiniz.`)]}) 
        if(messageMemberCoinData.coin < betCoin) return message.reply({content:`Bu miktarla oynayabilmek için **${betCoin - messageMemberCoinData.coin}\`** daha coine ihtiyacın var.`}) 
        await message.channel.send({
          components:[
            new ActionRowBuilder()
            .setComponents(
              new ButtonBuilder().setCustomId("yazi").setLabel("Yazı").setStyle(ButtonStyle.Secondary),
              new ButtonBuilder().setCustomId("tura").setLabel("Tura").setStyle(ButtonStyle.Secondary),
            )
          ],
          content:`:coin: ${message.member}, Coinini 2'ye katlamak için yazı mı ?, tura mı ? sorusuna cevap vermelisin!
**
Yazı mı ? 
Tura mı ?
**`}).then(async msg => {
          var filter = (button) => button.user.id === message.author.id;
          const collector = msg.createMessageComponentCollector({ filter, time: 30000 });
          collector.on('collect', async (inter) => {
            await inter.deferUpdate()
            const ihtimaller = ["yazi","tura"];
            const sonuc = await ihtimaller[Number(Math.floor(Math.random()*2))];
          const secim = inter.customId;
          inter.channel.send({content:`${message.member}, **Para Fırlatıldı!**`}).then(async sonucMSG=> {
          if(msg) await msg.delete();
          setTimeout(async() => {
           if(secim == sonuc){
            await CoinDb.findOneAndUpdate({guildID:message.guild.id,userID:message.member.id},{$inc:{coin:(betCoin*2),gameSize:1}},{upsert:true})
            await sonucMSG.edit({content:`**${secim} Çıktı, ${message.member} ${(betCoin*2)} \`${ertucuk.Server} Parası\` kazandın!**`})
           } else {
            await CoinDb.findOneAndUpdate({guildID:message.guild.id,userID:message.member.id},{$inc:{coin:(-betCoin),gameSize:1}},{upsert:true})
            sonucMSG.edit({content:`**Üzgünüm ${message.member}, ${sonuc} Çıktı ve ${betCoin} Adet \`${ertucuk.Server} Parası\` kaybettin!**`})
           }
          }, 3000);
          })
          })
        })
     },

  };