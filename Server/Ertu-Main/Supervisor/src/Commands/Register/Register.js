const { ApplicationCommandOptionType, StringSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, PermissionsBitField, Events } = require("discord.js");
const toplams = require("../../../../../../Global/Schemas/toplams");
const isimler = require("../../../../../../Global/Schemas/names");
const regstats = require("../../../../../../Global/Schemas/registerStats");
const otokayit = require("../../../../../../Global/Schemas/otokayit");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const ertucuk = require("../../../../../../Global/Settings/System");
const { green, erkek, kadin } = require("../../../../../../Global/Settings/Emojis.json");
const kanal = require("../../../../../../Global/Settings/AyarName");
const cezapuan = require("../../../../../../Global/Schemas/cezapuan");
const ceza = require("../../../../../../Global/Schemas/ceza");
const userTask = require("../../../../../../Global/Schemas/userTask");
const tasks = require("../../../../../../Global/Schemas/tasks");

module.exports = {
  name: "kayıt",
  description: "Belirttiğiniz üyeyi kayıt eder",
  category: "REGISTER",
  cooldown: 0,
  command: {
    enabled: true,
    aliases: ["kayit", "kayıt", "kadın", "Kadın", "k", "kadin", "Kadin", "Woman", "kız", "Kız", "erkek", "Erkek", "e", "ERKEK", "Man", "man"],
    usage: ".kayıt <@user/ID> <Isim> <Yaş>",
  },


  onLoad: function (client) {
  },

  onCommand: async function (client, message, args) {


    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    const data = await isimler.findOne({ guildID: message.guild.id, userID: member.user.id });

    if (!ertum.ConfirmerRoles.some(ertucum => message.member.roles.cache.has(ertucum)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return messageReactAndReply(`${client.emoji("ertu_carpi")}`,`Yeterli yetkin yok!`);
    }
    
    if (!member) {
      return messageReactAndReply(`${client.emoji("ertu_carpi")}`,`Bir kullanıcı etiketlemelisin ya da ID'sini girmelisin.\nÖrn: .k @Ertu Ertu 17`);
    }
    
    if (ertum.ManRoles.some(x => member.roles.cache.has(x)) && !ertum.GirlRoles.some(x => member.roles.cache.has(x))) {
      return messageReactAndReply(`${client.emoji("ertu_carpi")}`,"Bu üye zaten kayıtlı durumda yanlış kayıt ettiyseniz eğer kayıtsız atarak tekrar kayıt edebilirsiniz.");
    }
    
    if (message.author.id === member.id) {
      return messageReactAndReply(`${client.emoji("ertu_carpi")}`,"Kendini kaydedemezsin!");
    }
    
    if (!member.manageable) {
      return messageReactAndReply(`${client.emoji("ertu_carpi")}`,"Böyle birisini kayıt edemiyorum!");
    }
    
    if (message.member.roles.highest.position <= member.roles.highest.position) {
      return messageReactAndReply(`${client.emoji("ertu_carpi")}`,"Belirttiğin kişinin yetkisi senden yüksek!");
    }


    function messageReactAndReply(emoji, content) {
      message.react(emoji);
      message.reply({ content }).then((e) => setTimeout(() => { e.delete(); }, 5000));
    }
    
    const tagModedata = await regstats.findOne({ guildID: message.guild.id })
    if (tagModedata && tagModedata.tagMode === true) {
      if (!member.user.displayName.includes(ertum.ServerTag) && !member.roles.cache.has(ertum.VipRole) && !member.roles.cache.has(ertum.BoosterRole)) return message.reply({ embeds: [new EmbedBuilder().setDescription(`${member.toString()} isimli üyenin kullanıcı adında tagımız (\` ${ertum.ServerTag} \`) olmadığı, <@&${ertum.BoosterRole}>, <@&${ertum.VipRole}> Rolü olmadığı için isim değiştirmekden başka kayıt işlemi yapamazsınız.`)] });
    }

    const cezasayi = await ceza.findOne({ guildID: message.guild.id, userID: member.user.id })
      if (cezasayi?.top >= 5 && !message.member.roles.cache.some(role => role.id === ertum.ConfirmerRoles && role.rawPosition <= message.guild.roles.cache.get(ertum.ConfirmerRoles).rawPosition)) {
          const embed = new EmbedBuilder()
          .setAuthor({name: message.author.username,iconURL: message.author.avatarURL({dynamic: true})})
          .setColor("Random").setDescription(`
          ${client.emoji("ertu_carpi")}  ${member.toString()} adlı kişinin kayıt işlemi, daha önce toplam **${cezasayi.top}** kez ceza-i işlem uygulandığı için iptal edildi. Sunucumuz, tüm faaliyetleri kayıt altına almaktadır. Sunucunun huzurunu bozan ve kurallara uymayan kullanıcılar, kayıt olamazlar.
  
          Eğer bu konu hakkında şikayetiniz varsa, ${ertum.ConfirmerRoles.map(x => `<@&${x}>`)}  rolüne veya üstlerine başvurabilirsiniz. İyi bir çözüm bulabilmek için işbirliği yapmaktan mutluluk duyarız.
  `);
          return message.reply({ embeds: [embed], content: `Kayıt duraklatıldı.` });
        }

        args = args.filter(a => a !== "" && a !== " ").splice(1);
        let setName;
        let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase() + arg.slice(1)).join(" ");
        let yaş = args.filter(arg => !isNaN(arg))[0] || "";
        if (!isim && !yaş) {
    
          message.reply({ content: `\`.kayıt <@User/ID> <Isim> <Yas>\`` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
          return
        }
    
    setName = yaş ? `${isim} | ${yaş}` : `${isim}`
    member.setNickname(`${ertum.ServerUntagged} ${setName}`).catch(err => message.reply({ content: `İsim çok uzun.` }))


    const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setCustomId("MAN")
        .setLabel("Erkek")
        .setEmoji("1145434181682331718")
        .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
        .setCustomId("WOMAN")
        .setLabel("Kadın")
        .setEmoji("1145434185604014253")
        .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
        .setCustomId("iptal")
        .setLabel("İptal")
        .setEmoji("1099793976644599959")
        .setStyle(ButtonStyle.Danger)
    )
 
    const ertu = new EmbedBuilder()
      .setDescription(`
    ${member.toString()} (\`${setName}\`) isimli üyenin kayıt işlemini tamamlanabilmesi için lütfen aşağıda ki düğmelerden cinsiyeti seçiniz.
    
    Bu kayıt işlemine \`30 Saniye\` içerisinde tepki vermezseniz, işlem otomatik olarak iptal edilir.
    `)
    const ertuMan = new EmbedBuilder()
      .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setDescription(`${client.emoji("ertu_onay")} ${member.toString()} isimli üye **Erkek** olarak kayıt edildi.`)

    const ertuWoman = new EmbedBuilder()
      .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setDescription(`${client.emoji("ertu_onay")} ${member.toString()} isimli üye **Kadın** olarak kayıt edildi.`)

    message.react(`${client.emoji("ertu_onay")}`)
    let msg = await message.channel.send({ embeds: [ertu], components: [row] })
    const filter = button => button.member.id === message.author.id;
    const collector = msg.createMessageComponentCollector({ filter: filter, time: 30000 });

    collector.on("collect", async (button) => {
      if (button.customId === "MAN") {
        msg.edit({ embeds: [ertuMan], components: [] });
        await member.roles.add(ertum.ManRoles)
        await member.roles.remove(ertum.UnRegisteredRoles)
        await toplams.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $push: { toplams: member.user.id } }, { upsert: true });
        await regstats.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { top: 1, erkek: 1 }}, { upsert: true });
        await regstats.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $push: { kayitlar: member.user.id} }, { upsert: true });
        await isimler.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { names: { name: member.displayName, yetkili: message.author.id, rol: ertum.ManRoles.map(x => `<@&${x}>`).join(" , "), date: Date.now(), Gender: "Erkek" } } }, { upsert: true });
        if (ertum.ChatChannel && client.channels.cache.has(ertum.ChatChannel)) client.channels.cache.get(ertum.ChatChannel).send({content: `${member} aramıza katıldı! Ona hoşgeldin diyelim :tada:`}).delete(30)
        await otokayit.updateOne({ userID: member.user.id }, { $set: { userID: member.user.id, roleID: ertum.ManRoles, name: isim, age: yaş } }, { upsert: true }).exec();

        // Görev 

        const checkForTask = await userTask.findOne({ userId: message.author.id });

        if (!checkForTask) {
            new userTask({
                userId: message.author.id,
                roleId: message.member.roles.highest.id
            }).save()
        }

        const dataForTask = await userTask.findOne({ userId: message.author.id });

        if (dataForTask) {
            const activeTask = await tasks.findOne({ currentRole: dataForTask.roleId })
            
            if (activeTask) {
                if (!dataForTask.completeds?.register && dataForTask.counts?.register > activeTask.requiredCounts.register) {
                    await userTask.findOneAndUpdate(
                        { userId: message.author.id },
                        { $set: {'counts.register': 0, 'completeds.register': true} },
                        { upsert: true, new: true }
                    )
                } else {
                    await userTask.findOneAndUpdate(
                        { userId: message.author.id },
                        { $inc: { 'counts.register': 1 } },
                        { upsert: true, new: true }
                    )
                }
            }
        }

        // Görev
        const log = new EmbedBuilder().setDescription(`**${member.user.tag}** kullanıcısı **${message.author.tag}** tarafından **ERKEK** olarak kayıt edildi.`)
          .addFields(
            { name: "Kullanıcı", value: `${member}`, inline: true },
            { name: "Yetkili", value: `${message.author}`, inline: true },
            { name: "Kayıt Tarihi", value: `<t:${Math.floor((Date.now()) / 1000)}:R>`, inline: true },
          )
          .setFooter({ text: 'Üyenin geçmiş isimlerini görüntülemek için .isimler komutunu kullanabilirsiniz.' });
        const channel = client.channels.cache.find(x => x.name === "register_log")
        if (!channel) return;
        channel.send({ embeds: [log] });
      }
      if (button.customId === "WOMAN") {
        msg.edit({ embeds: [ertuWoman], components: [] })
        await member.roles.add(ertum.GirlRoles)
        await member.roles.remove(ertum.UnRegisteredRoles)
        await toplams.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $push: { toplams: member.user.id } }, { upsert: true });
        await regstats.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { top: 1, kız: 1, }}, { upsert: true });
        await regstats.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $push: { kayitlar: member.user.id} }, { upsert: true });
        await isimler.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { names: { name: member.displayName, yetkili: message.author.id, rol: ertum.GirlRoles.map(x => `<@&${x}>`).join(" , "), date: Date.now(), Gender: "Kadın" } } }, { upsert: true });
        // Görev 

        const checkForTask = await userTask.findOne({ userId: message.author.id });

        if (!checkForTask) {
            new userTask({
                userId: message.author.id,
                roleId: message.member.roles.highest.id
            }).save()
        }

        const dataForTask = await userTask.findOne({ userId: message.author.id });

        if (dataForTask) {
            const activeTask = await tasks.findOne({ currentRole: dataForTask.roleId })
            
            if (activeTask) {
                if (!dataForTask.completeds?.register && dataForTask.counts?.register > activeTask.requiredCounts.register) {
                    await userTask.findOneAndUpdate(
                        { userId: message.author.id },
                        { $set: {'counts.register': 0, 'completeds.register': true} },
                        { upsert: true, new: true }
                    )
                } else {
                    await userTask.findOneAndUpdate(
                        { userId: message.author.id },
                        { $inc: { 'counts.register': 1 } },
                        { upsert: true, new: true }
                    )
                }
            }
        }

        // Görev       
        if (ertum.ChatChannel && client.channels.cache.has(ertum.ChatChannel)) client.channels.cache.get(ertum.ChatChannel).send({content: `${member} aramıza katıldı! Kendisine Hoşgeldin diyelim :tada:`}).delete(30)
          await otokayit.updateOne({
            userID: member.user.id
          }, {
            $set: {
              userID: member.user.id,
              roleID: ertum.GirlRoles,
              name: isim,
              age: yaş
            }
          }, {
            upsert: true
          }).exec();

          const log = new EmbedBuilder().setDescription(`**${member.user.tag}** kullanıcısı **${message.author.tag}** tarafından **KADIN** olarak kayıt edildi.`)
            .addFields(
              { name: "Kullanıcı", value: `${member}`, inline: true },
              { name: "Yetkili", value: `${message.author}`, inline: true },
              { name: "Kayıt Tarihi", value: `<t:${Math.floor((Date.now()) / 1000)}:R>`, inline: true },
            )
            .setFooter({ text: 'Üyenin geçmiş isimlerini görüntülemek için .isimler komutunu kullanabilirsiniz.' });
          const channel2 = client.channels.cache.find(x => x.name === "register_log")
          if (!channel2) return;
          channel2.send({ embeds: [log] });
        
      }
      if (button.customId === "iptal") {
        if(msg) msg.delete();
        button.reply({ content:`İşlem Başarıyla İptal Edildi`, embeds: [], components: [], ephemeral: true});
        member.setNickname(`${ertum.ServerUntagged} İsim | Yaş`)
        await member.roles.add(ertum.UnRegisteredRoles)
        await member.roles.remove(ertum.GirlRoles)
        await member.roles.remove(ertum.ManRoles)
      }
    });
  },
};

