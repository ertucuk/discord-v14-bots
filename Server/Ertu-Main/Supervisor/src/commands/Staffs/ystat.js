const { ApplicationCommandOptionType, TeamMember, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle  } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const voiceUserParent = require("../../schemas/voiceUserParent");
const messageUser = require("../../schemas/messageUser");
const voiceUser = require("../../schemas/voiceUser");
const ertum = require("../../../../../../Global/Settings/Setup.json")
const cezapuan = require("../../schemas/cezapuan");
const coin = require("../../schemas/coin");
const taggeds = require("../../schemas/taggeds");
const yetkis = require("../../schemas/yetkis");
const ceza = require("../../schemas/ceza");
const toplams = require("../../schemas/toplams");
const inviterSchema = require("../../schemas/inviter");
const { rewards, nokta, mesaj2, staff, galp ,Muhabbet ,star , fill, empty, fillStart, emptyEnd, fillEnd, red } = require("../../../../../../Global/Settings/Emojis.json");
const ertucuk = require("../../../../../../Global/Settings/System");

module.exports = {
    name: "ystat",
    description: "Yetkili istatistiklerini görüntüler",
    category: "STAFF",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["yetkilistat","ytstat"],
      usage: ".ystat", 
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

    if(!ertum.ConfirmerRoles.some(rol => message.member.roles.cache.has(rol))) return message.react(red)
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    if(!ertum.ConfirmerRoles.some(rol => member.roles.cache.has(rol))) return message.react(red)  
     
    const messageData = await messageUser.findOne({ guildID: message.guild.id, userID: member.user.id });
    const voiceData = await voiceUser.findOne({ guildID: message.guild.id, userID: member.user.id });
    const messageWeekly = messageData ? messageData.weeklyStat : 0;
    const messageDaily = messageData ? messageData.dailyStat : 0;
    
    const coinData = await coin.findOne({ guildID: message.guild.id, userID: member.user.id });
    const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });


    const taggedData = await taggeds.findOne({ guildID: message.guild.id, userID: member.user.id });
    const toplamData = await toplams.findOne({ guildID: message.guild.id, userID: member.user.id });
    const yetkiData = await yetkis.findOne({ guildID: message.guild.id, userID: member.user.id });
    const cezaData = await ceza.findOne({ guildID: message.guild.id, userID: member.user.id });


    const inviterData = await inviterSchema.findOne({ guildID: message.guild.id, userID: member.user.id });
    const total = inviterData ? inviterData.total : 0;

    const category = async (parentsArray) => {
    const data = await voiceUserParent.find({ guildID: message.guild.id, userID: member.id });
    const voiceUserParentData = data.filter((x) => parentsArray.includes(x.parentID));
    let voiceStat = 0;
    for (var i = 0; i <= voiceUserParentData.length; i++) {
    voiceStat += voiceUserParentData[i] ? voiceUserParentData[i].parentData : 0;
    }
    return moment.duration(voiceStat).format("H [saat], m [dakika]");
    };
      
    var PuanDetaylari = new ButtonBuilder()
    .setLabel("Puan Detayları")
    .setCustomId("puan_detaylari")
    .setStyle(ButtonStyle.Success)
    .setEmoji("907014785386840075")

    var GenelPuanDetaylari = new ButtonBuilder()
    .setLabel("Genel Puan Detayları")
    .setCustomId("genel_puan_detaylari")
    .setStyle(ButtonStyle.Primary)
    .setEmoji("943107807312482304")

    var Iptal = new ButtonBuilder()
    .setLabel("İptal")
    .setCustomId("iptal_button")
    .setStyle(ButtonStyle.Danger)
    .setEmoji("920412153712889877")

    const row = new ActionRowBuilder()
    .addComponents([PuanDetaylari, GenelPuanDetaylari, Iptal])

 const embed = new EmbedBuilder()
 .setFooter({text: ertucuk.SubTitle}).setDescription(`${member.toString()}, (${member.roles.highest}) üyesinin \`${moment(Date.now()).format("LLL")}\` tarihinden  itibaren \`${message.guild.name}\` sunucusunda toplam ses ve mesaj bilgileri aşağıda belirtilmiştir.`)
.addFields(
{ name: "__**Toplam Ses**__",  value: `\`\`\`fix\n${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}\n\`\`\``, inline: true },
{ name: "__**Toplam Mesaj**__",  value: `\`\`\`fix\n${messageData ? messageData.topStat : 0} mesaj\n\`\`\``, inline: true },
{ name:"__**Toplam Kayıt**__",  value: `\`\`\`fix\n${toplamData ? `${toplamData.toplams.length} kişi`: "Veri bulunmuyor."}\n\`\`\``, inline: true },
)
.addFields(
{ name: "__**Toplam Davet**__", value: `\`\`\`fix\n${inviterData ? `${total} regular`: "Veri bulunmuyor."}\n\`\`\``, inline: true },
{ name: "__**Toplam Taglı**__", value: `\`\`\`fix\n${taggedData ? `${taggedData.taggeds.length} kişi`: "Veri bulunmuyor."}\n\`\`\``, inline: true },
{ name: "__**Toplam Yetkili**__", value: `\`\`\`fix\n${yetkiData ? `${yetkiData.yetkis.length} kişi` : "Veri bulunmuyor."}\n\`\`\``, inline: true },
{ name: `${star} __**Ses Kategori Sıralaması**__`, value: `
${nokta} Toplam: \` ${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")} \`
${nokta} Public Odalar: \` ${await category(ertum.PublicRoomsCategory)} \`
${nokta} Secret Odalar: \` ${await category(ertum.PrivateRoomsCategory)} \` 
${nokta} Alone Odalar: \` ${await category(ertum.PrivateRoomsCategory)} \`
${nokta} Yönetim Yetkili Odaları: \` ${await category(ertum.ActivityCategorys)} \`
${nokta} Kayıt Odaları: \` ${await category(ertum.RegisterRoomCategory)} \`  
`, inline: false},
{ name: `${star} **Mesaj İstatistiği**`, value: `
${nokta} Toplam: \`${messageData ? messageData.topStat : 0}\`
${nokta} Haftalık Mesaj: \`${Number(messageWeekly).toLocaleString()} mesaj\`
${nokta} Günlük Mesaj: \`${Number(messageDaily).toLocaleString()} mesaj\`
`, inline: false}
   )

    let msg = await message.channel.send({ embeds: [embed], components: [row] });

    var filter = (button) => button.user.id === message.author.id;
    let collector = await msg.createMessageComponentCollector({ filter, time: 99999999 })

    collector.on("collect", async (button) => {
      if(button.customId === "puan_detaylari") {
        await button.deferUpdate();

      const puan = new EmbedBuilder()
      .setFooter({text: ertucuk.SubTitle}).setDescription(`
      ${member.toString()}, (${member.roles.highest}) üyesinin \`${moment(Date.now()).format("LLL")}\` tarihinden  itibaren \`${message.guild.name}\` sunucusunda puanlama tablosu aşağıda belirtilmiştir.
      `) 
      
       .addFields(
        { name: `${star} **Ceza Kullanımı**`, value: `\`\`\`fix\n (Ban: ${cezaData ? cezaData.BanAmount : 0} - Mute: ${cezaData ? cezaData.MuteAmount : 0} - Ses Mute: ${cezaData ? cezaData.VoiceMuteAmount : 0} - Jail: ${cezaData ? cezaData.JailAmount : 0})\n\`\`\``, inline: false},
        { name: `${star} **Puan Detayları:**`, value: `
        ${nokta} Kayıtlar: \`${toplamData ? toplamData.toplams.length : 0} (Puan Etkisi: +${toplamData ? toplamData.toplams.length*5.5 : 0})\`
        ${nokta} Taglılar: \`${taggedData ? taggedData.taggeds.length : 0} (Puan Etkisi: +${taggedData ? taggedData.taggeds.length*25 : 0})\`
        ${nokta} Davetler: \`${total} (Puan Etkisi: +${total*15})\`
        ${nokta} Yetkililer: \`${yetkiData ? yetkiData.yetkis.length : 0} kişi (Puan Etkisi: +${yetkiData ? yetkiData.yetkis.length*30 : 0})\`
        ${nokta} Chat Puan: \`${messageData ? messageData.topStat : 0} mesaj (Puan Etkisi: +${messageData ? messageData.topStat*2 : 0})\`
        ${nokta} Sesli Puan: \`${moment.duration(voiceData ? voiceData.topStat : 0).format("h")} saat (Puan Etkisi: +${moment.duration(voiceData ? voiceData.topStat : 0).format("h")*240})\``, inline: false},
        )

msg.edit({
  embeds : [puan],
  components : [row]
})
      
      }

  if(button.customId === "genel_puan_detaylari") {
    await button.deferUpdate();
    const ceza = new EmbedBuilder()
    .setFooter({text: ertucuk.SubTitle}).setDescription(`
    ${member.toString()}, (${member.roles.highest}) üyesinin \`${moment(Date.now()).format("LLL")}\` tarihinden itibaren \`${message.guild.name}\` sunucusunda genel puanlama tablosu aşağıda belirtilmiştir.
`) 
.addFields(
{ name: `${star} **Puan Detayları:**`, value: `
${nokta} Kayıt: (\`Puan Etkisi: +${toplamData ? toplamData.toplams.length*5.5 : 0}\`)
${nokta} Taglı: (\`Puan Etkisi: +${taggedData ? taggedData.taggeds.length*25 : 0}\`)
${nokta} Davet: (\`Puan Etkisi: +${total*15}\`)
${nokta} Yetkili: (\`Puan Etkisi: +${yetkiData ? yetkiData.yetkis.length*30 : 0}\`)
${nokta} Toplam Ses: (\`Puan Etkisi: +${moment.duration(voiceData ? voiceData.topStat : 0).format("h")*240}\`)
${nokta} Toplam Mesaj: (\`Puan Etkisi: +${messageData ? messageData.topStat*2 : 0}\`)
${nokta} Toplam Aldığın Cezalar : ${cezapuanData ? cezapuanData.cezapuan.length : 0} (\`Toplam ${cezaData ? cezaData.ceza.length : 0}\`)
`, inline: false},
{ name: `${star} **Net Puanlama Bilgisi**`, value: `
${nokta} Kayıt işlemi yaparak, \`+5.5\` puan kazanırsın.
${nokta} Taglı üye belirleyerek, \`+25\` puan kazanırsınız.
${nokta} İnsanları davet ederek, \`+15\` puan kazanırsın.
${nokta} İnsanları yetkili yaparak, \`+30\` puan kazanırsın.
${nokta} Seste kalarak, ortalama olarak \`+4\` puan kazanırsınız.
${nokta} Yazı yazarak, ortalama olarak, \`+2\` puan kazanırsınız.
`, inline: false},
)

msg.edit({
  embeds: [ceza],
  components : [row]
})  
    }

      if(button.customId === "iptal_button") {
      await button.deferUpdate();
      const iptal = new EmbedBuilder()
      .setFooter({text: ertucuk.SubTitle}).setDescription(`
${member.toString()}, (${member.roles.highest}) üyesinin \`${moment(Date.now()).format("LLL")}\` tarihinden  itibaren \`${message.guild.name}\` sunucusunda toplam ses ve mesaj bilgileri aşağıda belirtilmiştir.
`)

.addFields(
  { name: "__**Toplam Ses**__",  value: `\`\`\`fix\n${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}\n\`\`\``, inline: true },
  { name: "__**Toplam Mesaj**__",  value: `\`\`\`fix\n${messageData ? messageData.topStat : 0} mesaj\n\`\`\``, inline: true },
  { name:"__**Toplam Kayıt**__",  value: `\`\`\`fix\n${toplamData ? `${toplamData.toplams.length} kişi`: "Veri bulunmuyor."}\n\`\`\``, inline: true },
  )
  .addFields(
  { name: "__**Toplam Davet**__", value: `\`\`\`fix\n${inviterData ? `${total} regular`: "Veri bulunmuyor."}\n\`\`\``, inline: true },
  { name: "__**Toplam Taglı**__", value: `\`\`\`fix\n${taggedData ? `${taggedData.taggeds.length} kişi`: "Veri bulunmuyor."}\n\`\`\``, inline: true },
  { name: "__**Toplam Yetkili**__", value: `\`\`\`fix\n${yetkiData ? `${yetkiData.yetkis.length} kişi` : "Veri bulunmuyor."}\n\`\`\``, inline: true }
  )
  
  .addFields(
  { name: `${star} **Sesli Sohbet İstatistiği**`, value: `
  ${nokta} Toplam: \`${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}\`
  ${nokta} Public Odalar: \`${await category(ertum.PublicRoomsCategory)}\`
  ${nokta} Secret Odalar: \`${await category(ertum.SecretRoomsCategory)}\`
  ${nokta} Alone Odalar: \`${await category(ertum.PrivateRoomsCategory)}\`
  ${nokta} Yönetim Yetkili Odaları: \`${await category(ertum.ActivityCategorys)}\`
  ${nokta} Kayıt Odaları: \`${await category(ertum.RegisterRoomCategory)}\`
   `, inline: false})
  
  
  .addFields(
  { name: `${star} **Mesaj İstatistiği**`, value: `
  ${nokta} Toplam: \`${messageData ? messageData.topStat : 0}\`
  ${nokta} Haftalık Mesaj: \`${Number(messageWeekly).toLocaleString()} mesaj\`
  ${nokta} Günlük Mesaj: \`${Number(messageDaily).toLocaleString()} mesaj\`
   `, inline: false });

   row.components[0].setDisabled(true) 
   row.components[1].setDisabled(true) 
   row.components[2].setDisabled(true)
   
    msg.edit({
      embeds: [iptal],
      components : [row]
    })
        
        }

  })
  

function progressBar(value, maxValue, size) {
const progress = Math.round(size * ((value / maxValue) > 1 ? 1 : (value / maxValue)));
const emptyProgress = size - progress > 0 ? size - progress : 0;

const progressText = fill.repeat(progress);
const emptyProgressText = empty.repeat(emptyProgress);

return emptyProgress > 0 ? fillStart+progressText+emptyProgressText+emptyEnd : fillStart+progressText+emptyProgressText+fillEnd;
}
    },

    onSlash: async function (client, interaction) { },
  };