const { ApplicationCommandOptionType, EmbedBuilder, Events, ButtonBuilder, ActionRowBuilder, ButtonStyle, StringSelectMenuBuilder } = require("discord.js");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const ertucuk = require("../../../../../../Global/Settings/System");
const messageUser = require("../../schemas/messageUser");
const voiceUser = require("../../schemas/voiceUser");
const voiceUserParent = require("../../schemas/voiceUserParent");
const inviterSchema = require("../../schemas/inviter");
const inviteMemberSchema = require("../../schemas/inviteMember");
const nameData = require("../../schemas/names")
const cezapuan = require("../../schemas/cezapuan")
const ceza = require("../../schemas/ceza")
const { DiscordBanners } = require('discord-banners');
const { YamlDatabase } = require("five.db");
const { nokta, green } = require('../../../../../../Global/Settings/Emojis.json');
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

    onCommand: async function (client, message, args, ertuembed) {


      if(message.author.bot) return;
        const actionRow = new ActionRowBuilder()
        .addComponents(
          new StringSelectMenuBuilder()
          .setPlaceholder(`Kısayol Menüsü`)
          .setCustomId("buttonpanel")
          .addOptions([
            {
              label: "Sunucuya Giriş Tarihiniz. ",
              value: "I",
              emoji: "1103844498670354522",
            },
            {
              label: "Üzerinde Bulunan Rollerin Listesi.",
              value: "II",
              emoji: "1103844441598464040",

            },
            {
              label: "Hesap Açılış Tarihiniz.",
              value: "III",
              emoji: "1103844446468063282",
            },
            {
              label: "Sunucudaki Son 10 İsim Geçmişiniz.",
              value: "IV",
              emoji: "1103844448787505232", 
            },
            {
              label: "Sunucunun Anlık Aktiflik Listesi.",
              value: "V",
              emoji: "1103844452218458212",
            },
            {
              label: "Sunucudaki Son 10 Ceza Geçmişiniz.",
              value: "VI",
              emoji: "1103844319644885082", 
            },
            {
              label: "Sunucudaki Ceza Puanınız.",
              value: "VII",
              emoji: "1103844321591038104", 
            },
            {
              label: "Kullanıcı Avatarınız.",
              value: "VIII",
              emoji: "1103844324346699796", 
            },
            {
              label: "Kullanıcı Bannerınız.",
              value: "IX",
              emoji: "1113903363357159614", 
            },
          ])
        )
    
        message.channel.send({ content: `
        ** Merhaba \` ${message.guild.name} \` sunucusu içerisi yapmak istediğiniz işlem veya ulaşmak istediğiniz bilgi için gerekli menülere tıklamanız yeterli olucaktır!**`,
        components: [actionRow] });
      
    
          
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
            const tagged = invMember ? interaction.guild.members.cache.filter((m) => invMember.some((x) => x.userID === m.user.id) && m.user.displayName.includes(ertum.ServerTag)).size : 0;
            
////////////////////////////////////////////////////////////////////////////////////////////

const data = await nameData.findOne({ guildID: ertucuk.ServerID, userID: member.id });
const cezaData = await ceza.findOne({ guildID: ertucuk.ServerID, userID: member.id });
const cezapuanData = await cezapuan.findOne({ userID: member.id });
const ertu = db.get(`kullanıcı_${member.id}`)
var data1 = db.has("cezapuan",true)

////////////////////////////////////////////////////////////////////////////////////////////

const messageData = await messageUser.findOne({ guildID: ertucuk.ServerID, userID: interaction.user.id });
const voiceData = await voiceUser.findOne({ guildID: ertucuk.ServerID, userID: interaction.user.id });

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

if(interaction.isStringSelectMenu()) { 
if(interaction.customId === "buttonpanel") {
if(interaction.values[0] === "I") 
{
await interaction.reply({ content: `Sunucuya Katılma Tarihiniz : <t:${Math.floor(interaction.member.joinedTimestamp / 1000)}:R>`, ephemeral: true });
}
if(interaction.values[0] === "II")
{
await interaction.reply({ content: `Üzerinde Bulunan Roller:
        
${(await interaction.guild.members.cache.get(member.id).roles.cache.filter(a => a.name !== '@everyone').map(a => a).join(' ') ? await interaction.guild.members.cache.get(member.id).roles.cache.filter(a => a.name !== '@everyone').map(a => a).join(', ') : 'Hiç yok.')}`, ephemeral: true });
}

if(interaction.values[0] === "III")
{
await interaction.reply({ content: `Hesabınızın Açılış Tarihi :  <t:${Math.floor(member.createdTimestamp / 1000)}:R>`, ephemeral: true });
}

if(interaction.values[0] === "IV")
{
const ertu = new EmbedBuilder()
.setAuthor({ name: `${member.username} üyesinin isim bilgileri;`})
.setThumbnail(member.displayAvatarURL({ dynamic: true, size: 2048 }))
.setDescription(data ? data.names.splice(0, 10).map((x, i) => `\`${i + 1}.\` \`${x.name}\` (${x.rol}) , (<@${x.yetkili}>) , **[**\`${moment(x.date).format("LLL")}\`**]**`).join("\n") : "Bu kullanıcıya ait isim geçmişi bulunmuyor!")         
await interaction.reply({ embeds: [ertu], ephemeral: true });

}

if(interaction.values[0] === "V")
{
  await interaction.reply({ content: `
  ${nokta} Sesli kanallardaki üye sayısı : \`${(interaction.guild.members.cache.filter((x) => x.voice.channel).size)}\`
  ${nokta} Sunucudaki toplam üye sayısı : \`${(interaction.guild.memberCount)}\`
  `, ephemeral: true });
}

if(interaction.values[0] === "VI")
{

if(!ertu) return interaction.reply({ content:`${green} Bu Kullanıcının sicil kaydı bulunmamakta.`, ephemeral:true})
interaction.reply({ content:`${ertu.map((x,i) => `${i+1}). ${x}`).join("\n")}`, ephemeral: true});


}

if(interaction.values[0] === "VII")
{
await interaction.reply({ content: `
${member} kişisinin toplamda \`${cezapuanData ? cezapuanData.cezapuan : 0}\` ceza puanı ve (Toplam **${cezaData ? cezaData.ceza.length : 0}** Ceza) olarak gözükmekte!
`, ephemeral: true });
}

if(interaction.values[0] === "VIII")
{
await interaction.reply({ content: `
${member.displayAvatarURL({ dynamic: true, size: 4096 })}
`, ephemeral: true });
}

if(interaction.values[0] === "IX")
{
await interaction.reply({ content: `
${banner}
`, ephemeral: true });
}


    }}});
     },

    onSlash: async function (client, interaction) { },
  };