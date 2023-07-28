const { ApplicationCommandOptionType, ActionRowBuilder, PermissionsBitField, StringSelectMenuBuilder, EmbedBuilder } = require("discord.js");
const ertum = require("../../../../../../Global/Settings/Setup.json");

module.exports = {
    name: "toplantı",
    description: "Toplantı başlatırsınız.",
    category: "ADMIN",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["toplanti","toplantı-başlat","toplantbaşlat"],
      usage: ".toplantı", 
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

    onCommand: async function (client, message, args, ertuembed) {

    if (!ertum.OwnerRoles.some(ertucum => message.member.roles.cache.has(ertucum)) && !message.member.permissions.has()) {
    message.reply({ content: `Yetkin bulunmamakta dostum.` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
    return
    }

    const row = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('toplanti')
          .setPlaceholder(`Toplantı Başlat!`)
          .addOptions([
            { label: 'Toplantı Başlat', description: `Toplantıyı Bulunduğunuz Ses Kanalında Başlatır Ve Rol Dağıtır!`, value: 'toplantibaslat', emoji: '🟢' },
            { label: 'Toplantı Duyuru', description: `Yetkilileri DM Üzerinden Ses Kanalına Davet Eder!`, value: 'toplantiduyuru', emoji: '📣' },
          ]),
      );

      let msg = await message.reply({ components: [row], content: `Aşağıdaki menüden toplantı başlatıp veya yetkililere DM üzerinden mesaj gönderebilirsiniz.`})
      const collector = msg.createMessageComponentCollector({ filter: i => i.user.id === message.member.id, time: 30000, max: 1 });

      collector.on('collect', async (interaction) => {
    if (!interaction.isStringSelectMenu()) return;
    let value = interaction.values[0];
    switch (value) {
        case "toplantibaslat":
            let voiceuser = message.guild.members.cache.filter(member => member.roles.highest.position >= ertum.ConfirmerRoles.position && member.voice.channel && !member.user.bot)
            let nvoiceuser = message.guild.members.cache.filter(member => member.roles.highest.position >= ertum.ConfirmerRoles.position && !member.voice.channel && !member.user.bot)
            let mazeret = message.guild.roles.cache.get(ertum.MazeretRole).members.size;
            interaction.reply({ content: `${interaction.member}`, embeds: [ertuembed.setDescription(`**Katıldı Rolü Verilecek Sayısı ${voiceuser.size}**\n> **Katıldı Rolü Alınacak Sayısı ${nvoiceuser.size}**\n> **Mazeretli Kişi Sayısı ${mazeret}**\n\n> **Toplantıda Olan ${voiceuser.size} Kişiye Katıldı Rolü Veriliyor..**`)] })
            interaction.message.delete();
            voiceuser.array().forEach((ertu, index) => {
                setTimeout(async () => {
                    ertu.roles.add(ertum.JoinedRole)
                }, index * 1000)
            })
    break;
    case "toplantiduyuru":
        let nnvoiceuser = interaction.guild.members.cache.filter(member => member.roles.highest.position >= ertum.ConfirmerRoles.position && !member.voice.channel && !member.user.bot)
     if(nnvoiceuser.length == 0)return interaction.reply({ embeds: [ertuembed.setDescription(`Sunucudaki Tüm Yetkililer Seste Bulunuyor!`)] })
     let mesaj = await interaction.reply({ embeds: [ertuembed.setDescription(`Seste Olmayan ${nnvoiceuser.size} Kişiye DM Üzerinden Duyuru Geçiliyor! Lütfen Biraz Bekleyiniz.`)] });
     interaction.message.delete();
     nnvoiceuser.forEach((ertu, index) => {
        setTimeout(() => {
         ertu.send(`Yetkili Olduğun \`${interaction.guild.name}\` Sunucusunda Toplantı Başlıyor! Toplantıda Bulunmadığın İçin Sana Bu Mesajı Gönderiyorum, Eğer Toplantıya Katılmazsan Uyarı Alıcaksın!`).then(five => mesaj.edit(`> **${ertu} Kişisine DM Üzerinden Duyuru Yapıldı!**`).catch((err) => { interaction.channel.send(`${yetkili} Yetkili Olduğun \`${interaction.guild.name}\` Sunucusunda Toplantı Başlıyor, Toplantıda Bulunmadığın İçin Sana Bu Mesajı Gönderiyorum, Eğer Toplantıya Katılmazsan Uyarı Alıcaksın!`).then(x => mesaj.edit({embeds:[ertuembed.setDescription(`${yetkili} Kişisinin DM'i Kapalı Olduğundan Kanalda Duyuru Yapıldı!`)]}))}));
        }, index*5000);
        })
break;
}

})
     },

    onSlash: async function (client, interaction) { },
  };