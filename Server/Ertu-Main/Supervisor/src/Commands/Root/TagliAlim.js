const { ApplicationCommandOptionType, EmbedBuilder , PermissionsBitField, Embed, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const registerData  = require("../../../../../../Global/Schemas/registerStats");
const { green, red } = require("../../../../../../Global/Settings/Emojis.json");
module.exports = {
    name: "taglıalım",
    description: "Taglı alım Açıp Kapatırsınız",
    category: "OWNER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["taglı-alım"],
      usage: ".taglıalım",
    },

    onLoad: function (client) { },

    onCommand: async function (client, message, args) {

    let data = await registerData.findOne({ guildID: message.guild.id })
    if(!data) new registerData({guildID: message.guild.id, tagMode: false}).save();

    let on = new ButtonBuilder()
    .setCustomId("on")
    .setLabel("Aktif")
    .setStyle(ButtonStyle.Secondary)
    .setEmoji(`${client.emoji("ertu_onay")}`);

    let off = new ButtonBuilder()
    .setCustomId("off")
    .setLabel("Deaktif")
    .setStyle(ButtonStyle.Danger)
    .setEmoji(`${client.emoji("ertu_carpi")}`);

    if (data && data.tagMode === true) {
      on.setStyle(ButtonStyle.Success).setDisabled(true);
    } else {
      on.setStyle(ButtonStyle.Success);
    }

    if (data && data.tagMode === false) {
      off.setStyle(ButtonStyle.Danger).setDisabled(true);
    } else {
      off.setStyle(ButtonStyle.Danger);
    }

    const row = new ActionRowBuilder()
    .addComponents([ on, off ]);

    const ertu = new EmbedBuilder()  
    .setDescription(`${message.author} Taglı Modunu Aktifleştirmek ve Deaktifleştirmek için butonları kullanınız.`)
    .setFooter({ text: `Kapalı olan buton şuanki taglı modunu gösterir tekrar kullanılamaz.`})

    let msg = await message.reply({ embeds: [ertu], components: [row] })
    var filter = button => button.user.id === message.author.id;
    let collector = await msg.createMessageComponentCollector({ filter, time: 30000 })

    collector.on("collect", async (button) => {

      if (button.customId === "on") {
        await button.deferUpdate();
        let data = await registerData.findOne({ guildID: message.guild.id })
        data.tagMode = true;
        data.save();
        msg.edit({ content: `${client.emoji("ertu_onay")} Taglı Alım modu başarıyla **Aktif** edildi!`, embeds: [], components: [] });
      }
      if (button.customId === "off") {
        await button.deferUpdate();
        let data = await registerData.findOne({ guildID: message.guild.id })
        data.tagMode = false;
        data.save();
        msg.edit({ content: `${client.emoji("ertu_onay")} Taglı Alım modu başarıyla **Deaktif** edildi!`, embeds: [], components: [] });
      }})

     },

  };