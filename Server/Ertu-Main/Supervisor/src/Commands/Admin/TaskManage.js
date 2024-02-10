const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const ertum = require("../../../../../../Global/Settings/Setup.json");

module.exports = {
    name: "görevyönetim",
    description: "Görevleri listeler.",
    category: "OWNER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["görevsistemi","görev-yönetim","görevyönetimi"],
      usage: ".görevler",
    },

    onLoad: function (client) { },

    onCommand: async function (client, message, args) {

        if(!ertum.OwnerRoles.some(ertucum => message.member.roles.cache.has(ertucum)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) { 
            message.react(`${client.emoji("ertu_carpi")}`)
            message.reply({ content:`Yeterli yetkin yok!`}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
            return 
        }

            const row = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                  .setCustomId('addNewTask')
                  .setStyle(ButtonStyle.Success)
                  .setLabel('Görev Ekle'),
              new ButtonBuilder()
                  .setCustomId('removeTask')
                  .setStyle(ButtonStyle.Danger)
                  .setLabel('Görev Sil'),
              new ButtonBuilder()
                  .setCustomId('listTask')
                  .setStyle(ButtonStyle.Secondary)
                  .setLabel('Görevleri Listele')    
          )
  
          message.reply({content: `Görev sistemine hoşgeldiniz! Aşağıda bulunan düğmeler ile görev sistemine ekleme, listeleme ve silme işlemlerini gerçekleştirebilirsin.`,components: [row]})
    },
};