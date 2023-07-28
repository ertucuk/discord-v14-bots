const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js");
const moment = require("moment");
moment.locale("tr");
const client = global.bot;
const ertucuk = require("../../../../../../Global/Settings/System");
const kanal = require("../../../../../../Global/Settings/AyarName");

module.exports = {
    name: "çek",
    description: "Belirttiğinz üyeyi yanınıza çekersiniz.",
    category: "USER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["cek"], // kralmınakoyim
      usage: ".çek <@user/ID>",
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

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        if (!message.member.voice.channel) {
          return message.reply({ content: "Bir ses kanalında değilsin!" });
      }
        if (!member) {
          return message.reply({ content: "Bir üye etiketlemeyi unuttun!" });
      }
        if (!member.voice.channel) {
          return message.reply({ content: "Bu kullanıcı herhangi bir ses kanalında değil!" });
      }
        if (message.member.voice.channel === member.voice.channel) {
          return message.reply({ content: "Zaten aynı kanaldasınız!" });
      }
    
      const row = new ActionRowBuilder()
  .addComponents(

  new ButtonBuilder()
  .setCustomId("onay")
  .setLabel("Kabul Et")
  .setStyle(ButtonStyle.Success),

  new ButtonBuilder()
  .setCustomId("red")
  .setLabel("Reddet")
  .setStyle(ButtonStyle.Danger),
  );

  if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    member.voice.setChannel(message.member.voice.channel.id);
    message.reply({embeds: [new EmbedBuilder().setThumbnail(message.author.avatarURL({ dynamic: true, size: 2048 })).setDescription(`${message.author}, ${member} kişisini yanınıza taşıdınız.`)] });
  } else {

    let ertu = new EmbedBuilder()  
    .setDescription(`${member}, ${message.author} seni \`${message.member.voice.channel.name}\`  odasına çekmek istiyor. Kabul ediyor musun?`)
    .setFooter({ text: `Lütfen 30 saniye içerisinde işlem iptal edilecektir.`})
    .setAuthor({ name: member.displayName, iconURL: member.user.displayAvatarURL({ dynamic: true }) })

  let msg = await message.channel.send({ content: `${member}`, embeds: [ertu], components: [row] })

  var filter = button => button.user.id === member.user.id;

  let collector = await msg.createMessageComponentCollector({ filter, time: 30000 })

  collector.on("collect", async (button) => {

    if (button.customId === "onay") {
      await button.deferUpdate();

      const embeds = new EmbedBuilder()
        .setAuthor({ name: member.displayName, iconURL: member.user.avatarURL({ dynamic: true }) })
        .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true }) })
        .setTimestamp()
        .setDescription(`${message.author}, ${member} kişisini yanınıza taşıdınız.`)
      member.voice.setChannel(message.member.voice.channel.id);
      if (msg) msg.delete();
      msg.channel.send({ embeds: [embeds]})
    }

    if (button.customId === "red") {
      await button.deferUpdate();

      const embedss = new EmbedBuilder()
        .setAuthor({ name: member.displayName, iconURL: member.user.avatarURL({ dynamic: true })})
        .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true })})
        .setTimestamp()
        .setDescription(`${message.author}, ${member} yanına taşıma işlemi iptal edildi.`)
        if (msg) msg.delete();
      msg.channel.send({ embeds: [embedss]})
    }

  });
}

     },

    onSlash: async function (client, interaction) { },
  };