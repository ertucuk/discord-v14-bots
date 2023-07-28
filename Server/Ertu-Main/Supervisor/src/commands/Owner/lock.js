const { ApplicationCommandOptionType,EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,PermissionsBitField } = require("discord.js");
const ertucuk = require("../../../../../../Global/Settings/System");

module.exports = {
    name: "kilit",
    description: "Kanalı kitlersiniz.",
    category: "ADMIN",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["kilitle","lock","unlock"],
      usage: ".kilit",
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
        if(!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
        {
          return
        }
        let ac = new ButtonBuilder()
        .setCustomId("ac")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("🔓");
    
        let kapa = new ButtonBuilder()
        .setCustomId("kapa")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("🔒");
    
        if (message.channel.permissionsFor(message.guild.id).has(PermissionsBitField.Flags.SendMessages) === (true || null)) {
          ac.setStyle(ButtonStyle.Success).setDisabled(true);
        } else {
          ac.setStyle(ButtonStyle.Success);
        }
    
        if (message.channel.permissionsFor(message.guild.id).has(PermissionsBitField.Flags.SendMessages) === false) {
          kapa.setStyle(ButtonStyle.Danger).setDisabled(true);
        } else {
          kapa.setStyle(ButtonStyle.Danger);
        }
    
        const row = new ActionRowBuilder()
        .addComponents([ ac, kapa ]);
      
      
        let ertu = new EmbedBuilder()
        .setFooter({text: ertucuk.SubTitle})  
        .setDescription(`${message.author} Kanal Kilidini Aktifleştirmek ve Deaktifleştirmek için butonları kullanınız.`)
        .setFooter({ text: `Kapalı olan buton şuanki kanalın kilit durumunu gösterir tekrar kullanılamaz.`})
    
      let msg = await message.channel.send({ embeds: [ertu], components: [row] })
      var filter = button => button.user.id === message.author.id;
      let collector = await msg.createMessageComponentCollector({ filter, time: 30000 })
    
      collector.on("collect", async (button) => {
    
        if (button.customId === "ac") {
          await button.deferUpdate();
          let everyone = message.guild.roles.cache.find(r => r.name === "@everyone");
          message.channel.permissionOverwrites.edit(everyone.id, {
            SendMessages: null
          }).then(async() => {
              message.react("🔓")
              await msg.edit({ content: `Kanalın kilidi başarıyla açıldı.`, embeds: [], components: [] });
          })
        }
        if (button.customId === "kapa") {
          await button.deferUpdate();
          let everyone = message.guild.roles.cache.find(r => r.name === "@everyone");
          message.channel.permissionOverwrites.edit(everyone.id, {
            SendMessages: false
          }).then(async() => {
              message.react("🔒")
              await msg.edit({ content: `Kanal başarıyla kilitlendi.`, embeds: [], components: [] });
          })
        }
      })


     },

    onSlash: async function (client, interaction) { },
  };