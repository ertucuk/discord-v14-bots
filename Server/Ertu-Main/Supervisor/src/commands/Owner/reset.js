const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField,StringSelectMenuBuilder } = require("discord.js");
const cezapuans = require("../../../../../../Global/Schemas/cezapuan");
const ceza = require("../../../../../../Global/Schemas/ceza")
const name = require("../../../../../../Global/Schemas/names");
const penals = require("../../../../../../Global/Schemas/penals");
const messageUserChannel = require("../../../../../../Global/Schemas/messageUserChannel");
const voiceUserChannel = require("../../../../../../Global/Schemas/voiceUserChannel");
const streamerUserChannel = require("../../../../../../Global/Schemas/streamerUserChannel");
const cameraUserChannel = require("../../../../../../Global/Schemas/cameraUserChannel");
const messageUser = require("../../../../../../Global/Schemas/messageUser");
const voiceUser = require("../../../../../../Global/Schemas/voiceUser");
const voiceUserParent = require("../../../../../../Global/Schemas/voiceUserParent");
const streamerUser = require("../../../../../../Global/Schemas/streamerUser");
const cameraUser = require("../../../../../../Global/Schemas/cameraUser");
const inviteMemberSchema = require("../../../../../../Global/Schemas/inviteMember");
const inviterSchema = require("../../../../../../Global/Schemas/inviter");
const ertucuk = require("../../../../../../Global/Settings/System");
const { BsonDatabase,JsonDatabase,YamlDatabase } = require("five.db");
const db = new YamlDatabase();

module.exports = {
    name: "sıfırla",
    description: "Belirttiğiniz kullanıcın verilerini sıfırlarsınız.",
    category: "ADMIN",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["sf","sıfırlama","reset"],
      usage: ".sıfırla <@user/ID>",
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
db.delete(`kullanıcı_${member.id}`)
const sicil = new EmbedBuilder()
.setDescription(` ${member.toString()} üyesinin sicili ${message.author} tarafından temizlendi!`)
ertu.edit({embeds: [sicil], components: []})
}



if (interaction.values[0] === "stat") {
await interaction.deferUpdate();
await messageUserChannel.deleteMany({ userID: member.user.id, guildID: message.guild.id })
await voiceUserChannel.deleteMany({ userID: member.user.id, guildID: message.guild.id })
await streamerUserChannel.deleteMany({ userID: member.user.id, guildID: message.guild.id })
await cameraUserChannel.deleteMany({ userID: member.user.id, guildID: message.guild.id })
await streamerUser.deleteMany({ userID: member.user.id, guildID: message.guild.id })
await cameraUser.deleteMany({ userID: member.user.id, guildID: message.guild.id })
await inviteMemberSchema.deleteMany({ userID: member.user.id, guildID: message.guild.id })
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

  };