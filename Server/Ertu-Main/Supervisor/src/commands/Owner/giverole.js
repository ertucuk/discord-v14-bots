const { EmbedBuilder } = require("@discordjs/builders");
const { ApplicationCommandOptionType, PermissionsBitField } = require("discord.js");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const {red , green} = require("../../../../../../Global/Settings/Emojis.json");

module.exports = {
    name: "rolver",
    description: "Belirttiğiniz kullanıcıya istediğiniz rolü verirsiniz.",
    category: "ADMIN",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["rolver","rol-ver","r"],
      usage: ".rolver <@user/ID> @role", 
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

        if(!ertum.RolePanelRoles.some(ertucum => message.member.roles.cache.has(ertucum)) && !ertum.OwnerRoles.some(ertucum => message.member.roles.cache.has(ertucum)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
        { message.reply({ content:`Malesef yetkin bulunmamakta dostum.`}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
    
        if (!args[0]) return message.reply({ content:`${red} Kullanımı: .r al/ver @Ertu <@Rol/ID>`})
        if (args[0] != "al") {
            if (args[0] != "ver") {
                return message.reply({ content:`${red} Kullanımı: .r al/ver @Ertu <@Rol/ID>`})
            }
        }

        if (!args[1]) return message.reply({ content:`${red} Bir üye etiketle ve tekrardan dene!`})
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[1])
        if (!member) return message.reply({ content:`${red} Bir üye etiketle ve tekrardan dene!`})

        if (!args[2]) return message.reply({ content:`${red} Rolü belirtmelisin.`})
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2])
        if (!role) return message.reply({ content:`${red} Belirtmiş olduğun rolü bulamadım.`})
        if (message.member.roles.highest.rawPosition <= role.rawPosition) return message.reply({ content:`${red} Kendi rolünden yüksek veya eşit bir rolle işlem yapamazsın.`})

        if (args[0] == "al") {
            if (member.roles.cache.has(role.id)) {
              member.roles.remove(role.id)
              message.reply({ embeds: [ertuembed.setDescription(`Başarıyla ${member} Kişisinden ${role} rolünü aldım.`)]})
              client.channels.cache.find(x => x.name == "rol_log").send({ embeds: [new EmbedBuilder().setDescription(`${member} kullanıcına ${message.author} tarafından ${role} rolü verildi.`)            
            .addFields(
            { name: `Veren Yetkili`, value: `${message.author}`, inline: true},
            { name: `Verilen Kişi`, value: `${member}`, inline: true},
            { name: `Verilen Rol`, value: `${role}`, inline: true}
            )]})
            } else {
              message.reply({ embeds: [ertuembed.setDescription(`${member} Kişisinde ${role} rolü yok!`)]})
            }
        }
        if (args[0] == "ver") {
            if (!member.roles.cache.has(role.id)) {
              member.roles.add(role.id)
              message.reply({ embeds: [ertuembed.setDescription(`${member} Kişisine ${role} rolünü ekledim.`)]})
              client.channels.cache.find(x => x.name == "rol_log").send({ embeds: [new EmbedBuilder().setDescription(`${member} kullanıcına ${message.author} tarafından ${role} rolü verildi.`)            
            .addFields(
            { name: `Alan Yetkili`, value: `${message.author}`, inline: true},
            { name: `Alınan Kişi`, value: `${member}`, inline: true},
            { name: `Alınan Rol`, value: `${role}`, inline: true}
            )]})
            } else {
              message.reply({ embeds: [ertuembed.setDescription(`${member} Kişisinde ${role} rolü zaten mevcut.`)]})
            }
        }






     },

    onSlash: async function (client, interaction) { },
  };