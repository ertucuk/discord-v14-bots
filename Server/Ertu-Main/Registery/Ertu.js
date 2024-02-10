require("../../../Global/Helpers/Extenders/Prototypes");

const System = require("../../../Global/Settings/System");
const { Ertu } = require("./src/Structures/Ertu");
const { Collection } = require("discord.js");

let client = global.client = new Ertu({ 
   Directory: "Ertu V14 Bot", 
   token: System.Mainframe.Registery,
});

client.loadClient({
   Events   : true,
   Database : true,
});

client.emoji = function (emojiName)  {
   const emoji = client.emojis.cache.find(x => x.name.includes(emojiName));
   if (!emoji) return null;
   return emoji;
 } 

 client.sayıEmoji = (sayi) => {
   var ertu = sayi.toString().replace(/ /g, "     ");
   var ertu2 = ertu.match(/([0-9])/g);
   ertu = ertu.replace(/([a-zA-Z])/g, "Belirlenemiyor").toLowerCase();
   if (ertu2) {
     ertu = ertu.replace(/([0-9])/g, d => {
       return {
         '0': client.emoji("sayiEmoji_sifir") !== null ? client.emoji("sayiEmoji_sifir") : "0",
         '1': client.emoji("sayiEmoji_bir") !== null ? client.emoji("sayiEmoji_bir") : "1",
         '2': client.emoji("sayiEmoji_iki") !== null ? client.emoji("sayiEmoji_iki") : "2",
         '3': client.emoji("sayiEmoji_uc") !== null ? client.emoji("sayiEmoji_uc") : "3",
         '4': client.emoji("sayiEmoji_dort") !== null ? client.emoji("sayiEmoji_dort") : "4",
         '5': client.emoji("sayiEmoji_bes") !== null ? client.emoji("sayiEmoji_bes") : "5",
         '6': client.emoji("sayiEmoji_alti") !== null ? client.emoji("sayiEmoji_alti") : "6",
         '7': client.emoji("sayiEmoji_yedi") !== null ? client.emoji("sayiEmoji_yedi") : "7",
         '8': client.emoji("sayiEmoji_sekiz") !== null ? client.emoji("sayiEmoji_sekiz") : "8",
         '9': client.emoji("sayiEmoji_dokuz") !== null ? client.emoji("sayiEmoji_dokuz") : "9"
       }[d];
     });
   }
   return ertu;
 }

module.exports = client;
client.connect();
