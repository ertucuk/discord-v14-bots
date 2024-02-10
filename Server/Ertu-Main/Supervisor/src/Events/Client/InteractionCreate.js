const { timeformat } = require("../../../../../../Global/Helpers/Utils");
const cooldownCache = new Map();
const client = global.client;
const {splitMessage,Events, EmbedBuilder, ActionRowBuilder, RoleSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, } = require("discord.js")
const penals = require("../../../../../../Global/Schemas/penals");
const moment = require('moment');
const TaskRole = require("../../../../../../Global/Schemas/TaskRole");
const System = require("../../../../../../Global/Settings/System");
require("moment-duration-format")
moment.duration("hh:mm:ss").format()
const table = require('table');
const panel = require("../../../../../../Global/Schemas/boosterpanel");
const ms = require('ms');
const userTask = require("../../../../../../Global/Schemas/userTask");
const tasks = require("../../../../../../Global/Schemas/tasks");

// Modallardan gelen veriler sayı mı değil mi die kontrol edicek eleman.
function checkIsValid(value) {
  return !isNaN(value) && !isNaN(parseFloat(value))
}

client.on("interactionCreate", async (interaction) => {
  // * Görev Sistemi 

  if (interaction.customId == 'addNewTask') {
    const row = new ActionRowBuilder().addComponents(
      new RoleSelectMenuBuilder()
        .setCustomId('selectedRoleForNewTasks')
        .setPlaceholder('Roller')
        .setMaxValues(1)
        .setMinValues(1)
    )

    await interaction.reply({
      content: 'Görev sonunda elde edilecek rolü seçin.',
      components: [row],
      ephemeral: true
    })
  }

  if (interaction.customId == 'removeTask') {
    const row = new ActionRowBuilder().addComponents(
      new RoleSelectMenuBuilder()
        .setCustomId('removeTaskMenu')
        .setPlaceholder('Roller')
        .setMaxValues(1)
        .setMinValues(1)
    )

    await interaction.reply({
      content: 'Silmek istediğiniz göreve bağlı olan bir rolü seçin.',
      components: [row],
      ephemeral: true
    });
  }

  if (interaction.customId == 'removeTaskMenu') {
    const data = await tasks.findOne({ currentRole: interaction.values[0] }) || await tasks.findOne({ endOfMissionRole: interaction.values[0] })

    if (!data) {
      return await interaction.reply({
        content: `Seçtiğiniz role (<@&${interaction.values[0]}>) bağlı bir görev bulunamadı, doğru rolü seçtiğinizden emin olun.`,
        ephemeral: true
      })
    }
    
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('listTask')
        .setStyle(ButtonStyle.Secondary)
        .setLabel('Görevleri Listele')
    )
    
    await TaskRole.findByIdAndDelete(data._id);
 
    await interaction.reply({
      content: `Başarıyla <@&${interaction.values[0]}> rolüne ait görev silindi. ${client.emoji("ertu_onay")}`,
      components: [row],
      ephemeral: true
    })

  }

  if (interaction.customId == 'listTask') {

    const msToHours = (ms) => {
      const seconds = ms / 1000;
      const minutes = seconds / 60;
      const hours = minutes / 60;

      return hours;
    }
    try {
    const res = await tasks.find({ guildId: interaction.guild.id }).exec();
      if(!res || res.length === 0) return interaction.reply({content: `${System.Server} sunucusuna ait görev bilgisi veritabanında bulunamadı.`, ephemeral: true})
      const data = [
        ["#", "Rol", "Mesaj", "Ses", "Register", "Invite", "Staff"],
        ...res.map((value, index) => [
          `#${index + 1}`,
          `${interaction.guild.roles.cache.get(value.endOfMissionRole) ? interaction.guild.roles.cache.get(value.endOfMissionRole).name : "Yok!"}`,
          `${value.requiredCounts.message} Mesaj`,
          `${msToHours(value.requiredCounts.voice)} Saat`,
          `${value.requiredCounts.register} Adet`,
          `${value.requiredCounts.invite} Davet`,
          `${value.requiredCounts.staff} Adet`,
        ]),
      ];
      
      const veriler = table.table(data, {
        border: {
          topBody: '─',
          topJoin: '┬',
          topLeft: '┌',
          topRight: '┐',
          bottomBody: '─',
          bottomJoin: '┴',
          bottomLeft: '└',
          bottomRight: '┘',
          bodyLeft: '│',
          bodyRight: '│',
          bodyJoin: '│',
          joinBody: '─',
          joinLeft: '├',
          joinRight: '┤',
          joinJoin: '┼'
        },
        drawHorizontalLine: function (index, size) {
          return index === 0 || index === 1 || index === size;
        },
      });
      
      const array = `\`\`\`${veriler}\`\`\``;
      interaction.reply({ content: `${array}`, ephemeral: true });

    } catch (err) {
      console.error('Error:', err);
      interaction.reply({content: 'Hata:' + err.message, ephemeral: true});
  }
    }

  if (interaction.customId == 'selectedRoleForNewTasks') {
    const check = await tasks.findOne({ endOfMissionRole: interaction.values[0] });

    if (check) {
      return await interaction.reply({
        content: `Seçtiğiniz role (<@&${interaction.values[0]}>) bağlı bir görev zaten bulunmakta, farklı bir rol seçin.`,
        ephemeral: true
      })
    }

    const embed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .addFields({
        name: 'Görev sonunda elde edilecek rol id:',
        value: interaction.values[0]
      })


    const row = new ActionRowBuilder().addComponents(
      new RoleSelectMenuBuilder()
        .setCustomId('selectedRoleForRole')
        .setPlaceholder('Roller')
        .setMaxValues(1)
        .setMinValues(1)
    )

    await interaction.reply({
      content: 'Hangi roldeki kullanıcılar için bu görev geçerli olucak?',
      embeds: [embed],
      components: [row],
      ephemeral: true
    })

  }

  if (interaction.customId == 'selectedRoleForRole') {
    try {
    const check = await tasks.findOne({ currentRole: interaction.values[0] });

    if (check) {
      return await interaction.reply({
        content: `Seçtiğiniz role (<@&${interaction.values[0]}>) bağlı bir görev zaten bulunmakta, farklı bir rol seçin.`,
        ephemeral: true
      })
    }

    const modal = new ModalBuilder()
      .setCustomId('newTaskModal')
      .setTitle('Yeni Görev Ekle')

    const inputs = [
      new TextInputBuilder()
        .setCustomId('roleId')
        .setLabel('Geçerli Rol ID (Otomatik)')
        .setStyle(TextInputStyle.Short)
        .setValue(`${interaction.values[0]}`)
        .setRequired(true),
      new TextInputBuilder()
        .setCustomId('missionEndRoleId')
        .setLabel('Görev Sonu Verilecek Rol ID (Otomatik)')
        .setStyle(TextInputStyle.Short)
        .setValue(`${interaction.message.embeds[0].data.fields[0].value}`)
        .setRequired(true),
      new TextInputBuilder()
        .setCustomId('reqMessage')
        .setLabel('Mesaj Limit')
        .setStyle(TextInputStyle.Short)
        .setRequired(true),
      new TextInputBuilder()
        .setCustomId('reqVoice')
        .setLabel('Ses Süre Limiti (Saat)')
        .setStyle(TextInputStyle.Short)
        .setRequired(true),
      new TextInputBuilder()
        .setCustomId('reqRegister')
        .setLabel('Kayıt Limit')
        .setStyle(TextInputStyle.Short)
        .setRequired(true),
    ]

    const fields = inputs.map(input => new ActionRowBuilder().addComponents(input))

    modal.addComponents(...fields)

    await interaction.showModal(modal)

  } catch (e) { console.log(e)}
  }


  if (interaction.customId == 'newTaskModal') {
    const getInput = (input) => {
      return interaction.fields.getTextInputValue(input)
    }

    if (!checkIsValid(getInput('reqMessage')) || !checkIsValid(getInput('reqVoice')) || !checkIsValid(getInput('reqRegister'))) {
      return await interaction.reply({
        content: 'Tüm girdiler bir sayı olmak zorunda.',
        ephemeral: true
      })
    }

    const embed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setTitle('Yeni Görev Detayları')
      .addFields(
        {
          name: 'Geçerli Olacak Rol',
          value: `<@&${getInput('roleId')}>`
        }, 
        {
          name: 'Görev Sonu Verilecek Rol',
          value: `<@&${getInput('missionEndRoleId')}>`
        }, 
        {
          name: 'Mesaj Limiti',
          value: `${getInput('reqMessage')}`
        },
        {
          name: 'Ses Limiti',
          value: `${getInput('reqVoice')} saat`
        },
        {
          name: 'Kayıt Limiti',
          value: `${getInput('reqRegister')}`
        },
      )

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('secondFormForNewTask')
        .setStyle(ButtonStyle.Success)
        .setLabel('Ayarlamaya Devam Et'),
        new ButtonBuilder()
        .setCustomId('cancelAddNewTask')
        .setStyle(ButtonStyle.Danger)
        .setLabel('İşlemi İptal Et')
    )

    const rowTwo = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('setNewTask')
        .setStyle(ButtonStyle.Primary)
        .setLabel('Yeni Görev Oluştur')
        .setDisabled(true)
    )

    await interaction.reply({
      embeds: [embed],
      components: [row, rowTwo],
      ephemeral: true
    }) 
  }

  if (interaction.customId == 'secondFormForNewTask') {
     const modal = new ModalBuilder()
      .setCustomId('newTaskModalTwo')
      .setTitle('Yeni Görev Ekle')

    const inputs = [
      new TextInputBuilder()
        .setCustomId('reqInvite')
        .setLabel('Davet Limit')
        .setStyle(TextInputStyle.Short)
        .setRequired(true),
      new TextInputBuilder()
        .setCustomId('reqStaff')
        .setLabel('Yetki Aldırma Limit')
        .setStyle(TextInputStyle.Short)
        .setRequired(true),
    ]

    const fields = inputs.map(input => new ActionRowBuilder().addComponents(input))

    modal.addComponents(...fields)

    await interaction.showModal(modal)
  }

  if (interaction.customId == 'cancelAddNewTask') {
    await interaction.update({
      content: 'İşlem başarıyla iptal edildi.',
      embeds: [],
      components: [],
    })
  }

  if (interaction.customId == 'newTaskModalTwo') {
     const getInput = (input) => {
      return interaction.fields.getTextInputValue(input)
    } 

    if (!checkIsValid(getInput('reqInvite')) || !checkIsValid(getInput('reqStaff'))) {
      return await interaction.reply({
        content: 'Tüm girdiler bir sayı olmak zorunda.',
        ephemeral: true
      })
    }

    const embed = EmbedBuilder.from(interaction.message.embeds[0])
    
    embed.addFields(
      {
        name: 'Davet Limiti',
        value: `${getInput('reqInvite')}`
      },
      {
        name: 'Yetki aldırma limiti',
        value: getInput('reqStaff')
      },
    )

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('approveNewTask')
        .setStyle(ButtonStyle.Success)
        .setLabel('Görevi Kaydet'),
        new ButtonBuilder()
        .setCustomId('cancelAddNewTask')
        .setStyle(ButtonStyle.Danger)
        .setLabel('İşlemi İptal Et')
    )

    await interaction.update({
      embeds: [embed],
      components: [row]
    })
  }

  if (interaction.customId == 'approveNewTask') {
    const embed = EmbedBuilder.from(interaction.message.embeds[0])
    const row = ActionRowBuilder.from(interaction.message.components[0])

    row.components.forEach(component => component.setDisabled(true))

    const val = (index) => {
      return embed.data.fields[index].value
    }

    const val3 = val(3).match(/(\d+)\s+saat/);

    const voiceLimit = ms(parseInt(val3[1], 10) + 'h')

    new tasks({
      guildId: interaction.guild.id,
      currentRole: val(0).slice(3, -1),
      endOfMissionRole: val(1).slice(3, -1),
      'requiredCounts.message': val(2),
      'requiredCounts.voice': voiceLimit,
      'requiredCounts.register': val(4),
      'requiredCounts.invite': val(5),
      'requiredCounts.staff': val(6)
    }).save();

    await interaction.update({
      content: 'Aşağıda bilgileri verilen yeni görev başarıyla eklendi.',
      components: [row],
    })
  }
  
  // ! Görev Sistemi

  if (interaction.customId == 'MEMBER_PENALS') {
    await interaction.deferReply({ ephemeral: true })

    const data = await penals.find({ id: interaction.values[0] })

    if (!data) {
      return await interaction.editReply({
        content: 'Belirtilen ceza veritabanında bulunamadı, tekrar deneyin.'
      })
    }

    const user = interaction.client.users.cache.get(data[0].userID)

    const embed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setThumbnail(interaction.guild.iconURL({dynamic: true, size: 2048}))
      .setDescription(`- **#${data[0].id}** ID'li **${data[0].active ? 'aktif' : 'pasif'}** cezanın detayları aşağıda yer almaktadır.`)
      .addFields(
        {
          name: 'İşlem Uygulayan Yetkili',
          value: `<@${data[0].staff}> (${data[0].staff})`,
          inline: true
        }, 
        {
          name: 'İşlem Tipi',
          value: `${data[0].type}`,
          inline: true
        },
        {
          name: 'İşlem Sebebi',
          value: data[0].reason ? `${data[0].reason.length > 1024 ? data[0].reason.substring(0, 1022).trim() + '..' : data[0].reason}` : 'Sebep belirtilmemiş.',
          inline: false
        },
        {
          name: 'Süre Bilgileri',
          value: `İşlem <t:${Math.floor(data[0].date / 1000)}> tarihinde (<t:${Math.floor(data[0].date / 1000)}:R>) uygulanmış. \n\n${data[0].finishDate ? `Verilen ceza <t:${Math.floor(data[0].finishDate / 1000)}> tarihinde (<t:${Math.floor(data[0].finishDate / 1000)}:R>) sona ${data[0].active ? 'erecek' : 'ermiş'}.` : ''}`,
          inline: false
        }
      )

    if (data[0].proofImage) {
      embed.setImage(data[0].proofImage)
    }
      
    if (user) {
      embed.setAuthor({ iconURL: user.displayAvatarURL({ dynamic: true }), name: `Cezalı: ${user.username}` })
    }

    await interaction.editReply({
      embeds: [embed]
    })
  }

  if (interaction.customId == 'MEMBER_PENALSS') {
    await interaction.deferReply({ ephemeral: true })

    const data = await penals.find({ id: interaction.values[0] })

    if (!data) {
      return await interaction.editReply({
        content: 'Belirtilen ceza veritabanında bulunamadı, tekrar deneyin.'
      })
    }

    const user = interaction.client.users.cache.get(data[0].userID)

    const embed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setDescription(`- **#${data[0].id}** ID'li **${data[0].active ? 'aktif' : 'pasif'}** cezanın detayları aşağıda yer almaktadır.`)
      .addFields(
        {
          name: 'İşlem Uygulayan Yetkili',
          value: `<@${data[0].staff}> (${data[0].staff})`,
          inline: true
        }, 
        {
          name: 'İşlem Tipi',
          value: `${data[0].type}`,
          inline: true
        },
        {
          name: 'İşlem Sebebi',
          value: data[0].reason ? `${data[0].reason.length > 1024 ? data[0].reason.substring(0, 1022).trim() + '..' : data[0].reason}` : 'Sebep belirtilmemiş.',
          inline: false
        },
        {
          name: 'Süre Bilgileri',
          value: `İşlem <t:${Math.floor(data[0].date / 1000)}> tarihinde (<t:${Math.floor(data[0].date / 1000)}:R>) uygulanmış. \n\n${data[0].finishDate ? `Verilen ceza <t:${Math.floor(data[0].finishDate / 1000)}> tarihinde (<t:${Math.floor(data[0].finishDate / 1000)}:R>) sona ${data[0].active ? 'erecek' : 'ermiş'}.` : ''}`,
          inline: false
        }
      )
      
    if (data[0].proofImage) {
      embed.setImage(data[0].proofImage)
    }

    if (user) {
      embed.setAuthor({ iconURL: user.displayAvatarURL({ dynamic: true }), name: user.username })
    }

    await interaction.editReply({
      embeds: [embed]
    })
  }

  if (interaction.customId == 'MEMBER_WARNINGS') {
    await interaction.deferReply({ ephemeral: true })

    const data = await penals.find({ id: interaction.values[0] })

    if (!data) {
      return await interaction.editReply({
        content: 'Belirtilen ceza veritabanında bulunamadı, tekrar deneyin.'
      })
    }

    const user = interaction.client.users.cache.get(data[0].userID)

    const embed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setThumbnail(interaction.guild.iconURL({dynamic: true, size: 2048}))
      .setDescription(`- **#${data[0].id}** ID'li uyarının detayları aşağıda yer almaktadır.`)
      .addFields(
        {
          name: 'İşlem Uygulayan Yetkili',
          value: `<@${data[0].staff}> (${data[0].staff})`,
          inline: true
        }, 
        {
          name: 'İşlem Tipi',
          value: `${data[0].type}`,
          inline: true
        },
        {
          name: 'İşlem Sebebi',
          value: data[0].reason ? `${data[0].reason.length > 1024 ? data[0].reason.substring(0, 1022).trim() + '..' : data[0].reason}` : 'Sebep belirtilmemiş.',
          inline: false
        },
        {
          name: 'Süre Bilgileri',
          value: `İşlem <t:${Math.floor(data[0].date / 1000)}> tarihinde (<t:${Math.floor(data[0].date / 1000)}:R>) uygulanmış.`,
          inline: false
        }
      )
      
    if (user) {
      embed.setAuthor({ iconURL: user.displayAvatarURL({ dynamic: true }), name: `Cezalı: ${user.username}` })
    }

    await interaction.editReply({
      embeds: [embed]
    })
  }
})