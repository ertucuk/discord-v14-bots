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

    onLoad: function (client) {
        client.on(Events.InteractionCreate, async interaction => {
            if (interaction.customId == "basvur") {
                const modal = new ModalBuilder()
                    .setCustomId("ybasvuru")
                    .setTitle("Yetkili Başvurusu");
    
                const questions = [
                    { id: "soru1", label: "İsim Ve Yaşınız", placeholder: "Buraya İsim Ve Yaşınızı Yazın. / Örn: Ertu 18", style: TextInputStyle.Short },
                    { id: "soru2", label: "Günde Kaç Saat Aktifsiniz", placeholder: "Günde Kaç Saat Aktif Olduğunuzu Yazın. / Örn: 8 Saat", style: TextInputStyle.Short },
                    { id: "soru3", label: "Sunucumuz için neler yapabilirsiniz?", placeholder: "Ne Yapabileceğinizi Yazın. / Örn: 5 Davet", style: TextInputStyle.Short },
                    { id: "soru4", label: "Bize biraz kendinizden bahseder misiniz?", placeholder: "Ne Yapmaktan Hoşlandığınızı Yazın. / Örn: Sohbet Etmek", style: TextInputStyle.Paragraph }
                ];
    
                const modalComponents = questions.map(q => new TextInputBuilder()
                    .setCustomId(q.id)
                    .setLabel(q.label)
                    .setPlaceholder(q.placeholder)
                    .setStyle(q.style));
    
                modal.addComponents(...modalComponents);
                await interaction.showModal(modal);
            }
        });

         if (interaction.customId === 'ybasvuru') {
          const member = interaction.member;
          await interaction.reply({ content: `Başvurunuz Başarıyla Alındı!`, ephemeral: true });
      
          const yBasvuruLog = client.guilds.cache.get(ertucuk.ServerID).channels.cache.find((channel) => channel.id === ertum.BasvuruLogChannel);
          const button = new ButtonBuilder().setCustomId('kabul').setLabel("Kabul Et").setStyle(ButtonStyle.Success);
          const button2 = new ButtonBuilder().setCustomId('reddet').setLabel("Reddet").setStyle(ButtonStyle.Danger);
          const row = new ActionRowBuilder().addComponents(button, button2);
          
          const soru1 = interaction.fields.getTextInputValue('soru1');
          const soru2 = interaction.fields.getTextInputValue('soru2');
          const soru3 = interaction.fields.getTextInputValue('soru3');
          const soru4 = interaction.fields.getTextInputValue('soru4');
      
          const createEmbed = (title, color, description) => {
            return new EmbedBuilder()
              .setTitle(title)
              .setColor(color)
              .setDescription(description);
          };
      
          const sendEmbed = (embed, components, message) => {
            yBasvuruLog.send({ embeds: [embed], components: components }).then((msg) => {
              const aButton = new ButtonBuilder().setCustomId('kabull').setLabel("Kabul Et").setStyle(ButtonStyle.Success).setDisabled(true);
              const dButton = new ButtonBuilder().setCustomId('reddet').setLabel("Reddet").setStyle(ButtonStyle.Danger).setDisabled(true);
              const row2 = new ActionRowBuilder().addComponents(aButton, dButton);



    },

    onCommand: async function (client, message, args, ertuembed) {

        message.channel.send({
            content:
                `${client.emoji("ertu_star")} Aşağıdaki Butonlar Üzerinden **İstek,Öneri,Şikayet** Veya **Yetkili Başvurusu** Yapabilirsiniz.`
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
};

///////////// fonksiyonlar ///////////////////////////////
function createYetkiliBasvuru(client) {
    client.on(Events.InteractionCreate, async interaction => {
        if (interaction.customId == "basvur") {
            const modal = new ModalBuilder()
                .setCustomId("ybasvuru")
                .setTitle("Yetkili Başvurusu");

            const questions = [
                { id: "soru1", label: "İsim Ve Yaşınız", placeholder: "Buraya İsim Ve Yaşınızı Yazın. / Örn: Ertu 18", style: TextInputStyle.Short },
                { id: "soru2", label: "Günde Kaç Saat Aktifsiniz", placeholder: "Günde Kaç Saat Aktif Olduğunuzu Yazın. / Örn: 8 Saat", style: TextInputStyle.Short },
                { id: "soru3", label: "Sunucumuz için neler yapabilirsiniz?", placeholder: "Ne Yapabileceğinizi Yazın. / Örn: 5 Davet", style: TextInputStyle.Short },
                { id: "soru4", label: "Bize biraz kendinizden bahseder misiniz?", placeholder: "Ne Yapmaktan Hoşlandığınızı Yazın. / Örn: Sohbet Etmek", style: TextInputStyle.Paragraph }
            ];

            const modalComponents = questions.map(q => new TextInputBuilder()
                .setCustomId(q.id)
                .setLabel(q.label)
                .setPlaceholder(q.placeholder)
                .setStyle(q.style));

            modal.addComponents(...modalComponents);
            await interaction.showModal(modal);
        }
    });

    client.on(Events.InteractionCreate, async (interaction) => {
        if (interaction.customId === 'ybasvuru') {
          const member = interaction.member;
          await interaction.reply({ content: `Başvurunuz Başarıyla Alındı!`, ephemeral: true });
      
          const yBasvuruLog = client.guilds.cache.get(ertucuk.ServerID).channels.cache.find((channel) => channel.id === ertum.BasvuruLogChannel);
          const button = new ButtonBuilder().setCustomId('kabul').setLabel("Kabul Et").setStyle(ButtonStyle.Success);
          const button2 = new ButtonBuilder().setCustomId('reddet').setLabel("Reddet").setStyle(ButtonStyle.Danger);
          const row = new ActionRowBuilder().addComponents(button, button2);
          
          const soru1 = interaction.fields.getTextInputValue('soru1');
          const soru2 = interaction.fields.getTextInputValue('soru2');
          const soru3 = interaction.fields.getTextInputValue('soru3');
          const soru4 = interaction.fields.getTextInputValue('soru4');
      
          const createEmbed = (title, color, description) => {
            return new EmbedBuilder()
              .setTitle(title)
              .setColor(color)
              .setDescription(description);
          };
      
          const sendEmbed = (embed, components, message) => {
            yBasvuruLog.send({ embeds: [embed], components: components }).then((msg) => {
              const aButton = new ButtonBuilder().setCustomId('kabull').setLabel("Kabul Et").setStyle(ButtonStyle.Success).setDisabled(true);
              const dButton = new ButtonBuilder().setCustomId('reddet').setLabel("Reddet").setStyle(ButtonStyle.Danger).setDisabled(true);
              const row2 = new ActionRowBuilder().addComponents(aButton, dButton);
      
              client.on(Events.InteractionCreate, async (interaction) => {
                if (interaction.customId === "kabul") {
                  const aEmbed = createEmbed("Yetkili Başvuru [KABUL EDİLDİ]", "#2b2d31", description);
                  await msg.edit({ embeds: [aEmbed], components: [row2] });
                  interaction.reply({ content: `Başarıyla ${member} kullanıcısının başvurusunu onayladınız. `, ephemeral: true });
                  await member.send({ content: `${interaction.guild.name} Sunucusunda başvurunuz onaylandı!` });
                  member.roles.add(ertum.StartAuthority);
                }
      
                if (interaction.customId === "reddet") {
                  const dEmbed = createEmbed("Yetkili Başvurusu [REDDEDİLDİ]", "#2b2d31", description);
                  await msg.edit({ embeds: [dEmbed], components: [row2] });
                  interaction.reply({ content: `Başarıyla ${member} kullanıcısının başvurusunu reddetiniz. `, ephemeral: true });
                  await member.send({ content: `${interaction.guild.name} Sunucusunda başvurunuz reddedildi!` });
                }
              });
            });
          };
      
          const initialEmbed = createEmbed("Yetkili Başvuru [BEKLEMEDE]", "#2b2d31", `
      **Kullanıcı:** ${interaction.user.displayName}(\`${interaction.user.id}\`)
      
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
      `);
          sendEmbed(initialEmbed, [row]);
        }
      });   
}

function createIstekOneriSikayet(client) {
    client.on(Events.InteractionCreate, async interaction => {
        if (interaction.customId == "iös") {
            const modal = new ModalBuilder()
                .setCustomId("ibasvuru")
                .setTitle("İstek Öneri Şikayet Talebi");

            const questions = [
                { id: "s1", label: "İşlem Türünüzü Yazınız", placeholder: "Örnek: İstek/Öneri/Şikayet", style: TextInputStyle.Short },
                { id: "s2", label: "Sorunuzu bildiriniz", placeholder: "Örnek: Sunucuya Güzel Sistemler eklensin.", style: TextInputStyle.Paragraph }
            ];

            const modalComponents = questions.map(q => new TextInputBuilder()
                .setCustomId(q.id)
                .setLabel(q.label)
                .setPlaceholder(q.placeholder)
                .setStyle(q.style));

            modal.addComponents(...modalComponents);
            await interaction.showModal(modal);
        }
    });

    client.on(Events.InteractionCreate, async (interaction) => {
        if (interaction.customId === 'ibasvuru') {
          await interaction.reply({ content: `Başvurunuz Başarıyla Alındı!`, ephemeral: true });
      
          const iBasvuruLog = client.guilds.cache.get(ertucuk.ServerID).channels.cache.find((channel) => channel.id === ertum.IstekOneriSikayetLogChannel);
          const s1 = interaction.fields.getTextInputValue('s1');
          const s2 = interaction.fields.getTextInputValue('s2');
      
          const ertu = new EmbedBuilder()
        .setColor("#2b2d31")
        .setDescription(`
      **Kullanıcı:** ${interaction.user.displayName}(\`${interaction.user.id}\`)
      
      **・Soru 1:** İşlem Türünüzü Yazınız?
      \`\`\`
      ${s1}
      \`\`\`
      **・Soru 2:** Sorunuzu bildiriniz.
      \`\`\`
      ${s2}
      \`\`\`
      `);
          iBasvuruLog.send({ embeds: [ertu] });
        }
      });
      

}