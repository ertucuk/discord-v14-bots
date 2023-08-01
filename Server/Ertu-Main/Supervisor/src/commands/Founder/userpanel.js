const { ApplicationCommandOptionType, EmbedBuilder, Events, ButtonBuilder, ActionRowBuilder, ButtonStyle, StringSelectMenuBuilder } = require("discord.js");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const ertucuk = require("../../../../../../Global/Settings/System");
const messageUser = require("../../../../../../Global/Schemas/messageUser");
const voiceUser = require("../../../../../../Global/Schemas/voiceUser");
const voiceUserParent = require("../../../../../../Global/Schemas/voiceUserParent");
const inviterSchema = require("../../../../../../Global/Schemas/inviter");
const inviteMemberSchema = require("../../../../../../Global/Schemas/inviteMember");
const nameData = require("../../../../../../Global/Schemas/names")
const streamerUser = require("../../../../../../Global/Schemas/streamerUser");
const cameraUser = require("../../../../../../Global/Schemas/cameraUser"); 
const cezapuan = require("../../../../../../Global/Schemas/cezapuan")
const ceza = require("../../../../../../Global/Schemas/ceza")
const levels = require("../../../../../../Global/Schemas/level");
const { profileImage } = require('discord-arts');
const { DiscordBanners } = require('discord-banners');
const { YamlDatabase } = require("five.db");
const { nokta, green, star } = require('../../../../../../Global/Settings/Emojis.json');
const db = new YamlDatabase();
const moment = require("moment");

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

     
      message.channel.send({ content: 
`
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
      "components":[{
      "type":1,"components":[
                               {"type":2,"style":2,"custom_id":"I","label":"1"},
                               {"type":2,"style":2,"custom_id":"II","label":"2"},
                               {"type":2,"style":2,"custom_id":"III","label":"3"},
             ]}, {  "type":1,"components":[
                               {"type":2,"style":2,"custom_id":"IV","label":"4"},
                               {"type":2,"style":2,"custom_id":"V","label":"5"},
                               {"type":2,"style":2,"custom_id":"VI","label":"6"}
             ]}, {  "type":1,"components":[
                               {"type":2,"style":2,"custom_id":"VII","label":"7"},
                               {"type":2,"style":2,"custom_id":"VIII","label":"8"},
                               {"type":2,"style":2,"custom_id":"IX","label":"9"}
             ]}

]})
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
const cezaData = await ceza.findOne({ guildID: ertucuk.ServerID, userID: member.id });
const cezapuanData = await cezapuan.findOne({ userID: member.id });
const ertu = db.get(`kullanıcı_${member.id}`)
var data1 = db.has("cezapuan",true)

////////////////////////////////////////////////////////////////////////////////////////////

const messageData = await messageUser.findOne({ guildID: ertucuk.ServerID, userID: interaction.user.id });
const voiceData = await voiceUser.findOne({ guildID: ertucuk.ServerID, userID: interaction.user.id });
const streamData = await streamerUser.findOne({ guildID: ertucuk.ServerID, userID: interaction.user.id });
const cameraData = await cameraUser.findOne({ guildID: ertucuk.ServerID, userID: interaction.user.id });

  const messageWeekly = messageData ? messageData.weeklyStat : 0;
  const voiceWeekly = moment.duration(voiceData ? voiceData.weeklyStat : 0).format("H [saat], m [dakika]");
  const messageDaily = messageData ? messageData.dailyStat : 0;
  const voiceDaily = moment.duration(voiceData ? voiceData.dailyStat : 0).format("H [saat], m [dakika]");

  const discordBanners = new DiscordBanners(client);
  const banner = await discordBanners.getBanner(member.id, { size: 2048, format: "png", dynamic: true })

////////////////////////////////////////////////////////////////////////////////////////////

const category = async (parentsArray) => {
  const data = await voiceUserParent.find({ guildID: ertucuk.ServerID, userID: member.id });
  const voiceUserParentData = data.filter((x) => parentsArray.includes(x.parentID));
  let voiceStat = 0;
  for (var i = 0; i <= voiceUserParentData.length; i++) {
    voiceStat += voiceUserParentData[i] ? voiceUserParentData[i].parentData : 0;
  }
  return moment.duration(voiceStat).format("H [saat], m [dakika] s [saniye]");
};

////////////////////////////////////////////////////////////////////////////////////////////

if(interaction.customId === "I")
{
await interaction.reply({ content: `Sunucuya Katılma Tarihiniz: <t:${Math.floor(interaction.member.joinedTimestamp / 1000)}:R> (<t:${Math.floor(interaction.member.joinedTimestamp / 1000)}>)`, ephemeral: true });
}
if(interaction.customId === "II")
{
  const ertu = await levels.findOne({ guildID: ertucuk.ServerID, userID: interaction.user.id })
  let status;

  if(member.presence && member.presence.status === "dnd") status = "#ff0000"
  if(member.presence && member.presence.status === "idle") status = "#ffff00"
  if(member.presence && member.presence.status === "online") status = "#00ff00"
  if(member.presence && member.presence.status === "offline") status = "#808080"

  const buffer = await profileImage(interaction.user.id, {
  borderColor: '#087996',
  presenceStatus: interaction.user.presence ? interaction.user.presence.status : 'offline',
  badgesFrame: true,
  rankData: {
    currentXp: ertu ? ertu.xp : 1,
    requiredXp: ertu ? ertu.gerekli : 500,
    level: ertu ? ertu.level : 1,
    barColor: '0b7b95'
}
})

interaction.reply({files: [{name: "ertu.png", attachment: buffer}], ephemeral: true})

}

if(interaction.customId === "III")

{
if(!ertu) return interaction.reply({ content:`Bu kullanıcı daha önce bir ceza-i işleme tabi tutulmamış.`, ephemeral:true})
interaction.reply({ content:`${ertu.map((x,i) => `${i+1}). ${x}`).join("\n")}`, ephemeral: true});
}

if(interaction.customId === "IV")

{
const ertu = new EmbedBuilder()
.setAuthor({ name: `${member.username} üyesinin isim bilgileri;`})
.setThumbnail(member.displayAvatarURL({ dynamic: true, size: 2048 }))
.setDescription(data ? data.names.splice(0, 10).map((x, i) => `\`${i + 1}.\` \`${x.name}\` (${x.rol}) , (<@${x.yetkili}>) , **[**\`${moment(x.date).format("LLL")}\`**]**`).join("\n") : "Bu kullanıcıya ait isim geçmişi bulunmuyor!")         
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
  ${star} **Mesaj İstatistiği**
  ${nokta} Toplam Mesaj: \` ${messageData ? messageData.topStat : 0} mesaj \`
  ${nokta} Haftalık Mesaj: \` ${Number(messageWeekly).toLocaleString()} mesaj \`
  ${nokta} Günlük Mesaj: \` ${Number(messageDaily).toLocaleString()} mesaj \`
  `, ephemeral: true });
}

if(interaction.customId === "VII")
{
  await interaction.reply({ content: `
  ${star} **__Sesli Sohbet İstatistiği__**
  ${nokta} Toplam Ses: \` ${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")} \`
  ${nokta} Haftalık Ses: \` ${voiceWeekly} \`
  ${nokta} Günlük Ses: \` ${voiceDaily} \`
  
  ${star} **__Yayın Sohbet İstatistiği__**
  ${nokta} Toplam Yayın: \` ${moment.duration(streamData ? streamData.topStat : 0).format("H [saat], m [dakika]")} \`
  ${nokta} Haftalık Yayın: \` ${moment.duration(streamData ? streamData.weeklyStat : 0).format("H [saat], m [dakika]")} \`
  ${nokta} Günlük Yayın: \` ${moment.duration(streamData ? streamData.dailyStat : 0).format("H [saat], m [dakika]")} \`
  
  ${star} **__Kamera Sohbet İstatistiği__**
  ${nokta} Toplam Kamera: \` ${moment.duration(cameraData ? cameraData.topStat : 0).format("H [saat], m [dakika]")} \`
  ${nokta} Haftalık Kamera: \` ${moment.duration(cameraData ? cameraData.weeklyStat : 0).format("H [saat], m [dakika]")} \`
  ${nokta} Günlük Kamera: \` ${moment.duration(cameraData ? cameraData.dailyStat : 0).format("H [saat], m [dakika]")} \`
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