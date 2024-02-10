const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder,ButtonStyle,StringSelectMenuBuilder,Events } = require("discord.js");
const kanal = require("../../../../../../Global/Settings/AyarName");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const ertucuk = require("../../../../../../Global/Settings/System");

module.exports = {
    name: "kısayollar",
    description: "Kısayollar menüsünü atar.",
    category: "OWNER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["kısayol","kisayol"],
      usage: ".kısayollar", 
    },
  

    onLoad: function (client) {
        client.on(Events.InteractionCreate, async (interaction) => {
            if (interaction.isStringSelectMenu()) {
                let value = interaction.values[0];
                function gonderOlum(category) {
                    const embed = new EmbedBuilder()
                      .setColor("Random")
                      .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true, size: 2048 }) })
                      .setDescription(`${client.commands.filter(x => x.category !== "-" && x.category == category).map(x => `\`${x.command.usage}\``).join('\n')}`);
                    
                    interaction.reply({ embeds: [embed], ephemeral: true });
                  }
                  
                  if (interaction.customId == "kisayollar") {
                    switch (value) {
                      case "kullanıcı":
                        gonderOlum("USER");
                        break;
                      case "ek":
                        gonderOlum("EKONOMI");
                        break;
                      case "stats":
                        gonderOlum("STAT");
                        break;
                      case "reg":
                        gonderOlum("REGISTER");
                        break;
                      case "staff":
                        gonderOlum("STAFF");
                        break;
                      case "owner":
                        gonderOlum("ADMIN");
                        break;
                      case "botsahip":
                        gonderOlum("OWNER");
                        break;
                    }
                  }
            }
        })
    },

    onCommand: async function (client, message, args, ertuembed) {

        const row = new ActionRowBuilder()
        .addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('kisayollar')
            .setPlaceholder(`${client.commands.size} adet komut bulunmakta!`)
            .addOptions([
              { label: 'Üye Komutları', description: 'Genel tüm komutları içerir.', value: 'kullanıcı' },
              { label: 'Ekonomi Komutları', description: 'Genel tüm ekonomi Komutlarını içerir.', value: 'ek' },
              { label: 'İstatistik Komutları', description: 'Genel tüm stat komutlarını içerir.', value: 'stats' },
              { label: 'Teyit Komutları', description: 'Genel tüm kayıt komutlarını içerir.', value: 'reg' },
              { label: 'Yetkili Komutları', description: 'Genel tüm yetkili Komutlarını içerir.', value: 'staff' },
              { label: 'Yönetim Komutları', description: 'Genel tüm yönetim komutlarını içerir.', value: 'owner'},
              { label: 'Kurucu Komutları', description: 'Genel tüm kurucu komutlarını içerir.', value: 'botsahip' },
            ]),
        );
        message.channel.send({ content: `Merhaba! Yardım almak ister misin?\nAşağıda bulunan menüden yardım almak istediğiniz kategoriyi seçin. :tada:`, components: [row]})
     },
  };