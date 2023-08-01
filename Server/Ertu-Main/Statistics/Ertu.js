require("../../../Global/Helpers/Extenders/Prototypes");

const System = require("../../../Global/Settings/System");
const { Ertu } = require("./src/Structures/Ertu");
const { Collection,GuildMember } = require("discord.js");


let client = global.client = new Ertu({ 
   Directory: "Ertu V14 Bot", 
   token: System.Mainframe.Statistics,
});

client.loadClient({
   Events   : true,
   Database : true,
});

client.emoji = function (name) {
   let emoji = client.guilds.cache.get(System.ServerID).emojis.cache.find(ertu => ertu.name == name)
   if (!emoji) return null;
   return emoji;
 }

 client.ranks = [
  { role: "1121409813537116211", coin: 200 },
  { role: "1121409824496816208", coin: 500 },
  { role: "1121409822194147348", coin: 800 },
  { role: "1121409821023940701", coin: 1000 },
  { role: "1121409819841155072", coin: 1300 },
  ]

 
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
