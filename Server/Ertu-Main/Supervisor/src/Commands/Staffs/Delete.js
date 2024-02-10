const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,PermissionsBitField} = require("discord.js");
const ertum = require("../../../../../../Global/Settings/Setup.json");

module.exports = {
    name: "sil",
    description: "Belirttiğiniz kadar mesajı siler",
    category: "ADMIN",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: [],
      usage: ".sil",
    },

    onLoad: function (client) { },

    onCommand: async function (client, message, args) {

      if (!ertum.OwnerRoles.some(ertucum => message.member.roles.cache.has(ertucum)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;
      if (args[0] && args[0] < 99 && args[0] > 0 && !isNaN(args[0])) {

        await message.delete();
        await message.channel.bulkDelete(args[0]);
        message.channel.send({ content: `<#${message.channel.id}> kanalından ${args[0]} adet mesaj silindi.` }).then((e) => setTimeout(() => { e.delete(); }, 5000));    
    } else {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("ten").setLabel("10").setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId("twentyfive").setLabel("25").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("fifty").setLabel("50").setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId("onehundred").setLabel("100").setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId("cancel").setLabel("X").setStyle(ButtonStyle.Danger)
          );

          let ertu = new EmbedBuilder()
          .setDescription(`
           __**Kaç adet mesaj sileceğinizi butonlar ile seçiniz.**__
          `)
          .setAuthor({ name: message.member.displayName, iconURL: message.member.displayAvatarURL({ dynamic: true }) })
  
        let msg = await message.channel.send({ embeds: [ertu], components: [row] })
        var filter = (button) => button.user.id === message.author.id;
        let collector = await msg.createMessageComponentCollector({ filter, time: 60000 })

        
      collector.on("collect", async (button) => {

        if (button.customId === "ten") {
          await button.deferUpdate();
          await message.delete();
          await message.channel.bulkDelete(10);
          message.channel.send({ embeds: [new EmbedBuilder().setDescription(`Başarıyla 10 adet mesaj silindi.`)]}).then((e) => setTimeout(() => { e.delete(); }, 5000));
        }
        if (button.customId === "twentyfive") {
          await button.deferUpdate();
          await message.delete();
          await message.channel.bulkDelete(25);
          message.channel.send({ embeds: [new EmbedBuilder().setDescription(`Başarıyla 25 adet mesaj silindi.`)]}).then((e) => setTimeout(() => { e.delete(); }, 5000));
        }
        if (button.customId === "fifty") {
          await button.deferUpdate();
          await message.delete();
          await message.channel.bulkDelete(50);
          message.channel.send({ embeds: [new EmbedBuilder().setDescription(`Başarıyla 50 adet mesaj silindi.`)]}).then((e) => setTimeout(() => { e.delete(); }, 5000));

        }
        if (button.customId === "onehundred") {
          await button.deferUpdate();
          await message.delete();
          await message.channel.bulkDelete(99);
          message.channel.send({ embeds: [new EmbedBuilder().setDescription(`Başarıyla 100 adet mesaj silindi.`)]}).then((e) => setTimeout(() => { e.delete(); }, 5000));
        }
        if (button.customId === "cancel") {
          await button.deferUpdate();
          await message.delete();
          msg.edit({ content: ` Mesaj silme işleminden vazgeçtiniz.`, embeds: [], components: [] }).then((e) => setTimeout(() => { e.delete(); }, 5000));
        }
      })
    }},

  };