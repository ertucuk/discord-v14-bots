const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder,ButtonStyle } = require("discord.js");
const Coin = require("../../../../../../Global/Schemas/ekonomi");
const ertucuk = require("../../../../../../Global/Settings/System");

module.exports = {
    name: "evlen",
    description: "Belirttiğiniz kullanıcı ile evlenirsiniz.",
    category: "EKONOMI",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["marry","evlilik","evliliğim","evliligim","nikah","karım","karim","kocam","kocacim","kocam"],
      usage: ".evlen <@user/ID>", 
    },
  

    onLoad: function (client) { },

    onCommand: async function (client, message, args, ertuembed) {

    let channels = ["bot-commands","coin","coin-chat"]
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !channels.includes(message.channel.name)) return message.reply({ content: `${channels.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])

    let evlencem = await Coin.findOne({userID: message.author.id});

    let evlencem2 = await Coin.findOne({ userID: member ? member.user.id : null });
    if(!evlencem) evlencem = await Coin.findOneAndUpdate({guildID:message.guild.id,userID:message.author.id},{$set:{coin:1000,beklemeSuresi:Date.now(),gameSize:0,profilOlusturma:Date.now(),hakkimda:"Girilmedi",evlilik:false,evlendigi:undefined,dailyCoinDate:(Date.now() - 86400000)}},{upsert:true, new:true})

    if (!member && evlencem.evlilik === true) {
        let thumbnailURL;
        let aciklama;

        switch (evlencem.evliolduguyuzuk) {
          case "pirlanta":
            thumbnailURL = "https://cdn.discordapp.com/emojis/590393334384558110";
            aciklama = "Pırlanta Yüzük"
            break;
          case "baget":
            thumbnailURL = "https://cdn.discordapp.com/emojis/590393334036693004";
            aciklama = "Baget Yüzük"
            break;
          case "tektas":
            thumbnailURL = "https://cdn.discordapp.com/emojis/590393334003138570";
            aciklama = "Tektaş Yüzük"
            break;
          case "tria":
            thumbnailURL = "https://cdn.discordapp.com/emojis/590393335819272203.gif";
            aciklama = "Tria Yüzük"
            break;
          case "bestas":
            thumbnailURL = "https://cdn.discordapp.com/emojis/590393335915479040.gif";
            aciklama = "Beştaş Yüzük"
            break;
          default:
            console.log("Geçersiz yüzük türü.");
        }
    
        const embed = new EmbedBuilder()
          .setAuthor({ name: `${message.author.username}, ${evlencem.evlendigi} ile mutlu bir evliliğiniz var!`, iconURL: message.author.avatarURL({ dynamic: true }) })
          .setDescription(`**<t:${Math.floor(evlencem.evlendigitarih / 1000)}>** tarihinden beri evlisiniz **(<t:${Math.floor(evlencem.evlendigitarih / 1000)}:R>)**\nNe kadar tatlısınızz! ;3`)
          .setTimestamp()
          .setFooter({text: aciklama, iconURL: thumbnailURL})
          .setThumbnail(thumbnailURL);
      
        message.reply({ embeds: [embed] });
        return;
      }

    if (!member) return message.reply({ content: `Bir üye etiketle ve tekrardan dene.` });
    if (member.id === message.author.id) return message.reply({ content: "Kendinle evlenemezsin." });
    if (member.user.username === evlencem.evlendigi) return message.reply({ content: "Zaten onla evlisin dangalak." });
    if(evlencem.evlilik === true) return message.reply({content: `Sen zaten **${evlencem.evlendigi}** ile evli olduğun için başka biriyle evlenemezsin.`})
    if(!evlencem2) evlencem2 = await Coin.findOneAndUpdate({guildID:message.guild.id,userID:member.id},{$set:{coin:1000,beklemeSuresi:Date.now(),gameSize:0,profilOlusturma:Date.now(),hakkimda:"Girilmedi",evlilik:false,evlendigi:undefined,dailyCoinDate:(Date.now() - 86400000)}},{upsert:true, new:true})
    if(evlencem2.evlilik === true) return message.reply({content: `**${member.user.username}** ile evlenemezsiniz. Başka biriyle evlenmiş...`})

    
      let secim = parseInt(args[1]);

      switch (secim) {
        case 1:
          if (!evlencem.pirlanta) {
            return message.reply({
              content: 'Yüzüğün bulunmamakta. Lütfen marketten yüzük satın alın.',
            });
          }
          break;
        case 2:
          if (!evlencem.baget) {
            return message.reply({
              content: 'Yüzüğün bulunmamakta. Lütfen marketten yüzük satın alın.',
            });
          }
          break;
        case 3:
          if (!evlencem.tektas) {
            return message.reply({
              content: 'Yüzüğün bulunmamakta. Lütfen marketten yüzük satın alın.',
            });
          }
          break;
        case 4:
          if (!evlencem.tria) {
            return message.reply({
              content: 'Yüzüğün bulunmamakta. Lütfen marketten yüzük satın alın.',
            });
          }
          break;
        case 5:
          if (!evlencem.bestas) {
            return message.reply({
              content: 'Yüzüğün bulunmamakta. Lütfen marketten yüzük satın alın.',
            });
          }
          break;
        default:
          return message.reply({
            content: 'Geçersiz yüzük seçimi. Lütfen 1 ile 5 arasında bir değer girin.',
          });
      }

        const updateField = (() => {
            switch (secim) {
              case 1:
                return 'pirlanta';
              case 2:
                return 'baget';
              case 3:
                return 'tektas';
              case 4:
                return 'tria';
              case 5:
                return 'bestas';
              default:
                console.log("Geçersiz yüzük tipi")
            }
          })();

        let yeniYuzuk;
        switch (secim) {
            case 1:
                yeniYuzuk = "pirlanta";
                break;
            case 2:
                yeniYuzuk = "baget";
                break;
            case 3:
                yeniYuzuk = "tektas";
                break;
            case 4:
                yeniYuzuk = "tria";
                break;
            case 5:
                yeniYuzuk = "bestas";
            default:
              console.log("Geçersiz yüzük tipi")
            }

        const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('onay').setLabel('EVET! EVET! EVET!').setStyle(ButtonStyle.Success),new ButtonBuilder().setCustomId('red').setLabel('HAYIR!').setStyle(ButtonStyle.Danger));
        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${message.author.username}, ${member.user.username} kullanıcısına ${secim == 1 ? 'Pırlanta' : secim == 2 ? 'Baget' : secim == 3 ? 'Tektaş' : secim == 4 ? 'Tria' : 'Beştaş' } Yüzükle evlenme teklifi etti!`,
                iconURL: message.author.avatarURL({ dynamic: true }),
            })
            .setDescription(
                `:tada: Vaov! Vaov! Vaov! ${member} görünüşe göre ${message.author} size ${secim == 1 ? '**Pırlanta**' : secim == 2 ? '**Baget**' : secim == 3 ? '**Tektaş**' : secim == 4 ? '**Tria**' : '**Beştaş**' 
            } Yüzükle evlenme teklifi etti! Kabul etmek veya reddetmek için aşağıdaki butonlara basmanız gerekmektedir. Ne zaman ayrılmak isterseniz **.boşan** yazarak ayrılabilirsiniz. Şimdiden mutluluklarrr!`
            )
            .setTimestamp()
            .setThumbnail(`${secim == 1 ? 'https://cdn.discordapp.com/emojis/590393334384558110' : secim == 2 ? 'https://cdn.discordapp.com/emojis/590393334036693004' : secim == 3 ? 'https://cdn.discordapp.com/emojis/590393334003138570' : secim == 4 ? 'https://cdn.discordapp.com/emojis/590393335819272203.gif' : 'https://cdn.discordapp.com/emojis/590393335915479040.gif' }`);

        let msg = await message.channel.send({ embeds: [embed], components: [row] })
        const filter = button => button.member.id === member.user.id;
        const collector = msg.createMessageComponentCollector({filter, time: 60000});

            collector.on('collect', async (button) => {

                if (button.customId === "onay") {
                await button.deferUpdate();
                msg.delete();
                await message.channel.send({content: `🎀 💞 💗 Tebrikler! ${member.user.username} ile ${message.author.username} evlendi! HADİİİ GERDEĞEE! 🛏️`})
                await Coin.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $set: { evlilik: true, evlendigi: member.user.username, evlendiğikisiID: member.id , evlendigitarih: Date.now(), evliolduguyuzuk: yeniYuzuk } }, { $inc: {  [updateField]: -1 } }, { upsert: true });
                await Coin.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $set: { evlilik: true, evlendigi: message.author.username, evlendiğikisiID: message.author.id , evlendigitarih: Date.now(),  evliolduguyuzuk: yeniYuzuk } }, { upsert: true });
                }

                if (button.customId === "red") {
                await button.deferUpdate();
                msg.delete();
                await message.channel.send({content: `Haydaaaa! ${member.user.username} kullanıcısı evlenme teklifini reddetti ELPWQLELPQWEQWPĞELQWLRPQWĞLDPĞQWLDPQWLDQKWODOPQWDKLPQWĞDLQWPĞDLPQĞWDLQW...`})
                }


            });

            collector.on('end', async (collected) => {
                if (collected.size < 1) {
                    return await msg.delete();
                }
            });

    },
};