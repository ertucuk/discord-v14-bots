const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField,StringSelectMenuBuilder } = require("discord.js");
const cezapuans = require("../../schemas/cezapuan");
const ceza = require("../../schemas/ceza")
const name = require("../../schemas/names");
const penals = require("../../schemas/penals");
const messageUserChannel = require("../../schemas/messageUserChannel");
const voiceUserChannel = require("../../schemas/voiceUserChannel");
const messageUser = require("../../schemas/messageUser");
const voiceUser = require("../../schemas/voiceUser");
const regstats = require("../../schemas/registerStats");
const voiceUserParent = require("../../schemas/voiceUserParent");
const inviterSchema = require("../../schemas/inviter");
const ertucuk = require("../../Settings/System");

module.exports = {
    name: "sıfırla",
    description: "",
    category: "NONE",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["sf","sıfırlama","reset"],
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
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            message.reply({ content: "Bu işlemi yapamazsın dostum!" }).then((e) => setTimeout(() => { e.delete(); }, 5000));
            return;
          }
          
          const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
          const row = new ActionRowBuilder()
          .addComponents(
            new StringSelectMenuBuilder()
              .setCustomId('sifirlama')
              .setPlaceholder(`${member.user.tag.toString()}'n verilerini sıfırlamak için menüyü kullan! `)
              .addOptions([
                { label: 'İsim Sıfırla', description: `${member.user.tag}'n İsim Verisini Sıfırla`, value: 'isim' },
                { label: 'Sicil Sıfırlama', description: `${member.user.tag}'n Sicil Verisini Sıfırla`, value: 'sicil' },
                { label: 'Stat Sıfırlama', description:  `${member.user.tag}'n İstatistik Verisini Sıfırla`, value: 'stat' },
              ]),
          );

      const ertum = new EmbedBuilder()
 .setTitle(`Veri Sıfırlama Paneli`)
 .setFooter({text: ertucuk.SubTitle})
 .setDescription(`
Aşşağıdaki Menüden ${member.toString()}'n verilerini sıfırlayabilirsin.

\` • \` İsim Sıfırlama
\` • \` Sicil Sıfırlama
\` • \` Stat Sıfırlama
`)

let ertu = await message.channel.send({ embeds: [ertum], components: [row] });
const filter = i => i.user.id == message.author.id
let collector = await ertu.createMessageComponentCollector({ filter, time: 30000 })

collector.on("collect", async (interaction) => {

if (interaction.values[0] === "isim") {
await interaction.deferUpdate();
await name.deleteMany({ userID: member.user.id, guildID: message.guild.id })
const isim = new EmbedBuilder()
.setDescription(` ${member.toString()} üyesinin isim geçmişi ${message.author} tarafından temizlendi!`)
ertu.edit({embeds: [isim], components: []})
}

if (interaction.values[0] === "sicil") {
await interaction.deferUpdate();
await penals.deleteMany({ userID: member.user.id, guildID: message.guild.id })
const sicil = new EmbedBuilder()
.setDescription(` ${member.toString()} üyesinin sicili ${message.author} tarafından temizlendi!`)
ertu.edit({embeds: [sicil], components: []})
}

if (interaction.values[0] === "stat") {
await interaction.deferUpdate();
await messageUserChannel.deleteMany({ userID: member.user.id, guildID: message.guild.id })
await voiceUserChannel.deleteMany({ userID: member.user.id, guildID: message.guild.id })
await voiceUser.deleteMany({ userID: member.user.id, guildID: message.guild.id })
await regstats.deleteMany({ userID: member.user.id, guildID: message.guild.id })
await messageUser.deleteMany({ userID: member.user.id, guildID: message.guild.id })
await voiceUserParent.deleteMany({ userID: member.user.id, guildID: message.guild.id })
await inviterSchema.deleteMany({ userID: member.user.id, guildID: message.guild.id })
const stat = new EmbedBuilder()
.setDescription(` ${member.toString()} üyesinin istatistik verileri ${message.author} tarafından temizlendi!`)
ertu.edit({embeds: [stat], components: []})
}
})},

    onSlash: async function (client, interaction) { },
  };