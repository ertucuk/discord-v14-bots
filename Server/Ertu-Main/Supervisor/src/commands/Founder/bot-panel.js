const { Client, ApplicationCommandOptionType, EmbedBuilder, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require("discord.js");
const moment = require("moment");
const children = require("child_process");
const bots = global.allbots = [];
const {green, red} = require("../../../../../../Global/Settings/Emojis.json");

module.exports = {
    name: "botsettings",
    description: "Botların ayarlarını değiştirirsin",
    category: "OWNER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["botsetting","botayar","bot-ayar"],
      usage: ".botayar",
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

    onLoad: function (client) {


      let ertu = require('../../../../../../Global/Settings/System');

      let Moderation = ertu.Mainframe.Moderation
      let Statistics = ertu.Mainframe.Statistics
      let Registery = ertu.Mainframe.Registery
      let GuardOne = ertu.Security.Guard_I
      let GuardTwo = ertu.Security.Guard_II
      let GuardThree = ertu.Security.Guard_III
      let Database = ertu.Security.Database
      let Welcomes = ertu.Welcome.Tokens


      let AllTokens = [Moderation, Statistics,Registery, GuardOne, GuardTwo, GuardThree, ...Database, ...Welcomes ]


      AllTokens.forEach(async (token) => {
        const botClient = new Client({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.MessageContent],
            presence: {
                activities: [{
                    name: "YARRAM",
                    type: "LISTENING"
                }],
                status: "offline",
            },
        });

        botClient.on("ready", async () => {
            bots.push(botClient);
        });

        await botClient.login(token);
    });
     },

    onCommand: async function (client, message, args, ertuembed) {
      
      const ertu = [];
      bots.forEach((bot) => {
        ertu.push({
              value: bot.user.id,
              description: `${bot.user.id}`,
              label: `${bot.user.tag}`,
              emoji: `1122150836802441246`
          })
      });

      const row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId("botsmenu")
            .setPlaceholder("</> | Güncellemek İstediğiniz Botu Seçin!")
            .addOptions(ertu)
    )
    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("allres").setLabel("Tüm Botları Yeniden Başlat").setEmoji("926954863647150140").setStyle(ButtonStyle.Primary),
  );
  const mesaj = await message.channel.send({ embeds: [ertuembed.setDescription(` Aşağıda sıralanmakta olan botların, ismini veya profil fotoğrafını değiştirmek istediğinz botu seçin.`)], components: [row, row2] });
  const filter = e => e.user.id === message.author.id;
  const collector = mesaj.createMessageComponentCollector({ filter, time: 60000, errors: ["time"] });

  collector.on("collect", async (menu) => {
    if (menu.customId === "botsmenu") {
        if (!menu.values) return menu.reply({ content: "Bot veya işlem bulunamadı.", ephemeral: true });

        const botclient = allbots.find((bot) => bot.user.id === menu.values[0]);
        if (!botclient) return menu.reply({ content: "Bot veya işlem bulunamadı.", ephemeral: true });
        const newrow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("botupdateavatar").setLabel("Profil Fotoğrafını Değiştir").setEmoji("926954863647150140").setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId("botupdatename").setLabel("İsmini Değiştir").setEmoji("926955061446320208").setStyle(ButtonStyle.Primary),
        );
        if (mesaj) mesaj.delete().catch(() => { });
        await message.channel.send({ embeds: [ertuembed.setDescription(`${botclient.user} isimli bot üzerinde hangi işlemi yapmak istersin?`)], components: [newrow] }).then(async (msj) => {
            const filter = e => e.user.id === message.member.id;
            const col = msj.createMessageComponentCollector({ filter, time: 60000, errors: ["time"] });

            col.on("collect", async (button) => {
              const botclient = allbots.find((bot) => bot.user.id === menu.values[0]);
              if (!botclient) return menu.reply({ content: "Bot veya işlem bulunamadı.", ephemeral: true });
              if (button.customId === "botupdateavatar") {
                  if (msj) msj.edit({ embeds: [ertuembed.setDescription(`${botclient.user} isimli botun yeni profil resmini yükleyin veya bağlantısını girin. İşleminizi \`60 saniye\` içinde tamamlamazsanız otomatik olarak iptal edilecektir. İşlemi iptal etmek için \`iptal\` yazabilirsin.`)], components: [] });
                  const avatarfilter = e => e.author.id === message.member.id;
                  const coll = msj.channel.createMessageCollector({ filter: avatarfilter, time: 60000, max: 1, errors: ["time"] });
              
                  coll.on("collect", async (msg) => {
                    if (["iptal", "i"].some((cevap) => msg.content === cevap)) {
                        if (msj) msj.delete().catch(() => { });
                        await button.reply({ content: "Profil değiştirme işlemi iptal edildi.", ephemeral: true });
                        return;
                    }
                    const bekle = await message.channel.send({ content: "Profil resmi değiştirme işlemi başladı. Bu işlem uzun sürebilir, lütfen sabırla bekleyin." });
                    const avatar = msg.content || msg.attachments.first().url;
                    if (!avatar) {
                      message.react(red);
                      if (msj) msj.delete().catch(() => { });
                        button.reply({ content: "Profil resmi belirtmediğiniz için işlem iptal edildi.", ephemeral: true });
                        return;
                    }
                    botclient.user.setAvatar(avatar).then(() => {
                      if (bekle) bekle.delete().catch(() => { });
                      if (msj) msj.delete().catch(() => { });
                      message.react(green)
                      message.channel.send({ embeds: [ertuembed.setDescription(` ${botclient.user} isimli botun profil resmi başarıyla güncellendi.`).setThumbnail(botclient.user.avatarURL())] }).then((s) => setTimeout(() => { if (s) s.delete(); }, 20000));
                      client.channels.cache.find(x => x.name == "bot_log").send({ embeds: [ertuembed.setDescription(`${botclient.user} isimli botun resmi ${message.member.toString()} tarafından <t:${Math.floor(Date.now() / 1000)}> tarihinde değiştirildi.`)] });
                    }).catch(() => {
                      if (bekle) bekle.delete().catch(() => { });
                      if (msj) msj.delete().catch(() => { });
                  });
              });
              coll.on("end", () => {
                if (msj) msj.delete().catch(() => { });
            });
          } else if (button.customId === "botupdatename") {
            if (msj) msj.edit({ embeds: [ertuembed.setDescription(`${botclient.user} isimli botun yeni ismini girin. İşleminizi \`60 saniye\` içinde tamamlamazsanız otomatik olarak iptal edilecektir. İşlemi iptal etmek için \`iptal\` yazabilirsin.`)], components: [] });
            const isimfilter = e => e.author.id === message.member.id;
            const coll = msj.channel.createMessageCollector({ filter: isimfilter, time: 60000, max: 1, errors: ["time"] });

            coll.on("collect", async (msg) => {
                if (["iptal", "i"].some((cevap) => msg.content === cevap)) {
                    if (msg) msg.delete().catch(() => { });
                    message.react(red);
                    await button.reply({ content: "Profil değiştirme işlemi iptal edildi.", ephemeral: true });
                    return;
                }
                const eskinick = botclient.user.username;
                const bekle = await message.channel.send({ content: "İsim değiştirme işlemi başladı. Bu işlem uzun sürebilir, lütfen sabırla bekleyin." });
                const isim = msg.content;
                if (!isim) {
                    message.react(red);
                    if (msj) msj.delete().catch(() => { });
                    button.reply({ content: "İsim belirtmediğiniz için işlem iptal edildi.", ephemeral: true });
                    return;
                }
                botclient.user.setUsername(isim).then(() => {
                    if (bekle) bekle.delete().catch(() => { });
                    if (msj) msj.delete().catch(() => { });
                    message.react(green)
                    message.channel.send({ embeds: [ertuembed.setDescription(` ${botclient.user} isimli botun ismi başarıyla güncellendi.`).addField("İsim", `\`${eskinick}\` --> \`${botclient.user.username}\``)] }).then((s) => setTimeout(() => { if (s) s.delete(); }, 20000));
                    client.channels.cache.find(x => x.name == "bot_log").send({ embeds: [ertuembed.setDescription(`${botclient.user} isimli botun ismi ${message.member.toString()} tarafından <t:${Math.floor(Date.now() / 1000)}> tarihinde değiştirildi.`)] });
                }).catch(() => {
                    if (bekle) bekle.delete().catch(() => { });
                    if (msj) msj.delete().catch(() => { });
                });
            });
    
            coll.on("end", () => {
              if (msj) msj.delete().catch(() => { });
          });
      }
  });
});
} 
if (menu.customId == "allres") {
menu.deferUpdate(true);
if (mesaj) mesaj.delete().catch(() => { });
children.exec(`pm2 restart all`);
}
});

collector.on("end", async () => {
if (mesaj) mesaj.delete().catch(() => { });
});



     },

    onSlash: async function (client, interaction) { },
  };