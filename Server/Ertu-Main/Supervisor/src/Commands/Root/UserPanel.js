const { ApplicationCommandOptionType, EmbedBuilder, Events, ButtonBuilder, ActionRowBuilder, ButtonStyle, StringSelectMenuBuilder, Embed } = require("discord.js");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const ertucuk = require("../../../../../../Global/Settings/System");
const voiceUserParent = require("../../../../../../Global/Schemas/voiceUserParent");
const inviterSchema = require("../../../../../../Global/Schemas/inviter");
const inviteMemberSchema = require("../../../../../../Global/Schemas/inviteMember");
const nameData = require("../../../../../../Global/Schemas/names")
const cezapuan = require("../../../../../../Global/Schemas/cezapuan")
const ceza = require("../../../../../../Global/Schemas/ceza")
const levels = require("../../../../../../Global/Schemas/level");
const { profileImage } = require('discord-arts');
const { YamlDatabase } = require("five.db");
const { nokta, green, star,red } = require('../../../../../../Global/Settings/Emojis.json');
const db = new YamlDatabase();
const moment = require("moment");
const penals = require("../../../../../../Global/Schemas/penals");
const { MessageStat, MessageUserChannel, VoiceStat, VoiceUserChannel, StreamerStat, StreamerUserChannel, CameraStat, CameraUserChannel } = require("../../../../../../Global/Models")

module.exports = {
    name: "userpanel",
    description: "Kullanıcı Panel",
    category: "OWNER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["kullanicipanel"],
      usage: ".userpanel", 
    },

    onLoad: function (client) { },

    onCommand: async function (client, message, args, ertuembed) {

     
      message.channel.send({
          content: `
### ${message.guild.name} kullanıcı paneli;

**1:** Sunucuya katılma tarihinizi öğrenin.
**2:** Level bilginizi öğrenin.
**3:** Ceza durumuzunuzu görüntüleyin.

**4:** Sunucudaki eski isim bilgilerinizi görüntüleyin. 
**5:** Sahip olduğunuzu rolleri görüntüleyin.
**6:** Sunucudaki mesaj sayınızı görüntüleyin..

**7:** Sunucu sesli sohbetlerinde geçmiş olduğunuzu süreyi görüntüleyin.
**8:** Hesabınızın oluşturulma tarihini görüntüleyin.
**9:** Davet ettiğiniz üye sayısı.
      `,
          components: [
              {
                  type: 1,
                  components: [
                      { type: 2, style: 2, custom_id: 'I', label: '1' },
                      { type: 2, style: 2, custom_id: 'II', label: '2' },
                      { type: 2, style: 2, custom_id: 'III', label: '3' },
                  ],
              },
              {
                  type: 1,
                  components: [
                      { type: 2, style: 2, custom_id: 'IV', label: '4' },
                      { type: 2, style: 2, custom_id: 'V', label: '5' },
                      { type: 2, style: 2, custom_id: 'VI', label: '6' },
                  ],
              },
              {
                  type: 1,
                  components: [
                      { type: 2, style: 2, custom_id: 'VII', label: '7' },
                      { type: 2, style: 2, custom_id: 'VIII', label: '8' },
                      { type: 2, style: 2, custom_id: 'IX', label: '9' },
                  ],
              },
          ],
      });
},
}       

client.on(Events.InteractionCreate, async (interaction) => {
      
const member = interaction.user;
const inviterData = await inviterSchema.findOne({ guildID: ertucuk.ServerID, userID: interaction.user.id });
const total = inviterData ? inviterData.total : 0;
const regular = inviterData ? inviterData.regular : 0;
const bonus = inviterData ? inviterData.bonus : 0;
const leave = inviterData ? inviterData.leave : 0;
const fake = inviterData ? inviterData.fake : 0;
const invMember = await inviteMemberSchema.find({ guildID: ertucuk.ServerID, inviter: interaction.user.id });
const daily = invMember ? interaction.guild.members.cache.filter((m) => invMember.some((x) => x.userID === m.user.id) && Date.now() - m.joinedTimestamp < 1000 * 60 * 60 * 24).size : 0;
const weekly = invMember ? interaction.guild.members.cache.filter((m) => invMember.some((x) => x.userID === m.user.id) && Date.now() - m.joinedTimestamp < 1000 * 60 * 60 * 24 * 7).size : 0;
const davetettigim = invMember ? invMember.filter(ertu => interaction.guild.members.cache.get(ertu.userID)).slice(0, 10).map((ertu, index) => interaction.guild.members.cache.get(ertu.userID)).join(", ") : "Veri Yok"
            
////////////////////////////////////////////////////////////////////////////////////////////

const data = await nameData.findOne({ guildID: ertucuk.ServerID, userID: member.id });

////////////////////////////////////////////////////////////////////////////////////////////
const messageData =  await MessageStat.findOne({guildID: ertucuk.ServerID, userID: member.id});
const voiceData = await VoiceStat.findOne({guildID: ertucuk.ServerID, userID: member.id});
const streamData = await StreamerStat.findOne({guildID: ertucuk.ServerID, userID: member.id});
const cameraData = await CameraStat.findOne({guildID: ertucuk.ServerID, userID: member.id});

const messageTop = messageData ? messageData.TotalStat : 0;
const messageWeekly = messageData ? messageData.WeeklyStat : 0;
const messageDaily = messageData ? messageData.DailyStat : 0;
const voiceTop = moment.duration(voiceData ? voiceData.TotalStat : 0).format("H [saat], m [dakika]");
const voiceWeekly = moment.duration(voiceData ? voiceData.WeeklyStat : 0).format("H [saat], m [dakika]");
const voiceDaily = moment.duration(voiceData ? voiceData.DailyStat : 0).format("H [saat], m [dakika]");

////////////////////////////////////////////////////////////////////////////////////////////

if(interaction.customId === "I")
{
await interaction.reply({ content: `Sunucuya Katılma Tarihiniz: <t:${Math.floor(interaction.member.joinedTimestamp / 1000)}:R> (<t:${Math.floor(interaction.member.joinedTimestamp / 1000)}>)`, ephemeral: true });
}
if(interaction.customId === "II")
{
const ertu = await levels.findOne({ guildID: ertucuk.ServerID, userID: interaction.user.id })
interaction.reply({content: `**Mevcut Seviyen: \` ${ertu ? ertu.level : 1} \` bir sonraki seviyeye ulaşmak için \` ${ertu ? ertu.gerekli : 500 } \` __XP__ kazanman gerekiyor.**`, ephemeral: true});
}

if(interaction.customId === "III")

{
const data = await penals.find({ guildID: ertucuk.ServerID, userID: interaction.member.id }).sort({ date: -1 });
if (data.length === 0) { return interaction.reply({ content: `${client.emoji("ertu_onay")} ${member.toString()} üyesinin sicili temiz!`, ephemeral: true })}
let remainingData = [...data];
while (remainingData.length > 0) {
const dataSlice = remainingData.splice(0, 2000);
const formattedData = dataSlice.map((x) => `#${x.id} **[${x.type}]** ${moment(x.date).format("LLL")} tarihinde, <@${x.staff}> tarafından, \`${x.reason}\` nedeniyle, ${x.type.toLowerCase().replace("-", " ")} cezası almış.\n─────────────────`).join("\n");
const embed = new EmbedBuilder()
.setDescription(formattedData);
await interaction.reply({ embeds: [embed], ephemeral: true });
}
}

if(interaction.customId === "IV")

{
const ertu = new EmbedBuilder()
.setAuthor({ name: `${member.username} üyesinin isim bilgileri;`})
.setThumbnail(member.displayAvatarURL({ dynamic: true, size: 2048 }))
.setDescription(data ? data.names.splice(0, 10).map((x, i) => `\`${i + 1}.\` \`${x.name}\` (${x.rol}) **[**\`${moment(x.date).format("LLL")}\`**]**`).join("\n") : "Bu kullanıcıya ait isim geçmişi bulunmuyor!")         
await interaction.reply({ embeds: [ertu], ephemeral: true });
}

if(interaction.customId === "V")
{
await interaction.reply({ content: `Üzerinde bulunan rollerin listesi;  
${(await interaction.guild.members.cache.get(member.id).roles.cache.filter(a => a.name !== '@everyone').map(a => a).join(' ') ? await interaction.guild.members.cache.get(member.id).roles.cache.filter(a => a.name !== '@everyone').map(a => a).join(', ') : 'Hiç yok.')}`, ephemeral: true });
}

if(interaction.customId === "VI")
{
  await interaction.reply({ content: `
  ${client.emoji("ertu_star")} **Mesaj İstatistiği**
  ${client.emoji("ertu_nokta")} Toplam Mesaj: \` ${Number(messageTop).toLocaleString()} mesaj \`
  ${client.emoji("ertu_nokta")} Haftalık Mesaj: \` ${Number(messageWeekly).toLocaleString()} mesaj \`
  ${client.emoji("ertu_nokta")} Günlük Mesaj: \` ${Number(messageDaily).toLocaleString()} mesaj \`
  `, ephemeral: true });
}

if(interaction.customId === "VII")
{
  await interaction.reply({ content: `
  ${client.emoji("ertu_star")} **__Sesli Sohbet İstatistiği__**
  ${client.emoji("ertu_nokta")} Toplam Ses: \` ${voiceTop} \`
  ${client.emoji("ertu_nokta")} Haftalık Ses: \` ${voiceWeekly} \`
  ${client.emoji("ertu_nokta")} Günlük Ses: \` ${voiceDaily} \`
  
  ${client.emoji("ertu_star")} **__Yayın Sohbet İstatistiği__**
  ${client.emoji("ertu_nokta")} Toplam Yayın: \` ${moment.duration(streamData ? streamData.TotalStat : 0).format("H [saat], m [dakika]")} \`
  ${client.emoji("ertu_nokta")} Haftalık Yayın: \` ${moment.duration(streamData ? streamData.WeeklyStat : 0).format("H [saat], m [dakika]")} \`
  ${client.emoji("ertu_nokta")} Günlük Yayın: \` ${moment.duration(streamData ? streamData.DailyStat : 0).format("H [saat], m [dakika]")} \`
  
  ${client.emoji("ertu_star")} **__Kamera Sohbet İstatistiği__**
  ${client.emoji("ertu_nokta")} Toplam Kamera: \` ${moment.duration(cameraData ? cameraData.TotalStat : 0).format("H [saat], m [dakika]")} \`
  ${client.emoji("ertu_nokta")} Haftalık Kamera: \` ${moment.duration(cameraData ? cameraData.WeeklyStat : 0).format("H [saat], m [dakika]")} \`
  ${client.emoji("ertu_nokta")} Günlük Kamera: \` ${moment.duration(cameraData ? cameraData.DailyStat : 0).format("H [saat], m [dakika]")} \`
  `, ephemeral: true });}

if(interaction.customId === "VIII")
{
await interaction.reply({ content: `Hesabınızın Açılış Tarihi: <t:${Math.floor(member.createdTimestamp / 1000)}:R> (<t:${Math.floor(member.createdTimestamp / 1000)}>)`, ephemeral: true });
}

if(interaction.customId === "IX")
{
await interaction.reply({ content: `
Toplam **${total}** davet.
\` ${regular} gerçek \`
\` ${bonus} bonus \`
\` ${leave} ayrılmış \`
\` ${fake} fake \`
      
Günlük: \`${daily}\`, Haftalık: \`${weekly}\`

**❯ Davet ettiği tüm kişiler;**
${davetettigim ? `${davetettigim}` : 'Veri Yok'}
`, ephemeral: true });
}


    });
     

  const rakam = client.sayıEmoji = (sayi) => {
    var ertu = sayi.toString().replace(/ /g, "     ");
    var ertu2 = ertu.match(/([0-9])/g);
    ertu = ertu.replace(/([a-zA-Z])/g, "Belirlenemiyor").toLowerCase();
    if (ertu2) {
      ertu = ertu.replace(/([0-9])/g, d => {
        return {
          '0': client.emoji("sayiEmoji_sifir") !== null ? client.emoji("sayiEmoji_sifir") : "\` 0 \`",
          '1': client.emoji("sayiEmoji_bir") !== null ? client.emoji("sayiEmoji_bir") : "\` 1 \`",
          '2': client.emoji("sayiEmoji_iki") !== null ? client.emoji("sayiEmoji_iki") : "\` 2 \`",
          '3': client.emoji("sayiEmoji_uc") !== null ? client.emoji("sayiEmoji_uc") : "\` 3 \`",
          '4': client.emoji("sayiEmoji_dort") !== null ? client.emoji("sayiEmoji_dort") : "\` 4 \`",
          '5': client.emoji("sayiEmoji_bes") !== null ? client.emoji("sayiEmoji_bes") : "\` 5 \`",
          '6': client.emoji("sayiEmoji_alti") !== null ? client.emoji("sayiEmoji_alti") : "\` 6 \`",
          '7': client.emoji("sayiEmoji_yedi") !== null ? client.emoji("sayiEmoji_yedi") : "\` 7 \`",
          '8': client.emoji("sayiEmoji_sekiz") !== null ? client.emoji("sayiEmoji_sekiz") : "\` 8 \`",
          '9': client.emoji("sayiEmoji_dokuz") !== null ? client.emoji("sayiEmoji_dokuz") : "\` 9 \`"
        }[d];
      });
    }
    return ertu;
  }