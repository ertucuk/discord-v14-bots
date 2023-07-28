const { ApplicationCommandOptionType,EmbedBuilder } = require("discord.js");
const ertum = require("../../../../../../Global/Settings/Setup.json")
const {green, star, nokta} = require("../../../../../../Global/Settings/Emojis.json");
const ertucuk = require("../../../../../../Global/Settings/System");

module.exports = {
    name: "seslisay",
    description: "Sesteki kullanıcıları sayar",
    category: "STAFF",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["sessay","ssay"],
      usage: ".seslisay", 
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

    let members = message.guild.members.cache.filter(m => m.voice.channelId);

    let tag = ertum.ServerTag;
    let pubRoom = ertum.PublicRoomsCategory;

    let topvoice = message.guild.members.cache.filter(s => s.voice.channel);
    let tagvoice = topvoice.filter(s => s.user.displayName.includes(tag));

    let stream = topvoice.filter(s => s.voice.streaming);
    let mic = topvoice.filter(s => s.voice.selfMute).size;
    let headphone = topvoice.filter(s => s.voice.selfDeaf).size;
    let yetkili = message.guild.members.cache.filter(x => {
      return x.user.username.includes(ertum.tag) && x.voice.channel && x.roles.cache.has(ertum.TaggedRole)
  }).size
  message.react(green)
  const ertu = new EmbedBuilder()
  .setFooter({text: ertucuk.SubTitle})
  .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
  .setDescription(`
  
  ${star} Aşağıda sunucumuzun anlık olarak detaylı ses verileri verilmiştir:

  ${nokta} Sesli kanallarda toplam **${topvoice.size}** kişi var.
  ${nokta} Ses kanallarında **${tagvoice.size}** taglı kullanıcı var.
  ${nokta} Ses kanallarında **${yetkili}** yetkili var.

  ${nokta} Yayında: **${stream.size}**
  ${nokta} Mikrofonu Kapalı: ${mic}
  ${nokta} Kulaklığı kapalı: ${headphone}
  `)

 message.channel.send({ embeds: [ertu]})


     },

    onSlash: async function (client, interaction) { },
  };