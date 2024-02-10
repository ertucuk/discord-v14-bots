const { ApplicationCommandOptionType,ActionRowBuilder,ButtonBuilder,ButtonStyle ,PermissionsBitField, EmbedBuilder} = require("discord.js");
const kanal = require("../../../../../../Global/Settings/AyarName");
const roller = require("../../../../../../Global/Schemas/rolveridb");
const ertum = require("../../../../../../Global/Settings/Setup.json");

module.exports = {
    name: "rollog",
    description: "Belirttiğiniz üyenin üye rollog bilgilerini gösterir.",
    category: "ADMIN",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["rol-log", "rollogs", "rol-logs"],
      usage: ".rollog",
    },
  

    onLoad: function (client) { },

    onCommand: async function (client, message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ViewAuditLog) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !global.config.OwnerRoles.some(x => message.member.roles.cache.has(x))) {
          message.react(`${client.emoji("ertu_carpi")}`)
          message.channel.send({ content:"Yeterli yetkin bulunmuyor!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
          return 
        };
            
        const Member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        const Veri = await roller.findOne({ user: Member.id });
        
        if (!Veri) return message.reply({ content: "<@" + Member.id + "> kişisinin rol bilgisi veritabanında bulunmadı."})
        
        let page = 1;
        let rol = Veri.roller.sort((a, b) => b.tarih - a.tarih)
        let liste = rol.map(x => `[<t:${Math.floor(x.tarih / 1000)}:R>], **[${x.state == "Ekleme" ? "EKLEME" : "KALDIRMA" }]** <@${x.mod}>: <@&${x.rol}>`)

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("önce")
            .setLabel("Önceki Sayfa")
            .setStyle(ButtonStyle.Success)
            .setEmoji("⏮️"),
          new ButtonBuilder()
            .setCustomId("kapat")
            .setLabel(`${page} / ${Math.ceil(liste.length / 10)}`)
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("sonra")
            .setLabel("Sonraki Sayfa")
            .setStyle(ButtonStyle.Success)
            .setEmoji("⏭️"),
        );


        if (liste.length <= 10) {
          await message.channel.send({ embeds: [new EmbedBuilder().setDescription(`${liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join('\n')}`).setTimestamp().setAuthor({ name: Member.user.tag, iconURL: Member.user.avatarURL({ dynamic: true  })})]});
        } else if (liste.length > 10) {
          var msg = await message.channel.send({ embeds: [new EmbedBuilder().setDescription(`${liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join('\n')}`).setTimestamp().setAuthor({ name: Member.user.tag, iconURL: Member.user.avatarURL({ dynamic: true  })})], components: [row]});
        }
       
        if (msg) {
        var filter = (button) => button.user.id === message.author.id;
        let collector = await msg.createMessageComponentCollector({ filter, time: 60000 })
        
        collector.on("collect", async (button) => {
              
          if (liste.length > 10) {
          
            if(button.customId === "önce") {
              await button.deferUpdate();

              if (liste.slice((page - 1) * 10 - 10, (page - 1) * 10).length <= 0) return;
                
              page -= 1;
              
              const row = ActionRowBuilder.from(msg.components[0]);
              row.components[1].setLabel(`${page} / ${Math.ceil(liste.length / 10)}`)
              
              let rollogVeri = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
              msg.edit({ components: [row], embeds: [new EmbedBuilder().setDescription(`${rollogVeri}`).setTimestamp().setAuthor({ name: Member.user.tag, iconURL: Member.user.avatarURL({ dynamic: true  })})]});
            }
            
            if (button.customId === "sonra") {
              await button.deferUpdate();

              if (liste.slice((page + 1) * 10 - 10, (page + 1) * 10).length <= 0) return;
              
              page += 1;
              let rollogVeri = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
              
              const row = ActionRowBuilder.from(msg.components[0]);

              row.components[1].setLabel(`${page} / ${Math.ceil(liste.length / 10)}`)
              msg.edit({ components: [row], embeds: [new EmbedBuilder().setDescription(`${rollogVeri}`).setTimestamp().setAuthor({ name: Member.user.tag, iconURL: Member.user.avatarURL({ dynamic: true  })})]});
            }


            if(button.customId === "kapat") {
              await button.deferUpdate();
              
              row.components.forEach(component => component.setDisabled(true))  

              msg.edit({ components: [row] }); 
            }
            }
          })

          collector.on('end', async (collected) => {
            if (collected.size < 1) {
                row.components.forEach(component => component.setDisabled(true))  

                msg.edit({ components: [row] }); 
            }
        })
        }
     },
  };