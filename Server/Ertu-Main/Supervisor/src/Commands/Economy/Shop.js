const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder,ButtonStyle } = require("discord.js");
const CoinDb = require("../../../../../../Global/Schemas/ekonomi");
const table = require("table");
const ertucuk = require("../../../../../../Global/Settings/System");

module.exports = {
    name: "market",
    description: "Mağazayı gösterir",
    category: "EKONOMI",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["mağaza","shop"],
      usage: ".market", 
    },
  

    onLoad: function (client) { },

    onCommand: async function (client, message, args, ertuembed) {

    let channels = ["bot-commands","coin","coin-chat"]
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !channels.includes(message.channel.name)) return message.reply({ content: `${channels.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

    let coinVeri = await CoinDb.findOne({ guildID: message.guild.id, userID: message.author.id });  
    if(!coinVeri) coinVeri = await CoinDb.findOneAndUpdate({guildID:message.guild.id,userID:message.author.id},{$set:{coin:1000,beklemeSuresi:Date.now(),gameSize:0,profilOlusturma:Date.now(),hakkimda:"Girilmedi",evlilik:false,evlendigi:undefined,dailyCoinDate:(Date.now() - 86400000)}},{upsert:true, new:true})

  let ring1 = new ButtonBuilder()
  .setStyle(ButtonStyle.Success)
  .setLabel("Pırlanta Yüzük")
  .setCustomId("ring1")
  .setEmoji("1168204669831614475")

  let ring2 = new ButtonBuilder()
  .setStyle(ButtonStyle.Success)
  .setLabel("Baget Yüzük")
  .setCustomId("ring2")
  .setEmoji("1168204617058889849")

  let ring3 = new ButtonBuilder()
  .setStyle(ButtonStyle.Success)
  .setLabel("Tektaş Yüzük")
  .setCustomId("ring3")
  .setEmoji("1168204523047755873")

  let ring4 = new ButtonBuilder()
  .setStyle(ButtonStyle.Success)
  .setLabel("Tria yüzük")
  .setCustomId("ring4")
  .setEmoji("1168204472682561586")

  let ring5 = new ButtonBuilder()
  .setStyle(ButtonStyle.Success)
  .setLabel("Beştaş Yüzük")
  .setCustomId("ring5")
  .setEmoji("1168204227110240347")

  let cancel = new ButtonBuilder()
  .setStyle(ButtonStyle.Danger)
  .setLabel('Market Çıkış')
  .setCustomId('cancel')
  .setEmoji("1099793976644599959");


 if (coinVeri.coin > 40000) {
    ring1.setStyle(ButtonStyle.Success);
  } else {
    ring1.setStyle(ButtonStyle.Secondary).setDisabled(true);
  }

 if (coinVeri.coin > 50000) {
    ring2.setStyle(ButtonStyle.Success);
  } else {
    ring2.setStyle(ButtonStyle.Secondary).setDisabled(true);
  }

 if (coinVeri.coin > 60000) {
    ring3.setStyle(ButtonStyle.Success);
  } else {
    ring3.setStyle(ButtonStyle.Secondary).setDisabled(true);
  }

 if (coinVeri.coin > 125000) {
    ring4.setStyle(ButtonStyle.Success);
  } else {
    ring4.setStyle(ButtonStyle.Secondary).setDisabled(true);
  }

 if (coinVeri.coin > 150000) {
    ring5.setStyle(ButtonStyle.Success);
  } else {
    ring5.setStyle(ButtonStyle.Secondary).setDisabled(true);
  }

const shop = new ActionRowBuilder()
.addComponents([ ring1, ring2, ring3 ]);

const shop2 = new ActionRowBuilder()
.addComponents([ ring4, ring5, cancel ]);

let urundata = [
    { Id: "1", urunAdi: "Pırlanta Yüzük", urunFiyati: "40000"},
    { Id: "2", urunAdi: "Baget Yüzük", urunFiyati: "50000"},
    { Id: "3", urunAdi: "Tektaş Yüzük", urunFiyati: "60000"},
    { Id: "4", urunAdi: "Tria Yüzük", urunFiyati: "125000"},
    { Id: "5", urunAdi: "Beştaş Yüzük", urunFiyati: "150000"}
]

let urunler = [["ID","Ürün İsmi","Ürün Fiyatı"]];
   urunler = urunler.concat(urundata.map(value => { 
     let urunfiyatioku = `${value.urunFiyati} 💵`	
      return [
    `#${value.Id}`,
    `${value.urunAdi}`,
    `${urunfiyatioku}`
    ]
}))

   const ertu = new EmbedBuilder()
   .setDescription(`Birine evlenme teklif etmek için bir yüzük satın alın! Bütün yüzükler aynı. Sevginizi göstermek için farklı katmanlar mevcut!`)
   .addFields(
    { name: `\`Bakiyen: ${coinVeri ? Math.floor(parseInt(coinVeri.coin)) : 0} ${ertucuk.Server} Parası\``,  value: `
    \`\`\`css\n${table.table(urunler, {
    border: table.getBorderCharacters(`void`),
    columnDefault: {
    paddingLeft: 0,
    paddingRight: 1,
    },
    columns: {
    0: {
    paddingLeft: 1
      },
    1: {
    paddingLeft: 1
      },
    2: {
    paddingLeft: 1,
     alignment: "center"
      },
    3: {
    paddingLeft: 1,
    paddingRight: 1,
      },
  }
  }

  )}\n\`\`\``, inline: false },
  )

  let msg = await message.channel.send({ embeds: [ertu],  components: [shop, shop2] });
  var filter = button => button.user.id === message.author.id;
  let collector = await msg.createMessageComponentCollector({ filter, time: 30000 })

  collector.on("collect", async (button) => {
  
if (button.customId === "ring1") {

 const embed = new EmbedBuilder()
.setDescription(`:tada: Tebrikler! Başarıyla **Pırlanta Yüzük** ürününü satın aldınız! `)
.setFooter({ text: `Satın Alma İşlemi Başarılı!`})
.setTimestamp()
.setAuthor({ name: message.author.tag, iconURL:  message.author.avatarURL({ dynamic: true })})
.setThumbnail("https://cdn.discordapp.com/emojis/590393334384558110")


 msg.edit({embeds: [embed], components: []})
 await CoinDb.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: -40000 } }, { upsert: true });
await CoinDb.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { pirlanta: 1 } }, { upsert: true })
    }

    if (button.customId === "ring2") {

 const embed = new EmbedBuilder()
 .setDescription(`:tada: Tebrikler! Başarıyla **Baget Yüzük** ürününü satın aldınız! `)
.setFooter({ text: `Satın Alma İşlemi Başarılı!`})
.setTimestamp()
.setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true })})
.setThumbnail("https://cdn.discordapp.com/emojis/590393334036693004")

 msg.edit({embeds: [embed], components: []})
 await CoinDb.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: -50000 } }, { upsert: true });
 await CoinDb.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { baget: 1 } }, { upsert: true });
    }

    if (button.customId === "ring3") {

 const embed = new EmbedBuilder()
 .setDescription(`:tada: Tebrikler! Başarıyla **Tektaş Yüzük** ürününü satın aldınız! `)
.setFooter({ text: `Satın Alma İşlemi Başarılı!`})
.setTimestamp()
.setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true })})
.setThumbnail("https://cdn.discordapp.com/emojis/590393334003138570")

 msg.edit({embeds: [embed], components: []})
 await CoinDb.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: -60000 } }, { upsert: true });
 await CoinDb.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { tektas: 1 } }, { upsert: true });
    }

    if (button.customId === "ring4") {

 const embed = new EmbedBuilder()
 .setDescription(`:tada: Tebrikler! Başarıyla **Tria Yüzük** ürününü satın aldınız! `)
.setFooter({ text: `Satın Alma İşlemi Başarılı!`})
.setTimestamp()
.setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true })})
.setThumbnail("https://cdn.discordapp.com/emojis/590393335819272203.gif")

 msg.edit({embeds: [embed], components: []})
 await CoinDb.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: -125000 } }, { upsert: true });
 await CoinDb.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { tria: 1 } }, { upsert: true });
    }

    if (button.customId === "ring5") {

 const embed = new EmbedBuilder()
 .setDescription(`:tada: Tebrikler! Başarıyla **Beştaş Yüzük** ürününü satın aldınız! `)
.setFooter({ text: `Satın Alma İşlemi Başarılı!`})
.setTimestamp()
.setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true })})
.setThumbnail("https://cdn.discordapp.com/emojis/590393335915479040.gif")

 msg.edit({embeds: [embed], components: []})
 await CoinDb.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: -150000 } }, { upsert: true });
 await CoinDb.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { bestas: 1 } }, { upsert: true });
    }

})

     },

  };