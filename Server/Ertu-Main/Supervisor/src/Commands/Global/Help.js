const { ApplicationCommandOptionType, EmbedBuilder, EmbedAssertions, Events, ActionRowBuilder, StringSelectMenuBuilder,Formatters,PermissionsBitField } = require("discord.js");
const ertucuk = require("../../../../../../Global/Settings/System");
const { green } = require("../../../../../../Global/Settings/Emojis.json");
const moment = require("moment");
const kanal = require("../../../../../../Global/Settings/AyarName");

module.exports = {
    name: "yardım",
    description: "Yardım Komudu",
    category: "USER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["help","yardim"],
      usage: ".yardım", 
    },
   

    onLoad: function (client) { },

    onCommand: async function (client, message, args, ertuembed) {

      let kanallar = kanal.KomutKullanımKanalİsim;
     if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

      let command = args[0]
      if (client.commands.has(command)) {
      command = client.commands.get(command)
      message.reply({ embeds: [ertuembed.setThumbnail(message.author.avatarURL({dynamic: true, size: 2048})).setDescription(Formatters.codeBlock("md",
`# ${command.name} komutunun detayları;
> İsmi              : ${command.name}
> Kullanım          : ${command.command.usage}
> Diğer Anahtarları : ${command.command.aliases.filter(x=> x !== command.name).join(", ")}
> Bekleme Süresi    : ${moment.duration(command.cooldown).format("s [Saniye]")}
< Açıklaması        : ${command.description}
`
))]})
        return;
      }

    const row = new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('yardım')
        .setPlaceholder(`${client.commands.size} adet komut bulunmakta!`)
        .addOptions([
          { label: 'Üye Komutları', description: 'Genel tüm komutları içerir.', value: 'USER' },
          { label: 'Ekonomi Komutları', description: 'Genel tüm ekonomi Komutlarını içerir.', value: 'EKONOMI' },
          { label: 'İstatistik Komutları', description: 'Genel tüm stat komutlarını içerir.', value: 'STAT' },
          { label: 'Teyit Komutları', description: 'Genel tüm kayıt komutlarını içerir.', value: 'REGISTER' },
          { label: 'Yetkili Komutları', description: 'Genel tüm yetkili Komutlarını içerir.', value: 'STAFF' },
          { label: 'Yönetim Komutları', description: 'Genel tüm yönetim komutlarını içerir.', value: 'ADMIN'},
          { label: 'Kurucu Komutları', description: 'Genel tüm kurucu komutlarını içerir.', value: 'OWNER' },
         ]),
    );

    let msg = await message.reply({ embeds: [ertuembed.setDescription(`:tada: Aşağıdaki kategorilerden komut yardım almak istediğiniz kategoriyi seçin`)], components: [row] })
    var filter = (menu) => menu.user.id === message.author.id;
    const collector = msg.createMessageComponentCollector({ filter, time: 90000 })

    collector.on("collect", async (menu) => {
      const categories = ["USER", "REGISTER", "EKONOMI", "STAT", "STAFF", "ADMIN", "OWNER"];
      const selectedCategory = categories.find(category => menu.values[0] === category);
      
      if (selectedCategory) {
        await menu.deferUpdate();
    
        const embeds = new EmbedBuilder()
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
        .setDescription(`${client.commands.filter(x => x.category !== "-" && x.category == selectedCategory.toUpperCase()).map(x => `${client.emoji("ertu_nokta")} \` ${x.command.usage} \``).join('\n')}`);
        msg.edit({embeds: [embeds],components: [row]});
      }
    });
    
  collector.on("end", () => {
    msg.delete().catch(err => {})
  })
},

  };