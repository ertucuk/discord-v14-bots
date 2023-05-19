const { ApplicationCommandOptionType,StringSelectMenuBuilder,ActionRowBuilder,ButtonBuilder,EmbedBuilder,ButtonStyle,PermissionsBitField, Events } = require("discord.js");
const coin = require("../../schemas/coin");
const toplams = require("../../schemas/toplams");
const kayitg = require("../../schemas/kayitgorev");
const isimler = require("../../schemas/names");
const regstats = require("../../schemas/registerStats");
const otokayit = require("../../schemas/otokayit");
const ertum = require("../../Settings/Setup.json");
const ertucuk = require("../../Settings/System");

module.exports = {
    name: "kayıt",
    description: "kayıt eder",
    category: "NONE",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["kayit", "kayıt", "kadın", "Kadın", "k", "kadin", "Kadin", "Woman", "kız", "Kız", "erkek", "Erkek", "e", "ERKEK", "Man", "man"],
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

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    const data = await isimler.findOne({ guildID: message.guild.id, userID: member.user.id });

    if (!ertum.ConfirmerRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
       
        message.reply({ content: `Yeterli yetkin yok!` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
        return
    }
      if (!member) {
        message.reply({ content: `Bir kullanıcı etiketlemelisin ya da ID'sini girmelisin.\nÖrn: .k @Ertu Ertu 17` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
        return
      }
      if (ertum.ManRoles.some(x => member.roles.cache.has(x)) && !ertum.GirlRoles.some(x => member.roles.cache.has(x))) {
        message.channel.send({ content: "Bu üye zaten kayıtlı durumda yanlış kayıt ettiyseniz eğer kayıtsız atarak tekrar kayıt edebilirsiniz." }).then((e) => setTimeout(() => { e.delete(); }, 5000));
        return
      }
      if (message.author.id === member.id) {
        message.reply({ content: `Kendini kaydedemezsin!` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
        return
      }
      if (!member.manageable) {
     
        message.reply({ content: `Böyle birisini kayıt edemiyorum!` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
        return
      }
      if (message.member.roles.highest.position <= member.roles.highest.position) {
     
        message.reply({ content: `Belirttiğin kişinin yetkisi senden yüksek!` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
        return
      }

        args = args.filter(a => a !== "" && a !== " ").splice(1);
        let setName;
        let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase() + arg.slice(1)).join(" ");
        let yaş = args.filter(arg => !isNaN(arg))[0] || "";
        if (!isim && !yaş) {
       
          message.reply({ content: `\`${prefix}kayıt <@Ertu/ID> <Isim> <Yas>\`` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
          return
        }
    
        const tagModedata = await regstats.findOne({ guildID: message.guild.id })
        if (tagModedata && tagModedata.tagMode === true) {
          if (!member.user.username.includes(ertum.ServerTag) && !member.roles.cache.has(ertum.VipRole) && !member.roles.cache.has(ertum.BoosterRole)) return message.reply({ embeds: [new EmbedBuilder().setDescription(`${member.toString()} isimli üyenin kullanıcı adında tagımız (\` ${ertum.ServerTag} \`) olmadığı, <@&${ertum.BoosterRole}>, <@&${ertum.VipRole}> Rolü olmadığı için isim değiştirmekden başka kayıt işlemi yapamazsınız.`)] });
        }
    
        if (!yaş) {
          setName = `${ertum.ServerUntagged} ${isim}`;
        } else {
          setName = `${ertum.ServerUntagged} ${isim} | ${yaş} `;
        }
    
        member.setNickname(`${setName}`).catch(err => message.reply({ content: `İsim çok uzun.` }))

      const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("MEMBER_NAMES")
      .setPlaceholder(`Üyenin geçmiş isimlerine bakmak için tıklayınız.`)
      .setMaxValues(1)
      .setMinValues(1)
      
      if(data && data.names) {
          data.names.slice(0, 5).map((x,i) => {
              selectMenu.addOptions([
                  {
                      label: `${x.name}`,
                      value: `${i}`
                  }
              ])
          })
      } else {
          selectMenu.setPlaceholder(`Geçerli isim bulunamadı.`)
          .setDisabled(true)
          .addOptions([
              {
                  label: "Geçerli isim bulunamadı.",
                  value: `noname`
              }
          ])
      }

      const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setCustomId("MAN")
        .setLabel("Erkek")
        .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
        .setCustomId("WOMAN")
        .setLabel("Kadın")
        .setStyle(ButtonStyle.Danger)
    )

    const row2 = new ActionRowBuilder()
    .addComponents(selectMenu)

    const disRow = new ActionRowBuilder()
    .addComponents(
    new ButtonBuilder()
    .setCustomId("REG_SUCCESS")
    .setLabel("Kayıt Tamamlandı!")
    .setStyle(ButtonStyle.Success)
    .setDisabled(true)
    )

    const ertu = new EmbedBuilder()
    .setDescription(`
    ${member.toString()} üyesinin ismi \`\` ${setName} \`\` olarak değiştirildi. 
    
    Lütfen kullanıcının cinsiyetini belirlemek için aşağıdaki butonlara basınız.
    `)
    const ertuMan = new EmbedBuilder()
    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
    .setDescription(`${member} üyesinin ismi \`\` ${setName} \`\` olarak değiştirildi.\n\n**ERKEK** Olarak Kayıt Edildi.`)

    const ertuWoman = new EmbedBuilder()
    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
    .setDescription(`${member} üyesinin ismi \`\` ${setName} \`\` olarak değiştirildi.\n\n**KADIN** Olarak Kayıt Edildi.`)

    let msg = await message.channel.send({ embeds: [ertu], components: [row2, row] })
    const filter = button => button.member.id === message.author.id;
    const collector = msg.createMessageComponentCollector({ filter: filter, time: 30000 });

    client.on(Events.InteractionCreate, (interaction) => {
        if(interaction.isStringSelectMenu()) {
            if(interaction.member.id !== message.author.id) return interaction.reply({ content: `Bunu yapamazsınız!`, ephemeral: true });
            if(interaction.customId === "MEMBER_NAMES") {
                interaction.deferUpdate();
            }
        }
    })

    collector.on("collect", async (button) => {
        message.channel.send({ embeds: [ertuMan], components: [disRow] });
        if (msg) msg.delete();
        if (button.customId === "MAN") {
        await member.roles.add(ertum.ManRoles)
        await member.roles.remove(ertum.UnRegisteredRoles)
        await coin.findOneAndUpdate({ guildID: member.guild.id, userID: message.author.id }, { $inc: { coin: ertucuk.Moderation.toplamsCoin } }, { upsert: true });
        await toplams.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $push: { toplams: member.user.id } }, { upsert: true });
        await regstats.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { top: 1, topGuild24: 1, topGuild7: 1, top24: 1, top7: 1, top14: 1, erkek: 1, erkek24: 1, erkek7: 1, erkek14: 1, }, }, { upsert: true });
        await isimler.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { names: { name: member.displayName, yetkili: message.author.id, rol: ertum.ManRoles.map(x => `<@&${x}>`).join(" , "), date: Date.now() } } }, { upsert: true });
        if (ertum.ChatChannel && client.channels.cache.has(ertum.ChatChannel)) client.channels.cache.get(ertum.ChatChannel).send({ content: `Aramıza **${member}** yakışıklısı geldi. Onu Merhaba ile karşılayın.`}).then((e) => setTimeout(() => { e.delete(); }, 20000));
        const log = new EmbedBuilder().setDescription(`**${member.user.tag}** kullanıcısı **${message.author.tag}** tarafından **ERKEK** olarak kayıt edildi.`)
        .addFields(
            { name: "Kullanıcı", value: `${member}`, inline: true},
            { name: "Yetkili", value: `${message.author}`, inline: true},
            { name: "Kayıt Tarihi", value: `<t:${Math.floor((Date.now()) / 1000)}:R>`, inline: true},
        )
        .setFooter({ text: 'Üyenin geçmiş isimlerini görüntülemek için .isimler komutunu kullanabilirsiniz.'});
        const channel = client.channels.cache.find(x => x.name === "register_log")
        if (!channel) return;
        channel.send({ embeds : [log]});
    }
    if(button.customId === "WOMAN") {
        message.channel.send({ embeds: [ertuWoman], components: [disRow] })
        if (msg) msg.delete();
        await member.roles.add(ertum.GirlRoles)
        await member.roles.remove(ertum.UnRegisteredRoles)
        await coin.findOneAndUpdate({ guildID: member.guild.id, userID: message.author.id }, { $inc: { coin: ertucuk.Moderation.toplamsCoin } }, { upsert: true });
        await toplams.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $push: { toplams: member.user.id } }, { upsert: true });
        await regstats.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { top: 1, topGuild24: 1, topGuild7: 1, top24: 1, top7: 1, top14: 1, kız: 1, kız24: 1, kız7: 1, kız14: 1, }, }, { upsert: true });
        await isimler.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { names: { name: member.displayName, yetkili: message.author.id, rol: ertum.GirlRoles.map(x => `<@&${x}>`).join(" , "), date: Date.now() } } }, { upsert: true });
        const kayitgData = await kayitg.findOne({ guildID: message.guild.id, userID: message.author.id });
        if (kayitgData) {
        await kayitg.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { kayit: 1 } }, { upsert: true });
        if (msg) msg.delete();
        if (ertum.ChatChannel && client.channels.cache.has(ertum.ChatChannel)) client.channels.cache.get(ertum.ChatChannel).send({ content: `Aramıza **${member}** güzeli geldi. Onu Merhaba ile karşılayın.`}).then((e) => setTimeout(() => { e.delete(); }, 20000));
        const log = new EmbedBuilder().setDescription(`**${member.user.tag}** kullanıcısı **${message.author.tag}** tarafından **KADIN** olarak kayıt edildi.`)
        .addFields(
            { name: "Kullanıcı", value: `${member}`, inline: true},
            { name: "Yetkili", value: `${message.author}`, inline: true},
            { name: "Kayıt Tarihi", value: `<t:${Math.floor((Date.now()) / 1000)}:R>`, inline: true},
        )
        .setFooter({ text: 'Üyenin geçmiş isimlerini görüntülemek için .isimler komutunu kullanabilirsiniz.'});
        const channel2 = client.channels.cache.find(x => x.name === "register_log")
        if (!channel2) return;
        channel2.send({ embeds : [log]});
    }
    }});

     },

    onSlash: async function (client, interaction) { },
  };
