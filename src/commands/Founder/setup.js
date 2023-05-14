const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ChannelType, ButtonStyle,PermissionFlagsBits } = require("discord.js");
const settings = require("../../Settings/Setup.json");
const system = require("../../Settings/System");
const { Database } = require("ark.db");
const ertu = new Database("/src/Settings/Setup.json");
const db = new Database("/src/Settings/Emojis.json");
const canvafy = require ("canvafy")

module.exports = {
  name: "setup",
  description: "setupu kur",
  category: "OWNER",
  cooldown: 0,
  command: {
    enabled: true,
    aliases: ["kur"],
    usage: "",
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

    let choose = args[0]

    if(!choose) wait = await message.reply({ content: `Lütfen Bekleyiniz..` })

  
    const canvasPanel = await new canvafy.Rank()
    .setAvatar(message.guild.iconURL({ forceStatic: true, extension: "png" }))
    .setBackground("image", `${message.guild.bannerURL({extension:"png",size:2048}) !== null ? message.guild.bannerURL({extension:"png",size:2048}) : system.BackGround}`)
    .setUsername(message.guild.name)
    .setCustomStatus("#f0f0f0")
    .setLevel(message.guild.memberCount,"Üye Sayısı;")
    .setRank(message.guild.premiumSubscriptionCount,"Boost Adeti;")
    .setCurrentXp(message.guild.premiumSubscriptionCount >= 14 ? 14 : message.guild.premiumSubscriptionCount)
    .setBarColor("#00ff00")
    .setForegroundColor("#000000")
    .setForegroundOpacity(0.8)
    .setRequiredXp(14)
    .build();


    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("ErtuRegister").setLabel("Kayıt Kurulum").setStyle(ButtonStyle.Secondary).setEmoji(`1107229703049330748`),
      new ButtonBuilder().setCustomId("ErtuModeration").setLabel("Moderasyon Kurulum").setStyle(ButtonStyle.Primary).setEmoji(`⚒️`),
      new ButtonBuilder().setCustomId("ErtuLog").setLabel("Log Kurulum").setStyle(ButtonStyle.Success).setEmoji(`📑`),
      new ButtonBuilder().setCustomId("ErtuEmoji").setLabel("Emoji Kurulum").setStyle(ButtonStyle.Primary).setEmoji(`☺️`),
      new ButtonBuilder().setCustomId("ErtuRestart").setLabel("Yeniden Başlat").setStyle(ButtonStyle.Danger).setEmoji(`1107229410609860658`)
    );
    
    if(!choose) {
    const embed = new EmbedBuilder().setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))
    .setImage("attachment://ertu-server-setup.png").setColor("Random")
    .setDescription(`${message.author.toString()}, **${message.guild.name}** sunucususu içerisinde <t:${Math.floor(Date.now() / 1000)}:R>'den itibaren sunucu kurulum komutları hakkında bilgilendirme almak için aşağıdaki butonları kullanabilirsiniz.`)
    .setFooter({
    text: `Not: Kurulumu yaptıktan sonra botu yeniden başlatmayı unutmayınız.`,
    })
  
    let msg = await wait.edit({content: `` , embeds: [embed], components: [row], files: [{ attachment: canvasPanel.toBuffer(), name: "ertu-server-setup.png" }] })
    var filter = (button) => button.user.id === message.author.id;
    let collector = await msg.createMessageComponentCollector({ filter, time: 60000 })
  
    collector.on("collect", async (button) => {
    
    if (button.customId === "ErtuRegister") {
    const embed = new EmbedBuilder()
    .setDescription(`
    \`\`\`fix\nSUNUCU\`\`\`
    (\`ID 1\`) Tag: (\`${settings.ServerTag.length > 0 ? `${settings.ServerTag.map(x => `${x}`).join(",")}` : "\`YOK\`"} \`) / (\` ${settings.ServerUntagged ? settings.ServerUntagged : "YOK"} \`) 
    (\`ID 2\`) Link: (${settings.ServerVanityURL ? settings.ServerVanityURL : "\`YOK\`"})
    
    \`\`\`fix\nROLLER\`\`\`
    (\`ID 3\`) Man Roles: (${settings.ManRoles.length > 0 ? `${settings.ManRoles.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
    (\`ID 4\`) Woman Roles: (${settings.GirlRoles.length > 0 ? `${settings.GirlRoles.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
    (\`ID 5\`) Unregister Role: (${settings.UnRegisteredRoles.length > 0 ? `${settings.UnRegisteredRoles.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
    (\`ID 6\`) Family Role: (${settings.TaggedRole ? `<@&${settings.TaggedRole}>` : "\`YOK\`"})
    (\`ID 7\`) Booster Role: (${settings.BoosterRole ? `<@&${settings.BoosterRole}>` : "\`YOK\`"})
    (\`ID 8\`) Teyitci Roles: (${settings.ConfirmerRoles.length > 0 ? `${settings.ConfirmerRoles.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
    
    \`\`\`fix\nKANALLAR\`\`\`
    (\`ID 9\`) Kurallar: (${settings.RulesChannel.length ? `<#${settings.RulesChannel}>` : "\`YOK\`"})
    (\`ID 10\`) Chat Channel: (${settings.ChatChannel.length ? `<#${settings.ChatChannel}>` : "\`YOK\`"})
    (\`ID 11\`) Welcome Channel: (${settings.WelcomeChannel.length ? `<#${settings.WelcomeChannel}>` : "\`YOK\`"})
    (\`ID 12\`) İnvite Channel: (${settings.InviteChannel.length ? `<#${settings.InviteChannel}>` : "\`YOK\`"})
    `)
    .setFooter({
    text: message.author.tag,
    iconURL: message.author.displayAvatarURL({ dynamic: true })
    })
          await button.reply({ embeds: [embed], components: [], ephemeral: true }).catch({});
        }
        if (button.customId === "ErtuModeration") {
          const embed = new EmbedBuilder()
          .setDescription(`
          \`\`\`fix\nROLLER\`\`\`
          (\`ID 13\`) Staff Roles: (${settings.StaffManagmentRoles.length > 0 ? `${settings.StaffManagmentRoles.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
          (\`ID 14\`) Yetkili Roles: (${settings.Authorities.length > 0 ? `${settings.Authorities.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
          (\`ID 15\`) Sahip Roles: (${settings.OwnerRoles.length > 0 ? `${settings.OwnerRoles.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
          (\`ID 16\`) Rol Verici Roles: (${settings.RolePanelRoles.length > 0 ? `${settings.RolePanelRoles.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
          (\`ID 17\`) Canlı Destek Role: (${settings.LiveSupport ? `<@&${settings.LiveSupport}>` : "\`YOK\`"})
          (\`ID 18\`) Yetkili Alım Role: (${settings.YetkiliAlimDM ? `<@&${settings.YetkiliAlimDM}>` : "\`YOK\`"})
          (\`ID 19\`) Vip Role: (${settings.VipRole ? `<@&${settings.VipRole}>` : "\`YOK\`"})
          (\`ID 20\`) Müzisyen Rol: (${settings.MusicianRole ? `<@&${settings.MusicianRole}>` : "\`YOK\`"})
          (\`ID 21\`) Tasarımcı Rol: (${settings.DesignerRole ? `<@&${settings.DesignerRole}>` : "\`YOK\`"})
          (\`ID 22\`) Streamer Role: (${settings.StreamerRole ? `<@&${settings.StreamerRole}>` : "\`YOK\`"})
          (\`ID 23\`) Terapist Rol: (${settings.TherapistRole ? `<@&${settings.TherapistRole}>` : "\`YOK\`"})
          (\`ID 24\`) Sorun Çözme Rol: (${settings.ProblemSolversRoles ? `<@&${settings.ProblemSolversRoles}>` : "\`YOK\`"})
          (\`ID 25\`) Jail Role: (${settings.JailedRoles.length > 0 ? `${settings.JailedRoles.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
          (\`ID 26\`) Chat Mute Role: (${settings.MutedRole.length > 0 ? `${settings.MutedRole.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
          (\`ID 27\`) Voice Mute Role: (${settings.VMutedRole.length > 0 ? `${settings.VMutedRole.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"}))
          (\`ID 28\`) Fake Account Role: (${settings.SuspectedRoles.length > 0 ? `${settings.SuspectedRoles.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
          (\`ID 29\`) Warn Hammer Role: (${settings.WarnHammer.length > 0 ? `${settings.WarnHammer.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
          (\`ID 30\`) Ban Hammer Role: (${settings.BanHammer.length > 0 ? `${settings.BanHammer.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
          (\`ID 31\`) Jail Hammer Role: (${settings.JailHammer.length > 0 ? `${settings.JailHammer.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
          (\`ID 32\`) CMute Hammer Role: (${settings.CMuteHammer.length > 0 ? `${settings.CMuteHammer.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
          (\`ID 33\`) VMute Hammer Role: (${settings.VMuteHammer.length > 0 ? `${settings.VMuteHammer.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
          
         \`\`\`fix\nKATEGORİLER \`\`\`
         (\`ID 34\`) Register Parents: (** ${settings.RegisterRoomCategory.length ? `${settings.RegisterRoomCategory.map(x => `<#${x}>`).join(",")}` : "\`YOK\`"} **)
         (\`ID 35\`) Public Parents: (** ${settings.PublicRoomsCategory.length ? `<#${settings.PublicRoomsCategory}>` : "\`YOK\`"} **)
         (\`ID 36\`) Fun Parents: (** ${settings.ActivityCategorys.length > 0 ? `${settings.ActivityCategorys.map(x => `<#${x}>`).join(",")}` : "\`YOK\`"} **)
         (\`ID 37\`) Solving Parents: (** ${settings.TroubleshootingCategory.length > 0 ? `${settings.TroubleshootingCategory.map(x => `<#${x}>`).join(",")}` : "\`YOK\`"} **)
         (\`ID 38\`) Private Parents: (** ${settings.PrivateRoomsCategory.length ? `${settings.PrivateRoomsCategory.map(x => `<#${x}>`).join(",")}` : "\`YOK\`"} **)
         (\`ID 39\`) Alone Parents: (** ${settings.SecretRoomsCategory.length ? `${settings.SecretRoomsCategory.map(x => `<#${x}>`).join(",")}` : "\`YOK\`"} **)
          `)
          .setFooter({
          text: message.author.tag,
          iconURL: message.author.displayAvatarURL({ dynamic: true })
          })
                await button.reply({ embeds: [embed], components: [], ephemeral: true }).catch({});
              }
              if (button.customId === "ErtuLog") {
                await button.deferUpdate();

                const parent = await button.guild.channels.create({
                  name: "SUNUCU LOGLAR",
                  type: ChannelType.GuildCategory,
                  permissionOverwrites: [{
                    id: button.guild.id,
                    deny: [PermissionFlagsBits.ViewChannel],
                  }]
                });
      
                await button.guild.channels.create({
                  name: 'message_log',
                  type: ChannelType.GuildText,
                  parent: parent.id
                });
                await button.guild.channels.create({
                  name: 'voice_log',
                  type: ChannelType.GuildText,
                  parent: parent.id
                });
                await button.guild.channels.create({
                  name: 'taglı_log',
                  type: ChannelType.GuildText,
                  parent: parent.id
                });
                await button.guild.channels.create({
                  name: 'rol_log',
                  type: ChannelType.GuildText,
                  parent: parent.id
                });
                await button.guild.channels.create({
                  name: 'yetki_log', 
                  type: ChannelType.GuildText,
                  parent: parent.id
                });
                await button.guild.channels.create({
                  name: 'komut_log', 
                  type: ChannelType.GuildText,
                  parent: parent.id
                });
                await button.guild.channels.create({
                  name: 'register_log', 
                  type: ChannelType.GuildText,
                  parent: parent.id
                });
                await button.guild.channels.create({
                  name: 'mute_log', 
                  type: ChannelType.GuildText,
                  parent: parent.id
                });
                await button.guild.channels.create({
                  name: 'vmute_log', 
                  type: ChannelType.GuildText,
                  parent: parent.id
                });
                await button.guild.channels.create({
                  name: 'jail_log', 
                  type: ChannelType.GuildText,
                  parent: parent.id
                });
                await button.guild.channels.create({
                  name: 'ban_log', 
                  type: ChannelType.GuildText,
                  parent: parent.id
                });
                await button.guild.channels.create({
                  name: 'warn_log', 
                  type: ChannelType.GuildText,
                  parent: parent.id
                });
                await button.guild.channels.create({
                  name: 'cezapuan_log', 
                  type: ChannelType.GuildText,
                  parent: parent.id
                });
                button.followUp({ content: `Log Kanallarının kurulumu başarıyla tamamlanmıştır.`})       
              }
              if (button.customId === "ErtuEmoji") {
                await button.deferUpdate();

                const emojis = [
                  { name: "star", url: "https://cdn.discordapp.com/emojis/899680497427431424.gif?size=44" },
                  { name: "rewards", url: "https://cdn.discordapp.com/emojis/899680521951514734.gif?size=44" },
                  { name: "miniicon", url: "https://cdn.discordapp.com/emojis/899339236724068372.png?size=44" },
                  { name: "red", url: "https://cdn.discordapp.com/emojis/1050746891027103835.webp?size=80&quality=lossless" },
                  { name: "green", url: "https://cdn.discordapp.com/emojis/1050746904264331304.webp?size=80&quality=lossless" },
                  { name: "staff", url: "https://cdn.discordapp.com/emojis/899680505119780895.gif?size=44" },
                  { name: "Muhabbet", url: "https://cdn.discordapp.com/emojis/899339317896429641.gif?size=44" },
                  { name: "galp", url: "https://cdn.discordapp.com/emojis/899680513806184570.gif?size=44" },
                  { name: "kirmiziok", url: "https://cdn.discordapp.com/emojis/901441275381817426.gif?size=44" },
                  { name: "Revuu", url: "https://cdn.discordapp.com/emojis/901441322152493066.gif?size=44" },
                  { name: "Mute", url: "https://cdn.discordapp.com/emojis/901441287469809706.png?size=44" },
                  { name: "Cezaa", url: "https://cdn.discordapp.com/emojis/901441311050178591.png?size=44" },
                  { name: "Jail", url: "https://cdn.discordapp.com/emojis/903566151727087686.png?size=96" },
                  { name: "Book", url: "https://cdn.discordapp.com/emojis/903564842978402304.png?size=96" },
                  { name: "Kilit", url: "https://cdn.discordapp.com/emojis/903564832387760128.png?size=96" },
                  { name: "Mute2", url: "https://cdn.discordapp.com/emojis/899339342986739802.png?size=96" },
                  { name: "Unmute", url: "https://cdn.discordapp.com/emojis/899339351283105812.png?size=96" },
                  { name: "fill", url: "https://cdn.discordapp.com/emojis/899339288636956752.gif?size=44" },
                  { name: "empty", url: "https://cdn.discordapp.com/emojis/899340041229307966.png?size=44" },
                  { name: "fillStart", url: "https://cdn.discordapp.com/emojis/899339278000222249.gif?size=44" },
                  { name: "emptyEnd", url: "https://cdn.discordapp.com/emojis/899340050226118737.png?size=44" },
                  { name: "fillEnd", url: "https://cdn.discordapp.com/emojis/862062197776580618.gif?size=96" },
                  { name: "xp", url: "https://cdn.discordapp.com/emojis/838468875825446922.gif?v=1" },
                  { name: "gulucuk", url: "https://cdn.discordapp.com/emojis/838469248602865735.png?v=1" },
                  { name: "mesaj2", url: "https://cdn.discordapp.com/emojis/838468915814334464.gif?v=1" },
                  { name: "altin", url: "https://cdn.discordapp.com/emojis/836694825243508756.gif?v=1" },
                  { name: "altin2", url: "https://cdn.discordapp.com/emojis/836694821128372224.gif?v=1" },
                  { name: "voice", url: "https://cdn.discordapp.com/emojis/841076020399308831.png?v=1" },
                  { name: "channel", url: "https://cdn.discordapp.com/emojis/841076020399308831.png?v=1" },
                  { name: "ertuspotify", url: "https://cdn.discordapp.com/emojis/899337292840312912.png?size=44" },
                  { name: "ertunetflix", url: "https://cdn.discordapp.com/emojis/941993358518284298.webp?size=96&quality=lossless" },
                  { name: "ertuexxen", url: "https://cdn.discordapp.com/emojis/900396713116835900.png?size=44" },
                  { name: "ertublutv", url: "https://cdn.discordapp.com/emojis/900396707362246666.png?size=44" },
                  { name: "ertunitro", url: "https://cdn.discordapp.com/emojis/1104071976814903358.webp?size=80&quality=lossless" },
                  { name: "ertuyoutube", url: "https://cdn.discordapp.com/emojis/941993963013935115.gif?size=96&quality=lossless" },
                  { name: "online", url: "https://cdn.discordapp.com/emojis/901829756603998269.webp?size=96&quality=lossless" },
                  { name: "duyuru", url: "https://cdn.discordapp.com/emojis/935136070377553930.webp?size=96&quality=lossless" },
                  { name: "cizgi", url: "https://cdn.discordapp.com/emojis/916013869816745994.gif?size=96" },
                  { name: "erkek", url: "https://cdn.discordapp.com/emojis/1093482531812278282.webp?size=80&quality=lossless" },
                  { name: "kadin", url: "https://cdn.discordapp.com/emojis/1092843834012074014.webp?size=80&quality=lossless" },
                  { name: "nokta", url: "https://cdn.discordapp.com/emojis/1097940170990428210.webp?size=80&quality=lossless" }
    
              ]
             
              emojis.forEach(async (x) => {
                  if (button.guild.emojis.cache.find((e) => x.name === e.name)) return db.set(x.name, button.guild.emojis.cache.find((e) => x.name === e.name).toString());
                  const emoji = await button.guild.emojis.create({ attachment: x.url, name: x.name});
                  await db.set(x.name, emoji.toString()); 
                  message.channel.send({ content: `\`${x.name}\` isimli emoji oluşturuldu! (${emoji.toString()})`, ephemeral: true })
                })
              }
              if (button.customId === "ErtuRestart") {
                await message.reply({ content: `**Bot** Başarıyla Yeniden Bağlandı!`})
                process.exit(1)
              }
    })
 }
  /////
  const tagsetup = [
    { name: ["1"], conf: "ServerTag", cmdName: "Tag(ları)" },
  ]
  
  const setup1 = [
    { name: ["secondarytag", "secondary-tag", "ikincitag", "ikinciTag"], conf: "ServerUntagged", cmdName: "İkinci Tag" },
    { name: ["2", "url"], conf: "ServerVanityURL", cmdName: "Url" },
  ]
  
  const setup2 = [
    { name: ["13"], conf: "StaffManagmentRoles", cmdName: "Yetkili Rol(leri)" },
    { name: ["3"], conf: "ManRoles", cmdName: "Erkek Rolleri Rol(leri)" },
    { name: ["4"], conf: "GirlRoles", cmdName: "Kız Rolleri Rol(leri)" },
    { name: ["5"], conf: "UnRegisteredRoles", cmdName: "Kayıtsız Rol(leri)" },
    { name: ["14"], conf: "Authorities", cmdName: "Yetki Rol(leri)" },
    { name: ["8"], conf: "ConfirmerRoles", cmdName: "Teyitci Rol(leri)" },
    { name: ["15"], conf: "OwnerRoles", cmdName: "Sahip Rol(leri)" },
    { name: ["29"], conf: "WarnHammer", cmdName: "Warn Hammer" },
    { name: ["30"], conf: "BanHammer", cmdName: "Ban Hammer" },
    { name: ["31"], conf: "JailHammer", cmdName: "Jail Hammer" },
    { name: ["32"], conf: "CMuteHammer", cmdName: "Chat-Mute Hammer" },
    { name: ["33"], conf: "VMuteHammer", cmdName: "Voice-Mute Hammer" },
    { name: ["25"], conf: "JailedRoles", cmdName: "Jail Rol" },
    { name: ["26"], conf: "MutedRole", cmdName: "Chat-Mute Rol" },
    { name: ["27"], conf: "VMutedRole", cmdName: "Voice-Mute Rol" },
    { name: ["28"], conf: "SuspectedRoles", cmdName: "Yeni Hesap Rol" },
    { name: ["16"], conf: "RolePanelRoles", cmdName: "Rol Yönetici Rol" },
  ]
  
  const setup3 = [
    { name: ["6"], conf: "TaggedRole", cmdName: "Taglı Rol(leri)" },
    { name: ["7"], conf: "TaggedRole", cmdName: "Booster Rol" },
    { name: ["19"], conf: "vipRole", cmdName: "VipRole" },
    { name: ["20"], conf: "MusicianRole", cmdName: "Müziysen Rol" },
    { name: ["21"], conf: "DesignerRole", cmdName: "Tasarımcı Rol" },
    { name: ["22"], conf: "StreamerRole", cmdName: "Streamer Rol" },
    { name: ["24"], conf: "ProblemSolversRoles", cmdName: "Sorun Çöüzücü Rol" },
    { name: ["23"], conf: "TherapistRole", cmdName: "Terapist Rol" },
    { name: ["17"], conf: "LiveSupport", cmdName: "Canlı Destek Rol" },
    { name: ["18"], conf: "YetkiliAlimDM", cmdName: "Yetkili Alım Rol" },
  ]
  
  const setup4 = [
    { name: ["10"], conf: "ChatChannel", cmdName: "Chat Kanal" },
    { name: ["11"], conf: "WelcomeChannel", cmdName: "Hoşgeldin Kanal" },
    { name: ["12"], conf: "InviteChannel", cmdName: "İnvite Kanal" },
    { name: ["9"], conf: "RulesChannel", cmdName: "Kurallar Kanal" },
  ]
   
  const setup5 = [
    { name: ["34"], conf: "RegisterRoomCategory", cmdName: "Register Kategori" },
    { name: ["37"], conf: "TroubleshootingCategory", cmdName: "Geçersiz Kategori(leri)" },
    { name: ["38"], conf: "PrivateRoomsCategory", cmdName: "Secret Kategori" },
    { name: ["39"], conf: "SecretRoomsCategory", cmdName: "Alone Kategori" },
    { name: ["36"], conf: "ActivityCategorys", cmdName: "Eğlence Kategori(leri)" },
  ]
  
  const setup6 = [
    { name: ["35"], conf: "PublicRoomsCategory", cmdName: "Public Kategori" },
  ]
    
    tagsetup.forEach(async (x) => {
      if(x.name.some(x => x === choose)) {
      let tag;
      if (args.length >= 1) {
        tag = args
        .filter((x) => !x.includes(choose))
        .map((x) => x);
      }
      let db = ertu.get(`${x.conf}`)
      if(tag) {
      if(db.some(ertum => ertum.includes(tag))) {
      ertu.pull(`${x.conf}`, `${tag.map(x => x)}`)
      message.reply({ content: `${tag.map(x => `${x}`)} ${x.cmdName} listesinden başarıyla kaldırıldı.`, ephemeral: true })
      } else {
      let xd = []
      tag.map(x => 
      xd.push(`${x}`)
      )
      ertu.set(`${x.conf}`, xd)
      message.reply({ content: `${tag.map(x => `${x}`)} ${x.cmdName} listesine başarıyla eklendi.`, ephemeral: true })
      }
      } 
      };
    });
    
    setup1.forEach(async (x) => {
      if(x.name.some(x => x === choose)) {
      let select = args[1];
      if (!select) {
      message.reply({ content: `Sunucu **${x.cmdName}** belirtmelisin`, ephemeral: true });
      return }
      ertu.set(`${x.conf}`, `${select}`)
      message.reply({ content: `**${select}** ${x.cmdName} listesine başarıyla eklendi.`, ephemeral: true })
    };
    });
    
    setup2.forEach(async (x) => {
      if(x.name.some(x => x === choose)) {
      let rol;
      if (message.mentions.roles.size >= 1) {
        rol = message.mentions.roles.map(r => r.id);
      }
      let db = ertu.get(`${x.conf}`)
      if(rol) {
      if(db.some(ertum => ertum.includes(rol.id))) {
      ertu.pull(`${x.conf}`, `${rol.map(x => x)}`)
      message.reply({ content: `${rol.map(x => `<@&${x}>`)} ${x.cmdName} listesinden başarıyla kaldırıldı.`, ephemeral: true })
      } else {
      let xd = []
      rol.map(x => 
      xd.push(`${x}`)
      )
      ertu.set(`${x.conf}`, xd)
      message.reply({ content: `${rol.map(x => `<@&${x}>`)} ${x.cmdName} listesine başarıyla eklendi.`, ephemeral: true })
      }
      } else if (!rol) {
      message.reply({ content: `Sunucu ${x.cmdName} belirtmelisin`, ephemeral: true });
      return }
      };
    });
       
    setup3.forEach(async (x) => {
      if(x.name.some(x => x === choose)) {
      let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]) || message.guild.roles.cache.find(ertum => ertum.name === args.join(" "))
      if (rol) {
      ertu.set(`${x.conf}`, `${rol.id}`)
      message.reply({ content: `${rol} ${x.cmdName} listesine başarıyla eklendi.`, ephemeral: true })
      } else if (!rol) {
      message.reply({ content: `Sunucu ${x.cmdName} belirtmelisin`, ephemeral: true });
      return }
    };
    });
    
    setup4.forEach(async (x) => {
      if(x.name.some(x => x === choose)) {
      let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2]) || message.guild.channels.cache.find(ertum => ertum.name === args.join(" "))
      if (channel) {
      ertu.set(`${x.conf}`, `${channel.id}`)
      message.reply({ content: `<#${channel.id}> ${x.cmdName} listesine başarıyla eklendi.`, ephemeral: true })
      } else if (!channel) {
      message.reply({ content: `Sunucu ${x.cmdName} belirtmelisin`, ephemeral: true });
      return }
      };
    });
    
    setup5.forEach(async (x) => {
      if(x.name.some(x => x === choose)) {
      let kanal;
      if (args.length >= 1) {
        kanal = args
        .filter((id) => message.guild.channels.cache.has(id))
        .map((id) => message.guild.channels.cache.get(id));
      }
      let db = ertu.get(`${x.conf}`)
      if(kanal) {
      if(db.some(ertum => ertum.includes(kanal.id))) {
      ertu.pull(`${x.conf}`, `${kanal.map(x => x)}`)
      message.reply({ content: `**${kanal.map(x => `${x}`)}** ${x.cmdName} listesinden başarıyla kaldırıldı.`, ephemeral: true })
      } else {
      let xd = []
      kanal.map(x => 
      xd.push(`${x.id}`)
      )
      ertu.set(`${x.conf}`, xd)
      message.reply({ content: `**${kanal.map(x => `${x}`)}** ${x.cmdName} listesine başarıyla eklendi.`, ephemeral: true })
      }
      } else if (!kanal) {
      message.reply({ content: `Sunucu **${x.cmdName}** belirtmelisin`, ephemeral: true });
      return }
      };
    });
    
    setup6.forEach(async (x) => {
      if(x.name.some(x => x === choose)) {
      let ertucuk = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
      if (!ertucuk) return message.reply({ content: `Sunucu **${x.cmdName}** belirtmelisin`, ephemeral: true })
      ertu.set(`${x.conf}`, ertucuk.id)
      message.reply({ content: `**${ertucuk}** ${x.cmdName} listesine başarıyla eklendi.`, ephemeral: true });
    };
    });
},
  onSlash: async function (client, interaction) { },
};