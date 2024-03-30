const { ApplicationCommandOptionType,PermissionsBitField  } = require("discord.js");
const Coin = require("../../../../../../Global/Schemas/ekonomi");
const {slotgif} = require("../../../../../../Global/Settings/Emojis.json");
const kanal = require("../../../../../../Global/Settings/AyarName");
const ertucuk = require("../../../../../../Global/Settings/System");

module.exports = {
    name: "slot",
    description: "Slot",
    category: "EKONOMI",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: [],
      usage: ".slot <1-50000>", 
    },
  

    onLoad: function (client) { },

    onCommand: async function (client, message, args, ertuembed) {

let channels = ["bot-commands","coin","coin-chat"]
if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !channels.includes(message.channel.name)) return message.reply({ content: `${channels.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

const slot = [
message.guild.emojis.cache.find(x=> x.name == "slotkalp"),
message.guild.emojis.cache.find(x=> x.name == "slotkiraz"),
message.guild.emojis.cache.find(x=> x.name == "slotpatlican")
] 

let betCoin = Number(args[0])
if(!betCoin || !Number(args[0])) return message.reply({content:`Kaç coin ile oynamak istiyorsun ?`})
if(betCoin >= 50000) return message.reply({content:"50.000 coinden fazla bir coin ile oyun oynamayazsın"})


let mainslot1 = slot[Math.floor(Math.random() * slot.length)];
let mainslot2 = slot[Math.floor(Math.random() * slot.length)];
let mainslot3 = slot[Math.floor(Math.random() * slot.length)];

const messageMemberCoinData = await Coin.findOne({guildID:message.guild.id,userID:message.member.id})
if(!messageMemberCoinData) return message.reply({embeds:[ertuembed.setDescription(`${message.member}, **Coin** Profiliniz bulunmamaktadır. \`.coin\` yazarak profilinizi oluşturabilirsiniz.`)]}) 
if(messageMemberCoinData.coin < betCoin) return message.reply({content:`Bu miktarla oynayabilmek için **${betCoin - messageMemberCoinData.coin}\`** daha coine ihtiyacın var.`}) 

let slotMessage = await message.channel.send({content:`
\`___SLOTS___\`
  ${slotgif} ${slotgif} ${slotgif}
**\`|         |\`**
**\`|         |\`**
`})

setTimeout(() => {
if(mainslot1 === mainslot2 && mainslot1 === mainslot3 ) {
let carpma = betCoin * 2
messageMemberCoinData.coin = (messageMemberCoinData.coin + carpma)
messageMemberCoinData.gameSize = messageMemberCoinData.gameSize +1
messageMemberCoinData.save();
slotMessage.edit({content:`
\`___SLOTS___\`
  ${mainslot1} ${mainslot2} ${mainslot3}
**\`|         |\`**
**\`|         |\`**
**Tebrikler ${message.member.displayName}, ${carpma} \`${ertucuk.Server} Parası\` Kazandın!**`})
} else {
messageMemberCoinData.coin = (messageMemberCoinData.coin - betCoin)
messageMemberCoinData.gameSize = messageMemberCoinData.gameSize +1
messageMemberCoinData.save();
slotMessage.edit({content:`
\`___SLOTS___\`
  ${mainslot1} ${mainslot2} ${mainslot3}
**\`|         |\`**
**\`|         |\`**
**Üzgünüm... \`${message.member.displayName}\`, Kaybettin!**`})
}
}, 2500)

     },

  };