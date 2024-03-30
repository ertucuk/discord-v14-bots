const { ApplicationCommandOptionType,ActionRowBuilder, StringSelectMenuBuilder, Events,PermissionsBitField } = require("discord.js");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const ertucuk = require("../../../../../../Global/Settings/System");
const { ertu_nitro, ertu_exxen, ertu_netflix, ertu_youtube, ertus_potify } = require("../../../../../../Global/Settings/Emojis.json");

const Ec = [
"Etkinlik",
"Cekilis"
];

const Horoscopes = [
    "Koç",
    "Aslan",
    "Yay",
    "Balık",
    "Ikizler",
    "Kova",
    "Akrep",
    "Terazi",
    "Boğa",
    "Yengeç",
    "Oğlak"
];

const Ship = [
    "Couple",
    "Alone"
];
const Games = [
  "LOL",
  "CSGO",
  "Minecraft",
  "Valorant",
  "Fortnite",
  "GTA",
  "PUBG",
  "MLBB",
  "FiveM",
];

const Colors = [
 "Siyah",
 "Beyaz",
 "Kirmizi",
 "Mavi",
 "Yeşil",
 "Kahverengi",
 "Mor",
 "Pembe",
];

module.exports = {
    name: "menü",
    description: "Etkinlik menüsünü açar",
    category: "OWNER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["menu"],
      usage: ".menü", 
    },
  

    onLoad: function (client) {

      client.on(Events.InteractionCreate, async (interaction) => {

        if(interaction.isStringSelectMenu()) {
          if(interaction.customId === "ertu") {

            const etkinlik = await client.guilds.cache.get(ertucuk.ServerID).roles.cache.find(x => x.name.includes("Etkinlik Duyuru"));
            const cekilis = await client.guilds.cache.get(ertucuk.ServerID).roles.cache.find(x => x.name.includes("Cekilis Duyuru"));
            
        
  
            let eventsMap = new Map([
                ["etkinlik", etkinlik],
                ["çekiliş", cekilis],
            ]);
            let roles = [etkinlik, cekilis];
            let roleToAdd = [];
            
            for (let index = 0; index < interaction.values.length; index++) {
                let ids = interaction.values[index].toLowerCase();
                let selectedRole = eventsMap.get(ids);
                if (selectedRole) {
                    roleToAdd.push(selectedRole);
                }
            }
            
            if (interaction.values[0] === "ecRemove") {
              await interaction.member.roles.remove(roles.filter(Boolean)).catch(err => {
                  console.error( err);
              });
          } else {
              if (!interaction.values.length) {
                  await interaction.member.roles.remove(roles.filter(Boolean)).catch(err => {
                      console.error( err);
                  });
              } else if (roleToAdd.length > 0) {
                  await interaction.member.roles.add(roleToAdd.filter(Boolean)).catch(err => {
                  console.error(err);
                  })
              } 
          }
          
          interaction.reply({ content: "Başarıyla Rolleriniz güncellendi!", ephemeral: true });
          } 
          if(interaction.customId === "ertu1") {
          
    const koç = await client.guilds.cache.get(ertucuk.ServerID).roles.cache.find(x => x.name.includes("Koç"))
    const boğa = await client.guilds.cache.get(ertucuk.ServerID).roles.cache.find(x => x.name.includes("Boğa"))
    const ikizler = await client.guilds.cache.get(ertucuk.ServerID).roles.cache.find(x => x.name.includes("İkizler"))
    const yengeç = await client.guilds.cache.get(ertucuk.ServerID).roles.cache.find(x => x.name.includes("Yengeç"))
    const aslan = await client.guilds.cache.get(ertucuk.ServerID).roles.cache.find(x => x.name.includes("Aslan"))
    const başak = await client.guilds.cache.get(ertucuk.ServerID).roles.cache.find(x => x.name.includes("Başak"))
    const terazi = await client.guilds.cache.get(ertucuk.ServerID).roles.cache.find(x => x.name.includes("Terazi"))
    const akrep = await client.guilds.cache.get(ertucuk.ServerID).roles.cache.find(x => x.name.includes("Akrep"))
    const yay = await client.guilds.cache.get(ertucuk.ServerID).roles.cache.find(x => x.name.includes("Yay"))
    const oğlak = await client.guilds.cache.get(ertucuk.ServerID).roles.cache.find(x => x.name.includes("Oğlak"))
    const kova = await client.guilds.cache.get(ertucuk.ServerID).roles.cache.find(x => x.name.includes("Kova"))
    const balık = await client.guilds.cache.get(ertucuk.ServerID).roles.cache.find(x => x.name.includes("Balık"))
    
    let burçMap = new Map([
      ["koç", koç],
      ["boğa", boğa],
      ["ikizler", ikizler],
      ["yengeç", yengeç],
      ["aslan", aslan],
      ["başak", başak],
      ["terazi", terazi],
      ["akrep", akrep],
      ["yay", yay],
      ["oğlak", oğlak],
      ["kova", kova],
      ["balık", balık],
    ])
    let roles = [koç, boğa, ikizler, yengeç, aslan, başak, terazi, akrep, yay, oğlak, kova, balık]
    var role = []
            for (let index = 0; index < interaction.values.length; index++) {
              let ids = interaction.values[index]
              let den = burçMap.get(ids)
              var role = []
              role.push(den);
            }
            if (interaction.values[0] === "burcRoleRemove") {
                await interaction.member.roles.remove(roles)
              } else {
                if (!interaction.values.length) {
                    await member.roles.remove(roles).catch(err => {})
                  } else if (interaction.values.length > 1) {
                    await member.roles.add(roles).catch(err => {})
                  } else {
                    await interaction.member.roles.remove(roles).catch(err => {})
                    await interaction.member.roles.add(role).catch(err => {})
                  }
              }
    interaction.reply({ content: "Başarıyla Rolleriniz güncellendi!", ephemeral: true })      
          }
          if(interaction.customId === "ertu2") {
           
            const lol = await client.guilds.cache.get(ertucuk.ServerID).roles.cache.find(x => x.name.includes("LOL"))
            const csgo = await client.guilds.cache.get(ertucuk.ServerID).roles.cache.find(x => x.name.includes("CSGO"))
            const minecraft = await client.guilds.cache.get(ertucuk.ServerID).roles.cache.find(x => x.name.includes("Minecraft"))
            const valorant = await client.guilds.cache.get(ertucuk.ServerID).roles.cache.find(x => x.name.includes("Valorant"))
            const fortnite = await client.guilds.cache.get(ertucuk.ServerID).roles.cache.find(x => x.name.includes("Fortnite"))
            const gta = await client.guilds.cache.get(ertucuk.ServerID).roles.cache.find(x => x.name.includes("GTA"))
            const pubg = await client.guilds.cache.get(ertucuk.ServerID).roles.cache.find(x => x.name.includes("PUBG"))
            const mlbb = await client.guilds.cache.get(ertucuk.ServerID).roles.cache.find(x => x.name.includes("MLBB"))
            const fivem = await client.guilds.cache.get(ertucuk.ServerID).roles.cache.find(x => x.name.includes("FiveM"))

            let GameMap = new Map([
              ["lol", lol],
              ["csgo", csgo],
              ["minecraft", minecraft],
              ["valorant", valorant],
              ["fortnite", fortnite],
              ["gta", gta],
              ["pubg", pubg],
              ["mlbb", mlbb],
              ["fivem", fivem],
          ]);
          
          let roles = [lol, csgo, minecraft, valorant, fortnite, gta, pubg, mlbb, fivem];
          let roleToAdd = [];
          
          for (let index = 0; index < interaction.values.length; index++) {
              let ids = interaction.values[index];
              let selectedRole = GameMap.get(ids);
              
              if (selectedRole) {
                  roleToAdd.push(selectedRole);
              }
          }
          
          if (interaction.values[0] === "gameRoleRemove") {
              await interaction.member.roles.remove(roles.filter(Boolean)).catch(err => {
                  console.error( err);
              });
          } else {
              if (!interaction.values.length) {
                  await interaction.member.roles.remove(roles.filter(Boolean)).catch(err => {
                      console.error( err);
                  });
              } else if (roleToAdd.length > 0) {
                  await interaction.member.roles.add(roleToAdd.filter(Boolean)).catch(err => {
                      console.error("Error adding roles:", err);
                  });
              } else {
                  console.error("No valid roles to add.");
              }
          }
          
          interaction.reply({ content: "Başarıyla Rolleriniz güncellendi!", ephemeral: true });
          
          

          }
          if(interaction.customId === "ertu3") {

            const couple = await client.guilds.cache.get(ertucuk.ServerID).roles.cache.find(x => x.name.includes("Couple"))
            const alone = await client.guilds.cache.get(ertucuk.ServerID).roles.cache.find(x => x.name.includes("Alone"))

              let ilişki = new Map([
                  ["couple", couple],
                  ["alone", alone],
                ])
                let iliskiroller = [couple, alone]
                for (let index = 0; index < interaction.values.length; index++) {
                  let ids = interaction.values[index]
                  let den = ilişki.get(ids)
                  var role = []
                  role.push(den);
                }
                if (interaction.values[0] === "iliskiRoleRemove") {
                  await interaction.member.roles.remove(iliskiroller)
                } else {
                  if (!interaction.values.length) {
                      await member.roles.remove(iliskiroller).catch(err => {})
                    } else if (interaction.values.length > 1) {
                      await member.roles.add(iliskiroller).catch(err => {})
                    } else {
                      await interaction.member.roles.remove(iliskiroller).catch(err => {})
                      await interaction.member.roles.add(role).catch(err => {})
                    }
                }
                  interaction.reply({ content: "Başarıyla Rolleriniz güncellendi!", ephemeral: true })
          }
          if(interaction.customId === "ertu4") {

            const siyah = await client.guilds.cache.get(ertucuk.ServerID).roles.cache.find(x => x.name.includes("Siyah"))
            const beyaz  = await client.guilds.cache.get(ertucuk.ServerID).roles.cache.find(x => x.name.includes("Beyaz"))
            const kirmizi = await client.guilds.cache.get(ertucuk.ServerID).roles.cache.find(x => x.name.includes("Kirmizi"))
            const mavi  = await client.guilds.cache.get(ertucuk.ServerID).roles.cache.find(x => x.name.includes("Mavi"))
            const yesil  = await client.guilds.cache.get(ertucuk.ServerID).roles.cache.find(x => x.name.includes("Yeşil"))
            const kahverengi  = await client.guilds.cache.get(ertucuk.ServerID).roles.cache.find(x => x.name.includes("Kahverengi"))
            const mor = await client.guilds.cache.get(ertucuk.ServerID).roles.cache.find(x => x.name.includes("Mor"))
            const pembe = await client.guilds.cache.get(ertucuk.ServerID).roles.cache.find(x => x.name.includes("Pembe"))

            let color = new Map([
              ["siyah", siyah],
              ["beyaz", beyaz],
              ["kirmizi", kirmizi],
              ["mavi", mavi],
              ["yesil", yesil],
              ["kahverengi", kahverengi],
              ["mor", mor],
              ["pembe", pembe],
      
            ])
            let renkroller = [siyah, beyaz, kirmizi, mavi, yesil, kahverengi, mor, pembe,]
            for (let index = 0; index < interaction.values.length; index++) {
              let ids = interaction.values[index]
              let den = color.get(ids)
              var role = []
              role.push(den);
            }
            if (!interaction.member.roles.cache.has(ertum.TaggedRole) && !interaction.member.roles.cache.has(ertum.BoosterRole) && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            interaction.reply({ content: "Rollerin güncellenirken bir sorun meydana geldi **(İsminde Sunucu Tag'ı Yoktur veya Boost basmamışsın)**" , ephemeral: true })
            } else {
              if (interaction.values[0] === "renkRoleRemove") {
                await interaction.member.roles.remove(renkroller)
              } else {
                if (!interaction.values.length) {
                    await member.roles.remove(renkroller).catch(err => {})
                  } else if (interaction.values.length > 1) {
                    await member.roles.add(renkroller).catch(err => {})
                  } else {
                    await interaction.member.roles.remove(renkroller).catch(err => {})
                    await interaction.member.roles.add(role).catch(err => {})
                  }
              }
              interaction.reply({ content: "Başarıyla Rolleriniz güncellendi!", ephemeral: true })
            }
          }
        } 

      });


    },

    onCommand: async function (client, message, args, ertuembed) {

      const ecActionRow = new ActionRowBuilder()
      const burcActionRow = new ActionRowBuilder()
      const gameActionRow = new ActionRowBuilder()
      const iliskiActionRow = new ActionRowBuilder()
      const renkActionRow = new ActionRowBuilder()

      const ecSelect = new StringSelectMenuBuilder()
      .setCustomId("ertu")
      .setMaxValues(1)
      .setMinValues(1)
      .setPlaceholder("Etkinlik Rolleri");

      const burcSelect = new StringSelectMenuBuilder()
      .setCustomId("ertu1")
      .setMaxValues(1)
      .setMinValues(1)
      .setPlaceholder("Burç Rolleri");

      const gameSelect = new StringSelectMenuBuilder()
      .setCustomId("ertu2")
      .setMaxValues(1)
      .setMinValues(1)
      .setPlaceholder("Oyun Rolleri");

      const iliskiSelect = new StringSelectMenuBuilder()
      .setCustomId("ertu3")
      .setMaxValues(1)
      .setMinValues(1)
      .setPlaceholder("İlişki Rolleri");

      const renkSelect = new StringSelectMenuBuilder()
      .setCustomId("ertu4")
      .setMaxValues(1)
      .setMinValues(1)
      .setPlaceholder("Renk Rolleri");

      const emojiBul = (emojiName) => {
        if(!emojiName) return console.error(`[HATA]: Emoji Belirtiniz`);
        const emoji = client.emojis.cache.find(x => x.name.includes(emojiName));
        console.log(emoji ? emoji.id : "bulunamadı");
        return emoji ? emoji.id : "1102692516626710708";
      } 


      Ec.forEach(horoscope => {
        ecSelect.addOptions([
          {
            label: horoscope,
            value: horoscope.toLowerCase(),
            emoji: emojiBul(horoscope.toLowerCase().replace("ç", "c").replace("İ", "i").replace("ı", "i").replace("ö", "o").replace("ğ", "g").replace("ç", "c").replace("ü", "u").replace("ş", "s"))
          }
        ]);
      });
      
      Horoscopes.forEach(horoscope => {
        burcSelect.addOptions([
          {
            label: horoscope,
            value: horoscope.toLowerCase(),
            emoji: emojiBul(horoscope.toLowerCase().replace("ç", "c").replace("İ", "i").replace("ı", "i").replace("ö", "o").replace("ğ", "g").replace("ç", "c").replace("ü", "u").replace("ş", "s"))
          }
        ]);
      });
      
      Ship.forEach(ship => {
        iliskiSelect.addOptions([
          {
            label: ship,
            value: ship.toLowerCase(),
            emoji: emojiBul(ship.toLowerCase().replace("ç", "c").replace("ı", "i").replace("ö", "o").replace("ğ", "g").replace("ç", "c").replace("ü", "u").replace("ş", "s").replace("İ", "i")) 
          }
        ]);
      });

      Games.forEach(game => {
        gameSelect.addOptions([
          {
            label: game,
            value: game.toLowerCase(),
            emoji: emojiBul(game.toLowerCase())

          }
        ]);
      });

      Colors.forEach(colors => {
        renkSelect.addOptions([
          {
            label: colors,
            value: colors.toLowerCase(),
            emoji: emojiBul(colors.toLowerCase().replace("ç", "c").replace("ı", "i").replace("ö", "o").replace("ğ", "g").replace("ç", "c").replace("ü", "u").replace("ş", "s").replace("İ", "i")) 

          }
        ]);
      });

      ecSelect.addOptions([
        {
          label: "Rol İstemiyorum.",
          value: "ecRemove",
          emoji: "1102692516626710708"
        }
      ]);

      burcSelect.addOptions([
        {
          label: "Rol İstemiyorum.",
          value: "burcRoleRemove",
          emoji: "1102692516626710708"
        }
      ]);
      
      iliskiSelect.addOptions([
        {
          label: "Rol İstemiyorum.",
          value: "iliskiRoleRemove",
          emoji: "1102692516626710708"
        }
      ]);

      gameSelect.addOptions([
        {
          label: "Rol İstemiyorum.",
          value: "gameRoleRemove",
          emoji: "1102692516626710708",
        }
      ]);

      renkSelect.addOptions([
        {
          label: "Rol İstemiyorum.",
          value: "renkRoleRemove",
          emoji: "1102692516626710708"
        }
      ]);

      ecActionRow.addComponents(ecSelect);
      burcActionRow.addComponents(burcSelect);
      gameActionRow.addComponents(gameSelect);
      iliskiActionRow.addComponents(iliskiSelect);
      renkActionRow.addComponents(renkSelect);

  message.channel.send({ content: `Merhaba **${message.guild.name}** üyeleri,\nSunucuda sizleri rahatsız etmemek için  \` @everyone \`  veya  \` @here \`  atmayacağız. Sadece isteğiniz doğrultusunda aşağıda bulunan tepkilere tıklarsanız Çekilişler,Etkinlikler V/K ve D/C'den haberdar olacaksınız.\n\nEğer \` @Çekiliş Katılımcısı \` Rolünü alırsanız sunucumuzda sıkça vereceğimiz ${client.emoji("ertu_nitro")} , ${client.emoji("ertu_exxen")} , ${client.emoji("ertu_netflix")} , ${client.emoji("ertu_spotify")} , ${client.emoji("ertu_youtube")} ve daha nice ödüllerin bulunduğu çekilişlerden haberdar olabilirsiniz.\n\nEğer \` @Etkinlik Katılımcısı \` Rolünü alırsanız sunucumuzda düzenlenecek olan etkinlikler, konserler ve oyun etkinlikleri gibi etkinliklerden haberdar olabilirsiniz.\n\n__Aşağıda ki menülere basarak siz de bu ödülleri kazanmaya hemen başlayabilirsiniz!__` , components: [ecActionRow,burcActionRow, gameActionRow, iliskiActionRow, renkActionRow ] });


     },

  };