const { ApplicationCommandOptionType,PermissionsBitField,ActionRowBuilder,StringSelectMenuBuilder, EmbedBuilder } = require("discord.js");
const ertum = require("../../Settings/Setup.json");
const moment = require("moment");
moment.locale("tr");
let table = require("string-table");
const ertucuk = require("../../Settings/System");

module.exports = {
    name: "ysay",
    description: "",
    category: "NONE",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["yses","yetkilisay","yetkili-say","y-say"],
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

      if (!message.guild) return;
      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return
    
  
          var AktifOlanYetkili = message.guild.members.cache.filter(m => ertum.ConfirmerRoles.some(x => m.roles.cache.get(x)) && m.presence && m.presence.status !== 'offline')
          var SesteOlmayanYetkili = message.guild.members.cache.filter(m => ertum.ConfirmerRoles.some(x => m.roles.cache.get(x)) && !m.voice.channel && m.presence && m.presence.status !== 'offline')
          var ToplamYetkili = message.guild.members.cache.filter(m => ertum.ConfirmerRoles.some(x => m.roles.cache.get(x)))
          var SesteOlanYetkili = message.guild.members.cache.filter(m => ertum.ConfirmerRoles.some(x => m.roles.cache.get(x)) && !m.voice.channel && m.presence && m.presence.status !== 'offline')

          const row = new ActionRowBuilder()
          .addComponents(
            new StringSelectMenuBuilder()
              .setCustomId('yetkilisay')
              .setPlaceholder(`Yapılacak eylemi seçin.`)
              .addOptions([
                { label: 'Yetkili Ses Kontrol', description: `Seste Olmayan Yetkilileri sese çağırırsınız.`, value: 'yetkilikontrol'},
                { label: 'Yetkililer', description: `Toplam Yetkili Sayısı`, value: 'toplamyetkili' },
              ]),
          );

          const ertu = await message.reply({ content : `Yetkili Kontrol Menüsüne Hoşgeldiniz! Aşağıdaki Menüden Lütfen yapılacak eylemi seçin.`, components: [row] });
          const filter = i => i.user.id == message.author.id
          let collector = await ertu.createMessageComponentCollector({ filter, time: 30000 })

          collector.on("collect", async (interaction) => {
            if (interaction.values[0] === "yetkilikontrol") {

              let yetkiliSesKontrol = SesteOlmayanYetkili.map(x => `${x} - ${x.user.tag}`).join('\n')

              ertu.edit({content: `Ses kanallarında aktif olmayan yetkililerimiz:\n${yetkiliSesKontrol || "Veri bulunamadı."}`, components: [] })
                }
                if (interaction.values[0] === "toplamyetkili") {
                  ertu.edit({ embeds: [], content: `Yetkili sayısını hesaplıyorum...`, components: [] })


                  setTimeout(() => {

                      ertu.edit({ embeds: [], content: `\`\`\`md\n# Toplam yetkili sayısı: ${ToplamYetkili.size}\n# Çevrimiçi yetkili Sayısı: ${AktifOlanYetkili.size}\n# Çevrimdışı yetkili sayısı: ${ToplamYetkili.size - AktifOlanYetkili.size}\n# Seste bulunan Yetkili sayısı: ${SesteOlanYetkili.size}\n# Seste bulunmayan Yetkili sayısı: ${SesteOlmayanYetkili.size}\`\`\``, components: [] }).delete(15)

                  }, 3500)
}})},

    onSlash: async function (client, interaction) { },
  };