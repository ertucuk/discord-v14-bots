const { ApplicationCommandOptionType,EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle , StringSelectMenuBuilder,PermissionsBitField } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const messageUser = require("../../schemas/messageUser");
const voiceUser = require("../../schemas/voiceUser");
const messageGuild = require("../../schemas/messageGuild");
const dolar = require("../../schemas/dolar");
const voiceGuild = require("../../schemas/voiceGuild");
const regstats = require("../../schemas/registerStats");
const inviter = require("../../schemas/inviter");
const { loading, star } = require("../../../../../../Global/Settings/Emojis.json");
const ertucuk = require("../../../../../../Global/Settings/System");
const kanal = require("../../../../../../Global/Settings/AyarName");


module.exports = {
    name: "top",
    description: "Sunucunun veri sıralamasını gösterir.",
    category: "STAT",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["topstat","sıralama"],
      usage: ".top",
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

    let wait = await message.reply({content: `${loading} | **${message.guild.name}** Sunucusuna ait veri sıralaması Çekiliyor Lütfen Bekleyiniz..`})

    const messageUsersData = await messageUser
    .find({ guildID: message.guild.id })
    .sort({ topStat: -1 });

    const messageUsersData2 = await messageUser
    .find({ guildID: message.guild.id })
    .sort({ dailyStat: -1 });

    const messageUsersData3 = await messageUser
    .find({ guildID: message.guild.id })
    .sort({ weeklyStat: -1 });

    const voiceUsersData = await voiceUser
    .find({ guildID: message.guild.id })
    .sort({ topStat: -1 });

    const voiceUsersData2 = await voiceUser
    .find({ guildID: message.guild.id })
    .sort({ dailyStat: -1 });

    const voiceUsersData3 = await voiceUser
    .find({ guildID: message.guild.id })
    .sort({ weeklyStat: -1 });

    const messageGuildData = await messageGuild.findOne({
      guildID: message.guild.id,
    });

    const voiceGuildData = await voiceGuild.findOne({
      guildID: message.guild.id,
    });

    let messageUsers = messageUsersData
    .filter((x) => message.guild.members.cache.has(x.userID))
    .splice(0, 10)
    .map((x, index) => `${x.userID === message.author.id ? `${rakam(index+1)} <@${x.userID}>: \`${Number(x.topStat).toLocaleString()} mesaj\` **(Siz)**` : ` ${rakam(index+1)}  <@${x.userID}>: \`${Number(x.topStat).toLocaleString()} mesaj\``}`)
    .join("\n");

    let messageUsers2 = messageUsersData2
    .filter((x) => message.guild.members.cache.has(x.userID))
    .splice(0, 10)
    .map((x, index) => `${x.userID === message.author.id ? `${rakam(index+1)} <@${x.userID}>: \`${Number(x.topStat).toLocaleString()} mesaj\` **(Siz)**` : `${rakam(index+1)}  <@${x.userID}>: \`${Number(x.topStat).toLocaleString()} mesaj\``}`)
    .join("\n");

    let messageUsers3 = messageUsersData3
    .filter((x) => message.guild.members.cache.has(x.userID))
    .splice(0, 10)
    .map((x, index) => `${x.userID === message.author.id ? `${rakam(index+1)} <@${x.userID}>: \`${Number(x.topStat).toLocaleString()} mesaj\` **(Siz)**` : `${rakam(index+1)}  <@${x.userID}>: \`${Number(x.topStat).toLocaleString()} mesaj\``}`)
    .join("\n");
    
    let voiceUsers = voiceUsersData
    .filter((x) => message.guild.members.cache.has(x.userID))
    .splice(0, 10)
    .map((x, index) => `${x.userID === message.author.id ? `${rakam(index+1)} <@${x.userID}>: \`${moment.duration(x.topStat).format("H [saat], m [dakika]")}\` **(Siz)**` : ` ${rakam(index+1)}  <@${x.userID}>: \`${moment.duration(x.topStat).format("H [saat], m [dakika]")}\``}`)
    .join("\n");

    let voiceUsers2 = voiceUsersData2
    .filter((x) => message.guild.members.cache.has(x.userID))
    .splice(0, 10)
    .map((x, index) => `${x.userID === message.author.id ? `${rakam(index+1)} <@${x.userID}>: \`${moment.duration(x.topStat).format("H [saat], m [dakika]")}\` **(Siz)**` : ` ${rakam(index+1)}  <@${x.userID}>: \`${moment.duration(x.topStat).format("H [saat], m [dakika]")}\``}`)
    .join("\n");

    let voiceUsers3 = voiceUsersData3
    .filter((x) => message.guild.members.cache.has(x.userID))
    .splice(0, 10)
    .map((x, index) => `${x.userID === message.author.id ? `${rakam(index+1)} <@${x.userID}>: \`${moment.duration(x.topStat).format("H [saat], m [dakika]")}\` **(Siz)**` : ` ${rakam(index+1)}  <@${x.userID}>: \`${moment.duration(x.topStat).format("H [saat], m [dakika]")}\``}`)
    .join("\n");

    const mesaj = `Toplam üye mesajları: \`${(
      messageGuildData ? messageGuildData.topStat : 0
    ).toLocaleString()} mesaj\`\n\n${star} **Top 10 Mesaj Sıralaması**\n${messageUsers.length > 0 ? messageUsers : "Veri Bulunmuyor."
      }`;

    const mesaj2 = `Günlük üye mesajları: \`${(
    messageGuildData ? messageGuildData.dailyStat : 0
    ).toLocaleString()} mesaj\`\n\n${star} **Top 10 Mesaj Sıralaması**\n${messageUsers2.length > 0 ? messageUsers2 : "Veri Bulunmuyor."
    }`;     

    const mesaj3 = `Haftalık üye mesajları: \`${(
      messageGuildData ? messageGuildData.weeklyStat : 0
    ).toLocaleString()} mesaj\`\n\n${star} **Top 10 Mesaj Sıralaması**\n${messageUsers3.length > 0 ? messageUsers3 : "Veri Bulunmuyor."
    }`; 
    //////////////////////////////////////////////////////////////////////////////////////////////////
    const ses = `Toplam ses verileri: \`${moment
    .duration(voiceGuildData ? voiceGuildData.topStat : "Veri Bulunmuyor.")
    .format("H [saat], m [dakika]")}\`\n\n${star} **Top 10 Ses Sıralaması**\n${voiceUsers.length > 0 ? voiceUsers : "Veri Bulunmuyor."
    }`;

    const ses2 = `Günlük ses verileri: \`${moment
    .duration(voiceGuildData ? voiceGuildData.dailyStat : "Veri Bulunmuyor.")
    .format("H [saat], m [dakika]")}\`\n\n${star} **Top 10 Ses Sıralaması**\n${voiceUsers2.length > 0 ? voiceUsers2 : "Veri Bulunmuyor."
    }`;

    const ses3 = `Haftalık ses verileri: \`${moment
    .duration(voiceGuildData ? voiceGuildData.weeklyStat : "Veri Bulunmuyor.")
    .format("H [saat], m [dakika]")}\`\n\n${star} **Top 10 Ses Sıralaması**\n${voiceUsers3.length > 0 ? voiceUsers3 : "Veri Bulunmuyor."
    }`;

    const messageUsersData1 = await messageUser.find({ guildID: message.guild.id }).sort({ topStat: -1 });
    const voiceUsersData1 = await voiceUser.find({ guildID: message.guild.id }).sort({ topStat: -1 });
    const mesajeniyi = messageUsersData1.splice(0, 1).map((x, index) => `<@${x.userID}>`);
    const seseniyi = voiceUsersData1.splice(0, 1).map((x, index) => `<@${x.userID}>`);
    const register = await regstats.find({ guildID: message.guild.id }).sort({ top: -1 });
    const eniyikayit = register.splice(0, 1).map((x, index) => `<@${x.userID}>`);
    const davet = await inviter.find({ guildID: message.guild.id }).sort({ top: -1 });
    const eniyidavet = davet.splice(0, 1).map((x, index) => `<@${x.userID}>`);

    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('ertucum')
          .setPlaceholder('Sıralama kategorisi seçimi yapın!')
          .addOptions([
            { label: 'Mesaj Sıralaması', description: 'Sunucudaki genel mesaj sıralamasını görmek için tıklayınız.', value: 'mesaj', emoji: '1089491370982522950' },
            { label: 'Ses Sıralaması',   description: 'Sunucudaki genel ses sıralamasını görmek için tıklayınız.', value: 'ses', emoji: '1089491399067566141' },
            { label: 'Kayıt Sıralaması', description: 'Sunucudaki kayıt sıralamasını görmek için tıklayınız.', value: 'register', emoji: '1089511613352120320' },
            { label: 'Davet Sıralaması', description: 'Sunucudaki davet sıralamasını görmek için tıklayınız.', value: 'davet', emoji: '1089505823346143303'},
          ]),
      );

      let gunluk;
      let haftalık;
      let genel;
      let butonlar = new ActionRowBuilder()
      .setComponents(
      gunluk  = new ButtonBuilder().setCustomId("gunluk").setEmoji("1129690133105475664").setLabel("Günlük").setStyle(ButtonStyle.Secondary).setDisabled(false),
      haftalık = new ButtonBuilder().setCustomId("haftalık").setEmoji("1129690133105475664").setLabel("Haftalık").setStyle(ButtonStyle.Secondary).setDisabled(false),
      genel = new ButtonBuilder().setCustomId("genel").setEmoji("1129690133105475664").setLabel("Genel").setStyle(ButtonStyle.Secondary).setDisabled(false),
      )

    let msg = await wait.edit({
      content: " ",
      embeds: [
          new EmbedBuilder()
          .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))
          .setDescription(`
            Aşağıda **${message.guild.name}** sunucusunun en iyileri sıralanmaktadır.

            \` 👑 En İyi Ses: \` ${seseniyi.length > 0 ? seseniyi : "Veri Bulunmuyor."}
            \` 👑 En İyi Mesaj: \` ${mesajeniyi.length > 0 ? mesajeniyi : "Veri Bulunmuyor."}
            \` 👑 En İyi Davet: \` ${eniyidavet.length > 0 ? eniyidavet : "Veri Bulunmuyor."}
            \` 👑 En İyi Kayıt: \` ${eniyikayit.length > 0 ? eniyikayit : "Veri Bulunmuyor."}
            `),
      ],
      components: [
      row
      ]
    });
    var filter = (button) => button.user.id === message.author.id;
    const collector = msg.createMessageComponentCollector({ filter, time: 90000 });

    collector.on("collect", async (interaction) => {
      await interaction.deferUpdate();
      const menu = interaction.values ? interaction.values[0] : "Yok";
      const button = interaction.customId;

      if(menu == "mesaj"){
        kategoriData = "Mesaj";

        const puan = new EmbedBuilder()
        .setThumbnail(message.guild.banner ? message.guild.bannerURL({ dynamic: true, size: 2048 }) : ertucuk.BackGround)
        .setDescription(` Aşağıda ${msg.guild.name} sunucusunun genel **__Mesaj__** sıralaması listelenmektedir. \n\n${mesaj}`, false)

        msg.edit({embeds: [puan],components:[new ActionRowBuilder({components:[gunluk.setDisabled(false),haftalık.setDisabled(false),genel.setDisabled(false)]}),row]});
      }

      if(menu == "ses"){
        kategoriData = "Ses";


        const puan = new EmbedBuilder()
        .setThumbnail(message.guild.banner ? message.guild.bannerURL({ dynamic: true, size: 2048 }) : ertucuk.BackGround)
        .setDescription(`Aşağıda ${msg.guild.name} sunucusunun genel **__Ses__** sıralaması listelenmektedir. \n\n${ses}`, false)

        msg.edit({embeds: [puan],components:[new ActionRowBuilder({components:[gunluk.setDisabled(false),haftalık.setDisabled(false),genel.setDisabled(false)]}),row]});
      }

      if(menu == "register"){

        let data = await regstats.find({ guildID: message.guild.id }).sort({ top: -1 });

        let kayit = data.filter((x) => message.guild.members.cache.has(x.userID))
          .splice(0, 10)
          .map((x, i) => `${x.userID === message.author.id ? `${rakam(i == 0 ? `1` : `${i + 1}`)} <@${x.userID}>: \` ${x.top} Kayıt \` **(Siz)**` : ` ${rakam(i == 0 ? `1` : `${i + 1}`)} <@${x.userID}>: \` ${x.top} Kayıt \``}`)
          .join("\n");


        const puan = new EmbedBuilder()
        .setThumbnail(message.guild.banner ? message.guild.bannerURL({ dynamic: true, size: 2048 }) : ertucuk.BackGround)
          .setDescription(`🎉 Aşağıda ${msg.guild.name} sunucusunun genel sohbet **__Kayıt__** sıralaması listelenmektedir. \n\n${star} **Top 10 Kayıt Sıralaması**\n${kayit} `, false)

          msg.edit({embeds: [puan],components:[new ActionRowBuilder({components:[gunluk.setDisabled(true),haftalık.setDisabled(true),genel.setDisabled(true)]}),row]});
        }

        if(menu == "davet"){
    
  
        let data = await inviter.find({ guildID: message.guild.id }).sort({ total: -1 });
        if (!data.length) return msg.edit({ embeds: [new EmbedBuilder().setDescription("Herhangi bir davet verisi bulunamadı!")] });
        let arr = [];
        data.forEach((x) => arr.push({ id: x.userID, total: x.total }));
        let index = arr.findIndex((x) => x.id == message.author.id) + 1;
      
        let list = data
          .filter((x) => message.guild.members.cache.has(x.userID))
          .splice(0, 20)
          .map((x, index) => `${x.userID === message.author.id ? `${rakam(index + 1)} <@${x.userID}> - **${x.total} davet** \`(${x.regular} Gerçek, ${x.bonus} Bonus, ${x.fake} Fake, ${x.leave} Ayrılmış)\` **(Sen)**` : ` ${rakam(index + 1)} <@${x.userID}> - **${x.total}** davet \`(${x.regular} Gerçek, ${x.bonus} Bonus, ${x.fake} Fake, ${x.leave} Ayrılmış)\``}`)
          .join("\n");
      
      const veri = await inviter.findOne({ guildID: message.guild.id, userID: message.author.id });
      if (index < 20) {
      const embeds = new EmbedBuilder()
      .setDescription(`
      Aşağıda **${message.guild.name}** sunucusunun genel davet sıralaması listelenmektedir.

      ${star} **Top 10 Davet Sıralaması**                
      ${list}`)
      .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
      .setThumbnail(message.guild.banner ? message.guild.bannerURL({ dynamic: true, size: 2048 }) : ertucuk.BackGround)
      msg.edit({embeds: [embeds],components:[new ActionRowBuilder({components:[gunluk.setDisabled(true),haftalık.setDisabled(true),genel.setDisabled(true)]}),row]});
      } else {
      const embeds2 = new EmbedBuilder()
      .setDescription(`
      Aşağıda **${message.guild.name}** sunucusunun genel davet sıralaması listelenmektedir.
                    
      ${star} **Top 10 Davet Sıralaması**                
      ${list} \n... \n\` ${index} \` ${message.author} **${veri.total} davet** \`(${veri.regular} Gerçek, ${veri.bonus} Bonus, ${veri.fake} Fake, ${veri.leave} Ayrılmış)\` **(Sen)**
`)
      .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
      .setThumbnail(message.guild.banner ? message.guild.bannerURL({ dynamic: true, size: 2048 }) : ertucuk.BackGround)
      msg.edit({embeds: [embeds2],components:[new ActionRowBuilder({components:[gunluk.setDisabled(true),haftalık.setDisabled(true),genel.setDisabled(true)]}),row]});
    }}

      if(button == "gunluk"){
        if(kategoriData == "Mesaj"){

          const puan = new EmbedBuilder()
          .setThumbnail(message.guild.banner ? message.guild.bannerURL({ dynamic: true, size: 2048 }) : ertucuk.BackGround)
          .setDescription(` Aşağıda ${msg.guild.name} sunucusunun Günlük **__Mesaj__** sıralaması listelenmektedir. \n\n${mesaj2}`, false)
  
          msg.edit({embeds: [puan],components:[new ActionRowBuilder({components:[gunluk.setDisabled(false),haftalık.setDisabled(false),genel.setDisabled(false)]}),row]});
        }
      if(kategoriData == "Ses"){

        const puan = new EmbedBuilder()
        .setThumbnail(message.guild.banner ? message.guild.bannerURL({ dynamic: true, size: 2048 }) : ertucuk.BackGround)
        .setDescription(` Aşağıda ${msg.guild.name} sunucusunun Günlük **__Ses__** sıralaması listelenmektedir. \n\n${ses2}`, false)

        msg.edit({embeds: [puan],components:[new ActionRowBuilder({components:[gunluk.setDisabled(false),haftalık.setDisabled(false),genel.setDisabled(false)]}),row]});
    }
  }
  if(button == "haftalık"){
    if(kategoriData == "Mesaj"){

      const puan = new EmbedBuilder()
      .setThumbnail(message.guild.banner ? message.guild.bannerURL({ dynamic: true, size: 2048 }) : ertucuk.BackGround)
      .setDescription(` Aşağıda ${msg.guild.name} sunucusunun Haftalık **__Mesaj__** sıralaması listelenmektedir. \n\n${mesaj3}`, false)

      msg.edit({embeds: [puan],components:[new ActionRowBuilder({components:[gunluk.setDisabled(false),haftalık.setDisabled(false),genel.setDisabled(false)]}),row]});
    }
  if(kategoriData == "Ses"){

    const puan = new EmbedBuilder()
    .setThumbnail(message.guild.banner ? message.guild.bannerURL({ dynamic: true, size: 2048 }) : ertucuk.BackGround)
    .setDescription(` Aşağıda ${msg.guild.name} sunucusunun Haftalık **__Ses__** sıralaması listelenmektedir. \n\n${ses3}`, false)

    msg.edit({embeds: [puan],components:[new ActionRowBuilder({components:[gunluk.setDisabled(false),haftalık.setDisabled(false),genel.setDisabled(false)]}),row]});
   } 
 }
 if(button == "genel"){
  if(kategoriData == "Mesaj"){

    const puan = new EmbedBuilder()
    .setThumbnail(message.guild.banner ? message.guild.bannerURL({ dynamic: true, size: 2048 }) : ertucuk.BackGround)
    .setDescription(` Aşağıda ${msg.guild.name} sunucusunun Genel **__Mesaj__** sıralaması listelenmektedir. \n\n${mesaj}`, false)

    msg.edit({embeds: [puan],components:[new ActionRowBuilder({components:[gunluk.setDisabled(false),haftalık.setDisabled(false),genel.setDisabled(false)]}),row]});
  }
if(kategoriData == "Ses"){

  const puan = new EmbedBuilder()
  .setThumbnail(message.guild.banner ? message.guild.bannerURL({ dynamic: true, size: 2048 }) : ertucuk.BackGround)
  .setDescription(` Aşağıda ${msg.guild.name} sunucusunun Genel **__Ses__** sıralaması listelenmektedir. \n\n${ses}`, false)

  msg.edit({embeds: [puan],components:[new ActionRowBuilder({components:[gunluk.setDisabled(false),haftalık.setDisabled(false),genel.setDisabled(false)]}),row]});
 } 
}

})
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