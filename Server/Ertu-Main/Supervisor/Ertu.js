require("../../../Global/Helpers/Extenders/Prototypes");

const System = global.system = require("../../../Global/Settings/System");
const { Ertu } = require("./src/Structures/Ertu");
const { Tasks } = require("./src/Structures/Classes");
const { Collection,GuildMember, Client,GatewayIntentBits, Partials, EmbedBuilder,PermissionsBitField,Intents,ButtonStyle } = require("discord.js");
const guard = require("../../Ertu-Guard/Schemas/Guard");
const query = require("../../Ertu-Guard/Additions/Distributors")
const Distributors = global.Distributors = [];

let client = global.client = new Ertu({ 
   Directory: "Ertu V14 Bot", 
   token: System.Mainframe.Moderation,
});

client.loadClient({
Events   : true,
Commands : true,
Database : true,
});

client.rolbul = function (rolisim) {
  let rol = client.guilds.cache.get(System.ServerID).roles.cache.find(ertu => ertu.name === rolisim)
  if (!rol) return false;
  return rol;
}

client.emoji = function (emojiName)  {
  const emoji = client.emojis.cache.find(x => x.name.includes(emojiName));
  if (!emoji) return null;
  return emoji;
} 

client.progressBar = function progressBar(value, maxValue, size){
  const progress = Math.round(size * (value / maxValue > 1 ? 1 : value / maxValue));
  const emptyProgress = size - progress > 0 ? size - progress : 0;

  const progressText = `${client.emoji("BlueMid")}`.repeat(progress > 0 ? progress : 0);
  const emptyProgressText = `${client.emoji("EmptyMid")}`.repeat(emptyProgress);

  return emptyProgress > 0
    ? progress === 0
      ? `${client.emoji("EmptyStart")}` + progressText + emptyProgressText + `${client.emoji("EmptyEnd")}`
      : `${client.emoji("BlueStart")}` + progressText + emptyProgressText + `${client.emoji("EmptyEnd")}`
    : `${client.emoji("BlueStart")}` + progressText + emptyProgressText + `${client.emoji("BlueEnd")}`;
}; 

const rakam = client.sayıEmoji = (sayi) => {
  var ertu = sayi.toString().replace(/ /g, "     ");
  var ertu2 = ertu.match(/([0-9])/g);
  ertu = ertu.replace(/([a-zA-Z])/g, "Belirlenemiyor").toLowerCase();
  if (ertu2) {
    ertu = ertu.replace(/([0-9])/g, d => {
      return {
        '0': client.emoji("sayiEmoji_sifir") !== null ? client.emoji("sayiEmoji_sifir") : "\` 0 \`",
        '1': client.emoji("sayiEmoji_bir") !== null ? client.emoji("sayiEmoji_bir") : "\` 1 \`",
        '2': client.emoji("sayiEmoji_iki") !== null ? client.emoji("sayiEmoji_iki") : "\` 2 \`",
        '3': client.emoji("sayiEmoji_uc") !== null ? client.emoji("sayiEmoji_uc") : "\` 3 \`",
        '4': client.emoji("sayiEmoji_dort") !== null ? client.emoji("sayiEmoji_dort") : "\` 4 \`",
        '5': client.emoji("sayiEmoji_bes") !== null ? client.emoji("sayiEmoji_bes") : "\` 5 \`",
        '6': client.emoji("sayiEmoji_alti") !== null ? client.emoji("sayiEmoji_alti") : "\` 6 \`",
        '7': client.emoji("sayiEmoji_yedi") !== null ? client.emoji("sayiEmoji_yedi") : "\` 7 \`",
        '8': client.emoji("sayiEmoji_sekiz") !== null ? client.emoji("sayiEmoji_sekiz") : "\` 8 \`",
        '9': client.emoji("sayiEmoji_dokuz") !== null ? client.emoji("sayiEmoji_dokuz") : "\` 9 \`"
      }[d];
    });
  }
  return ertu;
}

const emojiBul = global.emojiBul = async function(name){
return await client.emojis.cache.find(x => x.name.includes(name));
}

const { GiveawaysManager } = require('discord-giveaways');
const manager = new GiveawaysManager(client, {
  storage: './../../../Global/Settings/giveaways.json',
  default: {
    botsCanWin: false,
    embedColor: '#00ff00',
    embedColorEnd: '#ff0000',
    reaction: '🎉',
    lastChance: {
      enabled: true,
      content: 'KATILIM İÇİN SON ŞANS!',
      threshold: 20000,
      embedColor: '#FF0000'
    }

  }
});
client.giveawaysManager = manager;

const tasks = new Tasks(client)

setInterval(async () => {
  await tasks.updateLeaderboards()
}, 300000)




  const penals = require("../../../Global/Schemas/penals");
  client.penalize = async (guildID, userID, type, active = true, staff, reason, temp = false, finishDate = undefined) => {
    let id = await penals.find({ guildID });
    id = id ? id.length + 1 : 1;
    return await new penals({ id, userID, guildID, type, active, staff, reason, temp, finishDate }).save();
  };

  client.fetchUser = async (userID) => {
    try {
      return await client.users.fetch(userID);
    } catch (err) {
      return undefined;
    }
  };

  client.fetchBan = async (guild, userID) => {
    try {
      return await guild.bans.fetch(userID);
    } catch (err) {
      return undefined;
    }
  };

  const chunkify = global.chunkify = function (array,chunkSize) {
    if (!array || !chunkSize) return array;
  
    let length = array.length;
    let slicePoint = 0;
    let result = [];
  
    while (slicePoint < length) {
      result.push(array.slice(slicePoint, slicePoint + chunkSize))
      slicePoint += chunkSize;
    }
    return result;
  }

  const startDistributors = global.startDistributors = async function() {
    require("../../../Global/Settings/System").Security.Dis.forEach(async (token) => {
          let botClient = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences] });
            botClient.on("ready", () => {
              botClient.user.setActivity(System.Presence.Message, {
                type: 3
              });
              botClient.queryTasks = new query();
              botClient.queryTasks.init(1000);
              Distributors.push(botClient)
               
              for (let index = 0; index < Distributors.length; index++) {
                const welcome = Distributors[index];
                welcome.on("ready", async ()=> {
                  const guild = welcome.guilds.cache.get(require("../../../Global/Settings/System").ServerID)
                  const channel = guild.channels.cache.get(require("../../../Global/Settings/System"))
                new voice.joinVoiceChannel({
                      channelId: System.BotVoiceChannel,
                      guildId: System.ServerID,
                      adapterCreator: channel.guild.voiceAdapterCreator,
                    });
                })
              }
            })
            await botClient.login(token).catch(err => {
              console.log(`Dağıtıcı Token Arızası`)
            })
      })
    }

    const fs = require('fs');
    const path = require('path');
    const GlobalFonts = require('@napi-rs/canvas').GlobalFonts;
    
    /**
     * Registers fonts from a specified directory using the @napi-rs/canvas library.
     * @param {string} fontsDirectory - The path to the directory containing font files.
     */
    function registerFontsFromDirectory(fontsDirectory) {
      fs.readdir(fontsDirectory, (err, files) => {
        if (err) {
          global.client.logger.error('Error reading directory: ');
          return;
        }
    
        const fontFiles = files.filter(file => /\.(ttf|otf)$/.test(file));
    
        if (files) {
          fontFiles.forEach(fontFile => {
            const fontName = path.basename(fontFile, path.extname(fontFile));
            const fontPath = path.join(fontsDirectory, fontFile);
            GlobalFonts.registerFromPath(fontPath, fontName);
          });
        }
      });
    }
    
    // Usage example
    const fontsDirectory = path.join(__dirname, './../../../Global/Assets');
    registerFontsFromDirectory(fontsDirectory);



module.exports = client;
client.connect();
