const { ApplicationCommandOptionType,EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,PermissionsBitField } = require("discord.js");
const ertucuk = require("../../../../../../Global/Settings/System");
const ertum = require("../../../../../../Global/Settings/Setup.json");

module.exports = {
    name: "kilit",
    description: "Kanalı kitlersiniz.",
    category: "ADMIN",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["kilitle","lock","unlock"],
      usage: ".kilit",
    },

    onLoad: function (client) { },

    onCommand: async function (client, message, args) {
      if(!ertum.OwnerRoles.some(ertucum => message.member.roles.cache.has(ertucum)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
      { 
      message.react(`${client.emoji("ertu_carpi")}`)
      message.reply({ content:`Yeterli yetkin yok!`}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
      return }

  const ac = new ButtonBuilder()
  .setCustomId("ac")
  .setStyle(ButtonStyle.Secondary)
  .setEmoji("🔓");

const kapa = new ButtonBuilder()
  .setCustomId("kapa")
  .setStyle(ButtonStyle.Secondary)
  .setEmoji("🔒");

const hasSendMessagesPermission = message.channel.permissionsFor(message.guild.id).has(PermissionsBitField.Flags.SendMessages);

if (hasSendMessagesPermission) {
  ac.setStyle(ButtonStyle.Success);
} else {
  ac.setStyle(ButtonStyle.Success).setDisabled(true);
}

if (!hasSendMessagesPermission) {
  kapa.setStyle(ButtonStyle.Danger).setDisabled(true);
} else {
  kapa.setStyle(ButtonStyle.Danger);
}

const row = new ActionRowBuilder()
  .addComponents([ac, kapa]);

const ertu = new EmbedBuilder()
  .setFooter({ text: ertucuk.SubTitle })
  .setDescription(`${message.author} Kanalı kitlemek veya kilidini açmak için butonları kullanınız.`);

const msg = await message.channel.send({ embeds: [ertu], components: [row] });

const filter = button => button.user.id === message.author.id;
const collector = await msg.createMessageComponentCollector({ filter, time: 30000 });

collector.on("collect", async (button) => {
  if (button.customId === "ac") {
    await button.deferUpdate();
    const everyone = message.guild.roles.cache.find(r => r.name === "@everyone");
    await message.channel.permissionOverwrites.edit(everyone.id, {
      SendMessages: null
    });
    message.react("🔓");
    await msg.edit({ content: `Kanalın kilidi başarıyla açıldı.`, embeds: [], components: [] });
  } else if (button.customId === "kapa") {
    await button.deferUpdate();
    const everyone = message.guild.roles.cache.find(r => r.name === "@everyone");
    await message.channel.permissionOverwrites.edit(everyone.id, {
      SendMessages: false
    });
    message.react("🔒");
    await msg.edit({ content: `Kanal başarıyla kilitlendi.`, embeds: [], components: [] });
  }
});



     },

  };