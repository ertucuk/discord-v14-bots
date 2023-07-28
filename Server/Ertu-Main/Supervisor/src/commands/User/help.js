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
      aliases: ["y","help","h"],
      usage: ".yardım", 
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
          {
            label: 'Kullanıcı Komutları',
            description: 'Kullanıcı Komutlar',
            value: 'kullanıcı',
          },			
          {
            label: 'Kayıt Komutları',
            description: 'Kayıt Komutlar',
            value: 'reg',
          },
          {
            label: 'Cezalandırma Komutları',
            description: 'Cezalandırma Komutlar',
            value: 'ceza',
          },
          {
            label: 'Stat Komutları',
            description: 'Stat Komutlar',
            value: 'stats',
          },
          {
            label: 'Yetkili Komutları',
            description: 'Yetkili Komutlar',
            value: 'staff',
          },
          {
            label: 'Kurucu Komutları',
            description: 'Kurucu Komutlar',
            value: 'owner',
          },
          {
            label: 'Sahip Komutları',
            description: 'Sahip Komutlar',
            value: 'botsahip',
          },
        ]),
    );

    let msg = await message.reply({ embeds: [ertuembed.setThumbnail(message.author.avatarURL({dynamic: true, size: 2048})).setDescription(`Aşağıda sunucudaki komutlar sıralandırılmıştır. Toplam \`${client.commands.size}\` tane komut kullanılabilir. Komut bilgisini detaylı öğrenmek için \`.yardım <Komut Ismi>\` komutu ile komutun detaylı bilgilerini görebilirsin.`)], components: [row] })

    var filter = (menu) => menu.user.id === message.author.id;
    const collector = msg.createMessageComponentCollector({ filter, time: 90000 })

    collector.on("collect", async (menu) => {
      if(menu.values[0] === "kullanıcı") {
        await menu.deferUpdate();
  
        const embeds = new EmbedBuilder()
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
        .setThumbnail(message.author.avatarURL({dynamic: true, size: 2048}))
        .setDescription(`${client.commands.filter(x => x.category !== "-" && x.category == "USER").map(x => `\` ${x.command.usage} \``).join('\n')}`)
        
              msg.edit({
                embeds: [embeds],
                components : [row]
              })
            }
      if(menu.values[0] === "reg") {
        await menu.deferUpdate();
  
        const embeds = new EmbedBuilder()
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
        .setThumbnail(message.author.avatarURL({dynamic: true, size: 2048}))
        .setDescription(`${client.commands.filter(x => x.category !== "-" && x.category == "REGISTER").map(x => `\` ${x.command.usage} \``).join('\n')}`)
        
              msg.edit({
                embeds: [embeds],
                components : [row]
              })
            }
      if(menu.values[0] === "ceza") {
        await menu.deferUpdate();
  
        const embeds = new EmbedBuilder()
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
        .setThumbnail(message.author.avatarURL({dynamic: true, size: 2048}))
        .setDescription(`${client.commands.filter(x => x.category !== "-" && x.category == "PENAL").map(x => `\` ${x.command.usage} \``).join('\n')}`)
        
              msg.edit({
                embeds: [embeds],
                components : [row]
              })
            }
      if(menu.values[0] === "stats") {
        await menu.deferUpdate();
  
        const embeds = new EmbedBuilder()
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
        .setThumbnail(message.author.avatarURL({dynamic: true, size: 2048}))
        .setDescription(`${client.commands.filter(x => x.category !== "-" && x.category == "STAT").map(x => `\` ${x.command.usage} \``).join('\n')}`)
        
              msg.edit({
                embeds: [embeds],
                components : [row]
              })
            }
        if(menu.values[0] === "staff") {
              await menu.deferUpdate();
        
              const embeds = new EmbedBuilder()
              .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
              .setThumbnail(message.author.avatarURL({dynamic: true, size: 2048}))
              .setDescription(`${client.commands.filter(x => x.category !== "-" && x.category == "STAFF").map(x => `\` ${x.command.usage} \``).join('\n')}`)
              
                    msg.edit({
                      embeds: [embeds],
                      components : [row]
                    })
                  }
      if(menu.values[0] === "owner") {
        await menu.deferUpdate();
  
        const embeds = new EmbedBuilder()
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
        .setThumbnail(message.author.avatarURL({dynamic: true, size: 2048}))
        .setDescription(`${client.commands.filter(x => x.category !== "-" && x.category == "ADMIN").map(x => `\` ${x.command.usage} \``).join('\n')}`)
        
              msg.edit({
                embeds: [embeds],
                components : [row]
              })
            }
      if(menu.values[0] === "botsahip") {
        await menu.deferUpdate();
        const embeds = new EmbedBuilder()
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
        .setThumbnail(message.author.avatarURL({dynamic: true, size: 2048}))
        .setDescription(`${client.commands.filter(x => x.category !== "-" && x.category == "OWNER").map(x => `\` ${x.command.usage}\``).join('\n')}`)
        
              msg.edit({
                embeds: [embeds],
                components : [row]
              })
            }
  })



},

    onSlash: async function (client, interaction) { },
  };