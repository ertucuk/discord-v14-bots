const { ApplicationCommandOptionType,EmbedBuilder,ActionRowBuilder, StringSelectMenuBuilder,Events, TextInputStyle,ModalBuilder,TextInputBuilder, PermissionsBitField  } = require("discord.js");
const client = global.bot;
const ms = require("ms");
const messages = require('../../../../../../Global/Settings/messages');
const ertum = require("../../../../../../Global/Settings/Setup.json");

module.exports = {
    name: "cekilis",
    description: "Çekiliş başlatırsın",
    category: "ADMIN",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["çekiliş"],
      usage: ".çekiliş", 
    },

    onLoad: function (client) { },

    onCommand: async function (client, message, args, ertuembed) {

        if(!ertum.OwnerRoles.some(ertucum => message.member.roles.cache.has(ertucum)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
        { 
        message.react(`${client.emoji("ertu_carpi")}`)
        message.reply({ content:`Yeterli yetkin yok!`}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }

    let buttons = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
    .setPlaceholder("Çekiliş İşlemini Şeçiniz!")
    .setCustomId("giveawaymenu")
    .setOptions([
    { label: `Çekiliş Başlat`, description: `Bir Çekiliş Başlatır!`, value: `gvstart`, emoji: `🎉` },
    { label: `Çekiliş Bitir`, description: `Aktif Olan Bir Çekilişi Bitirir!`, value: `gvend`, emoji: `🛑` }
    ]))

    let msg = await message.reply({ components: [buttons], embeds: [ertuembed.setDescription(`Menuden Bir \`Çekiliş\` İşlemi Belirtiniz!`)] })
    message.delete();     

    const collector = msg.createMessageComponentCollector({ filter: i => i.user.id === message.member.id, time: 30000, max: 1 });

    collector.on('end', async (ertu) => {
        if (ertu.size == 0) msg.delete();
    })

    collector.on('collect', async (interaction) => {
        if (!interaction.isStringSelectMenu()) return;
        let value = interaction.values[0];
        switch (value) {
            case "gvstart":
                msg.delete();
                const modal = new ModalBuilder()
                .setCustomId('gvstartModal')
                .setTitle('Çekiliş Başlat');
            const gv2 = new TextInputBuilder()
                .setCustomId('gvprize')
                .setLabel("Çekilişin Ödülü")
                .setMinLength(3)
                .setMaxLength(15)
                .setPlaceholder("Örn; Spotify")
                .setStyle(TextInputStyle.Paragraph)   
                .setRequired(true);
                const gv3 = new TextInputBuilder()
                .setCustomId('gvtime')
                .setMinLength(2)
                .setMaxLength(3)
                .setLabel("Çekiliş Süresi")
                .setPlaceholder("Örn; 10m = 10 Dakika")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

                const gv4 = new TextInputBuilder()
                .setCustomId('gvwinners')
                .setLabel("Çekiliş Kazanacak Sayısı")
                .setMinLength(1)
                .setMaxLength(2)
                .setPlaceholder("Örn; 2 = 2 Kişi Kazanır")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

                let g2 = new ActionRowBuilder().addComponents(gv2);
                let g3 = new ActionRowBuilder().addComponents(gv3);
                let g4 = new ActionRowBuilder().addComponents(gv4);
                modal.addComponents(g2, g3, g4);

                await interaction.showModal(modal);

                break;
                case "gvend":
                    msg.delete();
                    const modal2 = new ModalBuilder()
                    .setCustomId('gvendModal')
                    .setTitle('Çekiliş Bitir');
                const gvend1 = new TextInputBuilder()
                    .setCustomId('gvendid')
                    .setLabel("Bitirilecek Çekilişin Ödül Adı")
                    .setPlaceholder("Örn; Spotify")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);
        
                    let gend = new ActionRowBuilder().addComponents(gvend1);
                    modal2.addComponents(gend);

                    await interaction.showModal(modal2);

                break;

        }});

        client.on(Events.InteractionCreate,async(interaction) => {
            if(!interaction.isModalSubmit()) return;
            if (interaction.customId === 'gvstartModal') {
                let kanal = interaction.channel.id
                if(!interaction.guild.channels.cache.get(kanal))return interaction.reply({content:`\`${kanal}\` ID'sine Sahip Bir kanal Bulunamadı!`})
                let prize = interaction.fields.getTextInputValue('gvprize');
                let time = interaction.fields.getTextInputValue('gvtime');
                let winnders = interaction.fields.getTextInputValue('gvwinners');
            
                client.giveawaysManager.start(interaction.guild.channels.cache.get(kanal), {duration: ms(time),winnerCount:parseInt(winnders),prize:prize,messages})
                interaction.reply({content:` 🎉 \`${prize}\` Ödüllü ${winnders} Kişinin Kazanacağı ${time} Sürelik Çekiliş ${interaction.guild.channels.cache.get(kanal)} Kanalında Başlatıldı!`})
                
            }else if(interaction.customId === 'gvendModal'){
            let id = interaction.fields.getTextInputValue('gvendid');
            let x = client.giveawaysManager.giveaways.find((g) => g.prize === id)
            client.giveawaysManager.end(x.messageId);
            interaction.reply({content:` 🎉 \`${x.prize}\` Ödüllü Çekiliş Bitirildi!`})
            }
            })
},
};