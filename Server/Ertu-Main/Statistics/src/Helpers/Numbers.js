const { Zero, One, Two, Three, Four, Five, Six, Seven, Eight, Nine } = require("../../../../../Global/Settings/Emojis.json");

const rakam = global.rakam = function(sayi) {
    var basamakbir = sayi.toString().replace(/ /g, "     ");
    var basamakiki = basamakbir.match(/([0-9])/g);
    basamakbir = basamakbir.replace(/([a-zA-Z])/g, "Belirlenemiyor").toLowerCase();
    if (basamakiki) {
        basamakbir = basamakbir.replace(/([0-9])/g, d => {
          return {
                  "0": system.Moderation.EmojiNumbers ? Zero : '0',
                  "1": system.Moderation.EmojiNumbers ? One : '1',
                  "2": system.Moderation.EmojiNumbers ? Two : '2',
                  "3": system.Moderation.EmojiNumbers ? Three : '3',
                  "4": system.Moderation.EmojiNumbers ? Four : '4',
                  "5": system.Moderation.EmojiNumbers ? Five : '5',
                  "6": system.Moderation.EmojiNumbers ? Six : '6',
                  "7": system.Moderation.EmojiNumbers ? Seven : '7',
                  "8": system.Moderation.EmojiNumbers ? Eight : '8',
                  "9": system.Moderation.EmojiNumbers ? Nine : '9',
          }[d];
      });
    }
    return system.Moderation.EmojiNumbers ? basamakbir : `**${basamakbir}**`;
  }
  