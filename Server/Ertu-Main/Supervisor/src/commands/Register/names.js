const { ApplicationCommandOptionType, EmbedBuilder,PermissionsBitField,ActionRowBuilder,ButtonBuilder,ButtonStyle } = require("discord.js");
const nameData = require("../../schemas/names")
const ertum = require("../../../../../../Global/Settings/Setup.json");
const { red , green } = require("../../../../../../Global/Settings/Emojis.json");
const kanal = require("../../../../../../Global/Settings/AyarName");

module.exports = {
    name: "names",
    description: "Belirttiğiniz üyenin isim geçmişine bakarsınız.",
    category: "REGISTER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["isimler"],
      usage: ".isimler <user/ID>",
    },
    slashCommand: {
      enabled: true,
      options: [
        {
            name: "ertu",
            description: "ertu",
            type: ApplicationCommandOptionType.Subcommand,
        },
      ],
    },

    onLoad: function (client) { },

    onCommand: async function (client, message, args) {

      let kanallar = kanal.KomutKullanımKanalİsim;
if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

      const row = new ActionRowBuilder()
      .addComponents(
      new ButtonBuilder().setCustomId("önce").setLabel("Önceki Sayfa").setStyle(ButtonStyle.Success).setEmoji("⏮️"),
      new ButtonBuilder().setCustomId("kapat").setLabel("Sayfaları Kapat").setStyle(ButtonStyle.Danger).setEmoji("❌"),
      new ButtonBuilder().setCustomId("sonra").setLabel("Sonraki Sayfa").setStyle(ButtonStyle.Success).setEmoji("⏭️"),
      );

        if(!ertum.ConfirmerRoles.some(ertucum => message.member.roles.cache.has(ertucum)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
        {
        message.reply({ content:`Yeterli yetkin yok!`}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        const data = await nameData.findOne({ guildID: message.guild.id, userID: member.user.id });
        if (!data) return message.reply({ embeds: [ new EmbedBuilder().setDescription(`${member} üyesinin isim kayıtı bulunamadı.`)]})

        let page = 1;       
        let liste = data ? data.names.map((x, i) => `${rakam(i + 1)} [<t:${Math.floor(x.date / 1000)}:R>] -  \` ${x.name} \` - ${x.sebep ? `(${x.sebep})` : ""}  ${x.rol ? `(${x.rol})` : ""} - ${x.yetkili ? `(<@${x.yetkili}>)` : ""}`) : "Bu kullanıcıya ait isim geçmişi bulunmuyor!"
        if (liste.length <= 10) {
        await message.channel.send({ embeds: [new EmbedBuilder().setDescription(`${liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join('\n')}`).setTimestamp().setAuthor({ name: `${member.user.username} üyesinin isim bilgileri;`})]});
        } else if (liste.length > 10) {
        var msg = await message.channel.send({ embeds: [new EmbedBuilder().setDescription(`${liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join('\n')}`).setTimestamp().setAuthor({ name: `${member.user.username} üyesinin isim bilgileri;`})], components: [row]});
        }
    
        if (msg) {
        var filter = (button) => button.user.id === message.author.id;
        let collector = await msg.createMessageComponentCollector({ filter, time: 60000 })
       
        collector.on("collect", async (button) => {
              
        if (liste.length > 10) {
    
       if(button.customId === "önce") {
        await button.deferUpdate();
    
                    if (liste.slice((page - 1) * 10 - 10, (page + 1) * 10).length <= 0) return;
                    page += 1;
                    let isimlerVeri = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
                    msg.edit({ embeds: [new EmbedBuilder() .setDescription(`${isimlerVeri}`).setTimestamp().setAuthor({ name: `${member.user.username} üyesinin isim bilgileri;` })]});
                }
        
       if(button.customId === "sonra") {
        await button.deferUpdate();
    
                    if (liste.slice((page + 1) * 10 - 10, (page - 1) * 10).length <= 0) return;
                    page -= 1;
                    let isimlerVeri = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
                    msg.edit({ embeds: [new EmbedBuilder() .setDescription(`${isimlerVeri}`).setTimestamp().setAuthor({ name: `${member.user.username} üyesinin isim bilgileri;` })]});
                }
       
       if(button.customId === "kapat") {
        await button.deferUpdate();
    
        row.components[0].setDisabled(true) 
        row.components[1].setDisabled(true) 
        row.components[2].setDisabled(true) 
        msg.edit({ components: [row] }); 
                }
            }
          })
        }
     },
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