const { ApplicationCommandOptionType, EmbedBuilder , PermissionsBitField, StringSelectMenuBuilder, ActionRowBuilder} = require("discord.js");
const moment = require("moment");
moment.locale("tr");
const { YamlDatabase } = require("five.db");
const db = new YamlDatabase();
const penals = require("../../../../../../Global/Schemas/penals");
const { green , red } = require("../../../../../../Global/Settings/Emojis.json")
const ertucuk = require("../../../../../../Global/Settings/System");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const kanal = require("../../../../../../Global/Settings/AyarName");
const ceza = require("../../../../../../Global/Schemas/ceza");

module.exports = {
    name: "uyarılar",
    description: "Kullanıcının uyarılarını gösterir.",
    category: "STAFF",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ['warnings'],
      usage: ".uyarılar <@User/ID>",  
    },

    onLoad: function (client) { },

    onCommand: async function (client, message, args) {

      let kanallar = kanal.KomutKullanımKanalİsim;
      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !ertum.CMuteHammer.some(x => message.member.roles.cache.has(x))) { 
        return message.channel.send({ content:"Yeterli yetkin bulunmuyor!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
      }

      let member = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.member;
      
      if (!member) { 
        message.react(`${client.emoji("ertu_carpi")}`)
        return message.reply({ content:"Böyle bir kullanıcı bulunamadı!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
       
      }
        const warnings = await penals.find({ guildID: message.guild.id, userID: member.id, type: 'Uyarı' })

        if (warnings.length == 0) {
            return await message.reply({ embeds: [new EmbedBuilder().setDescription( `${client.emoji("ertu_onay")} ${member.toString()} üyesi hiç uyarı almamış!`)]}).then((e) => setTimeout(() => { e.delete(); }, 5000));
        }

        const selectMenu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
            .setCustomId("MEMBER_WARNINGS")
            .setPlaceholder('Uyarılar (1-25)')
            .setMaxValues(1)
            .setMinValues(1)
            .addOptions([
                ...warnings.slice(0, 25).map((x) => ({
                    value: `${x.id}`,
                    label: `${x.type} (#${x.id})`,
                    description: `${x.reason.length > 100 ? x.reason.substring(0, 98).trim() + '..' : x.reason}`,
                    }))
            ])
        ) 
        
        const embed = new EmbedBuilder()
            .setAuthor({ iconURL: member.displayAvatarURL({ dynamic: true }), name: member.username })    
            .setDescription(`${member} (\`${member.id}\`) adlı kullanıcının toplam **${warnings ? warnings.length : 0}** adet uyarısı bulunuyor, kullanıcı **${warnings ? Math.floor(warnings.length - 5) : 5}** adet daha uyarı alırsa **1 saat timeout** cezası alacak.`)
            
        await message.reply({
            embeds: [embed],
            components: [selectMenu]
        })
    }
};