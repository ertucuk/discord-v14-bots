const { Events, ApplicationCommandOptionType, StringSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, EmbedBuilder, ButtonStyle, TextInputBuilder, TextInputStyle } = require("discord.js");
const ertucuk = require("../../../../../../Global/Settings/System");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const { star } = require("../../../../../../Global/Settings/Emojis.json");

module.exports = {
    name: "destek",
    description: "Destek Sistemi",
    category: "OWNER",
    cooldown: 0,
    command: {
        enabled: true,
        aliases: ["support"],
        usage: ".support",
    },
    slashCommand: {
        enabled: false,
        options: [
            {
                name: "ertu",
                description: "ertu",
                type: ApplicationCommandOptionType.Subcommand,
            },
        ],
    },

    onLoad: function (client) {

        client.on(Events.InteractionCreate, async interaction => {
            if (interaction.customId == "basvur") {
                const modal = new ModalBuilder()
                    .setCustomId("ybasvuru")
                    .setTitle("Yetkili Başvurusu")
                const soru1 = new TextInputBuilder()
                    .setCustomId("soru1")
                    .setLabel(`İsim Ve Yaşınız`)
                    .setPlaceholder("Buraya İsim Ve Yaşınızı Yazın. / Örn: Ertu 18")
                    .setStyle(TextInputStyle.Short);
                const soru2 = new TextInputBuilder()
                    .setCustomId("soru2")
                    .setLabel(`Günde Kaç Saat Aktifsiniz`)
                    .setPlaceholder(`Günde Kaç Saat Aktif Olduğunuzu Yazın. / Örn: 8 Saat`)
                    .setStyle(TextInputStyle.Short);
                const soru3 = new TextInputBuilder()
                    .setCustomId("soru3")
                    .setMinLength(10)
                    .setLabel(`Sunucumuz için neler yapabilirsiniz?`)
                    .setPlaceholder(`Ne Yapabileceğinizi Yazın. / Örn: 5 Davet`)
                    .setStyle(TextInputStyle.Short);
                const soru4 = new TextInputBuilder()
                    .setCustomId("soru4")
                    .setMinLength(10)
                    .setLabel(`Bize biraz kendinizden bahseder misiniz?`)
                    .setPlaceholder(`Ne Yapmaktan Hoşlandığınızı Yazın. / Örn: Sohbet Etmek `)
                    .setStyle(TextInputStyle.Paragraph);

                const AOne = new ActionRowBuilder().addComponents(soru1);
                const ATwo = new ActionRowBuilder().addComponents(soru2);
                const AThree = new ActionRowBuilder().addComponents(soru3);
                const AFour = new ActionRowBuilder().addComponents(soru4);

                modal.addComponents(AOne, ATwo, AThree, AFour);
                await interaction.showModal(modal);
            }
        })
// ! BURASI İSTEK ÖNERİ ŞİKAYET BAŞLANGIÇI
        client.on(Events.InteractionCreate, async interaction => {
            if (interaction.customId == "iös") {
                const modal = new ModalBuilder()
                    .setCustomId("ibasvuru")
                    .setTitle("İstek Öneri Şikayet Talebi")
                const s1 = new TextInputBuilder()
                    .setCustomId("s1")
                    .setLabel(`İşlem Türünüzü Yazınız`)
                    .setPlaceholder("Örnek: İstek/Öneri/Şikayet")
                    .setStyle(TextInputStyle.Short);
                const s2 = new TextInputBuilder()
                    .setCustomId("s2")
                    .setMinLength(5)
                    .setLabel(`Sorunuzu bildiriniz.`)
                    .setPlaceholder(`Örnek: Sunucuya Güzel Sistemler eklensin.`)
                    .setStyle(TextInputStyle.Paragraph);

                const AOne = new ActionRowBuilder().addComponents(s1);
                const ATwo = new ActionRowBuilder().addComponents(s2);
 
                modal.addComponents(AOne, ATwo);
                await interaction.showModal(modal);
            }
        })

        client.on(Events.InteractionCreate, async interaction => {
            if(interaction.customId === 'ibasvuru'){
                await interaction.reply({ content: `Başvurunuz Başarıyla Alındı!`, ephemeral: true });
                const iBasvuruLog = client.guilds.cache.get(ertucuk.ServerID).channels.cache.find((channel) => channel.id === ertum.IstekOneriSikayetLogChannel);
                const lulubutton = new ButtonBuilder().setCustomId('luluuuuu').setLabel("Lulu 💜 Ertu").setStyle(ButtonStyle.Secondary).setDisabled(true);
                const lulurow = new ActionRowBuilder().addComponents(lulubutton)
                const s1 = interaction.fields.getTextInputValue('s1');
                const s2 = interaction.fields.getTextInputValue('s2'); 

                const lulu = new EmbedBuilder()
                .setColor("#2b2d31")
                .setDescription(`
**Kullanıcı:** ${interaction.user.displayName}

**・Soru 1:** İşlem Türünüzü Yazınız?
\`\`\`
${s1}
\`\`\`
**・Soru 2:** Sorunuzu bildiriniz.
\`\`\`
${s2}
\`\`\`
                `)

                iBasvuruLog.send({ embeds: [lulu], components: [lulurow] })

            }
        })


        client.on(Events.InteractionCreate, async interaction => {
            const member = interaction.member
            if (interaction.customId === 'ybasvuru') {
                await interaction.reply({ content: `Başvurunuz Başarıyla Alındı!`, ephemeral: true });
                const yBasvuruLog = client.guilds.cache.get(ertucuk.ServerID).channels.cache.find((channel) => channel.id === ertum.BasvuruLogChannel);
                const button = new ButtonBuilder().setCustomId('kabul').setLabel("Kabul Et").setStyle(ButtonStyle.Success);
                const button2 = new ButtonBuilder().setCustomId('reddet').setLabel("Reddet").setStyle(ButtonStyle.Danger);
                const row = new ActionRowBuilder().addComponents(button, button2);
                const soru1 = interaction.fields.getTextInputValue('soru1');
                const soru2 = interaction.fields.getTextInputValue('soru2');
                const soru3 = interaction.fields.getTextInputValue('soru3');
                const soru4 = interaction.fields.getTextInputValue('soru4');

                const embed = new EmbedBuilder()
                    .setTitle("Yetkili Başvuru [BEKLEMEDE]")
                    .setColor("#2b2d31")
                    .setDescription(`
**Kullanıcı:** ${interaction.user.displayName}

**・Soru 1:** İsim Ve Yaşınız?
\`\`\`
${soru1}
\`\`\`
**・Soru 2:** Günde Kaç Saat Aktif Olduğunuzu Yazın?
\`\`\` 
${soru2}
\`\`\`
**・Soru 3:** Sunucumuz için neler yapabilirsiniz? 
\`\`\`
${soru3}
\`\`\`
**・Soru 4:** Bize biraz kendinizden bahseder misiniz?
\`\`\`
${soru4} 
\`\`\`
    
**Not:** Onaylamak veya reddetmek için aşağıdaki butonları kullanınız.   
`)
                yBasvuruLog.send({ embeds: [embed], components: [row] }).then(msg => {

                    const aButton = new ButtonBuilder().setCustomId('kabull').setLabel("Kabul Et").setStyle(ButtonStyle.Success).setDisabled(true)
                    const dButton = new ButtonBuilder().setCustomId('reddet').setLabel("Reddet").setStyle(ButtonStyle.Danger).setDisabled(true)
                    const row2 = new ActionRowBuilder().addComponents(aButton, dButton);
                    client.on(Events.InteractionCreate, async interaction => {
                        if (interaction.customId === "kabul") {
                            const aEmbed = new EmbedBuilder()
                                .setTitle("Yetkili Başvuru [KABUL EDİLDİ]")
                                .setColor("#2b2d31")
                                .setDescription(`
**Kullanıcı:** ${interaction.user.displayName}
      
**・Soru 1:** İsim Ve Yaşınız?
\`\`\`
${soru1}
\`\`\`
**・Soru 2:** Günde Kaç Saat Aktif Olduğunuzu Yazın?
\`\`\` 
${soru2}
\`\`\`
**・Soru 3:** Sunucumuz için neler yapabilirsiniz? 
\`\`\`
${soru3}
\`\`\`
**・Soru 4:** Bize biraz kendinizden bahseder misiniz?
\`\`\`
${soru4} 
\`\`\`          
`)

                            await msg.edit({ embeds: [aEmbed], components: [row2] });
                            interaction.reply({ content: `Başarıyla ${member} kullanıcısının başvurusunu onayladınız. `, ephemeral: true })
                            await member.send({ content: `${interaction.guild.name} Sunucusunda başvurunuz onaylandı!` })
                            member.roles.add(ertum.StartAuthority)
                        }

                        if (interaction.customId === "reddet") {
                            const dEmbed = new EmbedBuilder()
                                .setTitle("Yetkili  Başvurusu [REDDEDİLDİ]")
                                .setColor("#2b2d31")
                                .setDescription(`
**Kullanıcı:** ${interaction.user.displayName}
   
**・Soru 1** İsim Ve Yaşınız?
\`\`\`
${soru1}
\`\`\`
**・Soru 2** Günde Kaç Saat Aktif Olduğunuzu Yazın?
\`\`\` 
${soru2}
\`\`\`
**・Soru 3** Sunucumuz için neler yapabilirsiniz? 
\`\`\`
${soru3}
\`\`\`
**・Soru 4** Bize biraz kendinizden bahseder misiniz?
\`\`\`
${soru4} 
\`\`\`
       
`)
                            await msg.edit({ embeds: [dEmbed], components: [row2] });
                            interaction.reply({ content: `Başarıyla ${member} kullanıcısının başvurusunu reddetiniz. `, ephemeral: true })
                            await member.send({ content: `${interaction.guild.name} Sunucusunda başvurunuz reddedildi!` })

                        }


                    })
                })

            }
        })



    },

    onCommand: async function (client, message, args, ertuembed) {

        message.channel.send({
         content: 
                  `${star} Aşağıdaki Butonlar Üzerinden **İstek,Öneri,Şikayet** Veya **Yetkili Başvurusu** Yapabilirsiniz.`
            , components: [new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("basvur")
                    .setLabel("Yetkili Başvur")
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("🛡️"),
                new ButtonBuilder()
                    .setCustomId("iös")
                    .setLabel("İstek & Öneri & Şikayet")
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("📨"),
            )]
        });
    },

    onSlash: async function (client, interaction) { },
};