const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder,ButtonStyle } = require("discord.js");
const Coin = require("../../../../../../Global/Schemas/ekonomi");
const ertucuk = require("../../../../../../Global/Settings/System");

module.exports = {
    name: "boşan",
    description: "Boşanırsınız.",
    category: "EKONOMI",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["bosan"],
      usage: ".boşan", 
    },
  

    onLoad: function (client) { },

    onCommand: async function (client, message, args, ertuembed) {
      

    let bosancam = await Coin.findOne({ userID: message.author.id });

    if (!bosancam || !bosancam?.evlilik || !bosancam?.evlendiğikisiID) {
      return message.reply({
        content: 'Zaten evli değilsin.'
      })
    }

    const member = message.guild.members.cache.get(bosancam.evlendiğikisiID);

   message.reply({
    content: `${member ? member.user.username : `<@${bosancam.evlendiğikisiID}>`} adlı şahıstan boşanmak istediğine emin misin?`,
    components: [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('approveBosan')
          .setStyle(ButtonStyle.Success)
          .setLabel('Evet BOŞA!'),
        new ButtonBuilder()
          .setCustomId('declineBosan')
          .setStyle(ButtonStyle.Danger)
          .setLabel('H-Hayır')
      )
    ]
   }).then(async (msg) => {
      const collector = msg.createMessageComponentCollector({
        time: 15000
      })

      collector.on('collect', async (i) => {
        if (i.user.id != message.author.id) {
          return await i.reply({
            content: 'Bu butonları sadece ilgili kişiler kullanabilir.',
            ephemeral: true
          })
        }

        if (i.customId == 'approveBosan') {
            await Coin.findOneAndUpdate({ userID: message.author.id }, { $set: { evlilik: false, evlendigi: ""  } }, { upsert: true })

            await Coin.findOneAndUpdate({ userID: bosancam.evlendiğikisiID }, { $set: { evlilik: false, evlendigi: "" } }, { upsert: true })

            await i.update({
              content: 'Boşanma gerçekleşti, geri kalan hayatınızda başarılar..',
              components: []
            })
        }

        if (i.customId == 'declineBosan') {
          await i.update({
            content: 'Boşanma işleminin ucundan son anda dönüldü',
            components: []
          })
        }
      })

      collector.on('end', async (collected) => {
        if (collected.size < 1) {
          return await msg.delete()
        }
      })
   })

  }
}

   






    