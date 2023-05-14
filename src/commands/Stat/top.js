const { ApplicationCommandOptionType,EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle , StringSelectMenuBuilder } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const messageUser = require("../../schemas/messageUser");
const voiceUser = require("../../schemas/voiceUser");
const messageGuild = require("../../schemas/messageGuild");
const dolar = require("../../schemas/dolar");
const voiceGuild = require("../../schemas/voiceGuild");
const regstats = require("../../schemas/registerStats");
const inviter = require("../../schemas/inviter");
module.exports = {
    name: "top",
    description: "",
    category: "NONE",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["topstat","sıralama"],
      usage: "",
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
        const messageUsersData = await messageUser
      .find({ guildID: message.guild.id })
      .sort({ topStat: -1 });

    const voiceUsersData = await voiceUser
      .find({ guildID: message.guild.id })
      .sort({ topStat: -1 });

    const messageGuildData = await messageGuild.findOne({
      guildID: message.guild.id,
    });

    const voiceGuildData = await voiceGuild.findOne({
      guildID: message.guild.id,
    });
    const messageUsers = messageUsersData
      .splice(0, 20)
      .map(
        (x, index) =>
          `\` ${index == 0 ? `1` : `${index + 1}`} \` <@${x.userID
          }>: \`${Number(x.topStat).toLocaleString()} mesaj\``
      )
      .join(`\n`);
    const voiceUsers = voiceUsersData
      .splice(0, 20)
      .map((x, index) => `\` ${index == 0 ? `1` : `${index + 1}`} \` <@${x.userID}>: \`${moment.duration(x.topStat).format("H [saat], m [dakika] s [saniye]")}\``)
      .join(`\n`);

    const mesaj = `Toplam üye mesajları: \`${Number(
      messageGuildData ? messageGuildData.topStat : 0
    ).toLocaleString()} mesaj\`\n\n${messageUsers.length > 0 ? messageUsers : "Veri Bulunmuyor."
      }`;
    const ses = `Toplam ses verileri: \`${moment
      .duration(voiceGuildData ? voiceGuildData.topStat : "Veri Bulunmuyor.")
      .format("H [saat], m [dakika]")}\`\n\n${voiceUsers.length > 0 ? voiceUsers : "Veri Bulunmuyor."
      }`;
      
    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('detay')
          .setPlaceholder('Sıralama kategorisi seçimi yapın!')
          .addOptions([
            { label: 'Mesaj Sıralaması', description: 'Sunucudaki mesaj sıralamasını görmek için tıklayınız.', value: 'mesaj', emoji: '1089491370982522950' },
            { label: 'Ses Sıralaması',   description: 'Sunucudaki ses sıralamasını görmek için tıklayınız.', value: 'ses', emoji: '1089491399067566141' },
            { label: 'Kayıt Sıralaması', description: 'Sunucudaki kayıt sıralamasını görmek için tıklayınız.', value: 'register', emoji: '1089511613352120320' },
            { label: 'Davet Sıralaması', description: 'Sunucudaki davet sıralamasını görmek için tıklayınız.', value: 'davet', emoji: '1089505823346143303'},
          ]),
      );

    let msg = await message.channel.send({
      content: " ",
      embeds: [
          new EmbedBuilder()
          .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))
          .setDescription(
            `Aşağıdaki menüden **${message.guild.name
            }** Sunucusunun <t:${Math.floor(
              Date.now() / 1000
            )}:R>  tarihli Tüm zamanlar ve haftalık istatistik verilerini listeleyebilirsiniz.`
          ),
      ],
      components: [
        row
      ]
    });
    const filter = i => i.user.id === message.member.id;
    const collector = await msg.createMessageComponentCollector({ filter: filter, time: 30000 });

    collector.on("collect", async (interaction) => {

      if (interaction.values[0] === "mesaj") {
        await interaction.deferUpdate();

        const puan = new EmbedBuilder()
        .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))
        .setDescription(`🎉 Aşağıda ${msg.guild.name} sunucusunun genel sohbet ( \` mesaj \` ) sıralaması listelenmektedir. \n\n${mesaj} \n\nGenel sohbet(\` mesaj \`) sıralaması <t:${Math.floor(Date.now() / 1000)}:R> tarihinde otomatik olarak güncellenmiştir.`, false)

        msg.edit({embeds: [puan], components: [row]});
      }

      if (interaction.values[0] === "ses") {
        await interaction.deferUpdate();

        const puan = new EmbedBuilder()
        .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))
        .setDescription(`🎉 Aşağıda ${msg.guild.name} sunucusunun genel sohbet ( \` ses \` ) sıralaması listelenmektedir. \n\n${ses} \n\nGenel sohbet(\` ses \`) sıralaması <t:${Math.floor(Date.now() / 1000)}:R> tarihinde otomatik olarak güncellenmiştir.`, false)

        msg.edit({embeds: [puan], components: [row]});
      }

      if (interaction.values[0] === "register") {
        await interaction.deferUpdate();

        let data = await regstats.find({ guildID: message.guild.id }).sort({ top: -1 });

        let kayit = data.filter((x) => message.guild.members.cache.has(x.userID))
          .splice(0, 20)
          .map((x, i) => `${x.userID === message.author.id ? `\` \` ${i == 0 ? `1` : `${i + 1}`} \` \` **<@${x.userID}> - Erkek __${x.erkek}__ Kadın __${x.kız}__ (Sen)**` : `\` \`${i == 0 ? `1` : `${i + 1}.`}\` \` <@${x.userID}> - Erkek __${x.erkek}__ Kadın __${x.kız}__`}`)
          .join("\n");


        const puan = new EmbedBuilder()
          .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))
          .setDescription(`🎉 Aşağıda ${msg.guild.name} sunucusunun genel sohbet ( \` Kayıt \` ) sıralaması listelenmektedir. \n\n${kayit} \n\nGenel sohbet(\` Kayıt \`) sıralaması <t:${Math.floor(Date.now() / 1000)}:R> tarihinde otomatik olarak güncellenmiştir.`, false)

        msg.edit({embeds: [puan], components: [row]});
      }

      if (interaction.values[0] === "register") {
        await interaction.deferUpdate();

        let data = await regstats.find({ guildID: message.guild.id }).sort({ top: -1 });

        let kayit = data.filter((x) => message.guild.members.cache.has(x.userID))
          .splice(0, 20)
          .map((x, i) => `${x.userID === message.author.id ? `\` \` ${i == 0 ? `1` : `${i + 1}`} \` \` **<@${x.userID}> - Erkek __${x.erkek}__ Kadın __${x.kız}__ (Sen)**` : `\` \`${i == 0 ? `1` : `${i + 1}.`}\` \` <@${x.userID}> - Erkek __${x.erkek}__ Kadın __${x.kız}__`}`)
          .join("\n");


        const puan = new EmbedBuilder()
          .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))
          .setDescription(`🎉 Aşağıda ${msg.guild.name} sunucusunun genel sohbet ( \` Kayıt \` ) sıralaması listelenmektedir. \n\n${kayit} \n\nGenel sohbet(\` Kayıt \`) sıralaması <t:${Math.floor(Date.now() / 1000)}:R> tarihinde otomatik olarak güncellenmiştir.`, false)

        msg.edit({embeds: [puan], components: [row],});
      }

      if (interaction.values[0] === "davet") {
        await interaction.deferUpdate();

        let data = await inviter.find({ guildID: message.guild.id }).sort({ top: -1 });
        let davet = data.filter((x) => message.guild.members.cache.has(x.userID))
          .splice(0, 20)
          .map((x, i) => `${x.userID === message.author.id ? `\` \` ${i == 0 ? `1` : `${i + 1}`} \` \` **<@${x.userID}> - ${x.total} Davet (Sen)**` : `\` \`${i == 0 ? `1` : `${i + 1}.`}\` \` <@${x.userID}> - **${x.total}** Davet`}`)
          .join("\n");

        const puan = new EmbedBuilder()
          .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))
          .setDescription(`🎉 Aşağıda ${msg.guild.name} sunucusunun genel sohbet ( \` Davet \` ) sıralaması listelenmektedir. \n\n${davet} \n\nGenel sohbet(\` Davet \`) sıralaması <t:${Math.floor(Date.now() / 1000)}:R> tarihinde otomatik olarak güncellenmiştir.`, false)

        msg.edit({embeds: [puan], components: [row],});
      }})
     },

    onSlash: async function (client, interaction) { },
  };