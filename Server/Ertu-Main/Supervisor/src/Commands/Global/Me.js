const { ApplicationCommandOptionType, EmbedBuilder,ActionRowBuilder,StringSelectMenuBuilder,PermissionsBitField,ActivityType, AttachmentBuilder} = require("discord.js");
const axios = require('axios');
const cezapuan = require("../../../../../../Global/Schemas/cezapuan")
const moment = require("moment");
const levels = require("../../../../../../Global/Schemas/level");
const { profileImage } = require('discord-arts');
const kanal = require("../../../../../../Global/Settings/AyarName");
const Coin = require("../../../../../../Global/Schemas/ekonomi");
const ertuSpotify  = require("../../../../../../Global/Plugins/Spotify/Spotify");

require("moment-duration-format")
moment.locale("tr")
module.exports = {
    name: "profil",
    description: "Kullanıcının discord verilerini gösterir.",
    category: "USER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["me","kb","info","bilgi","kullanıcıbilgi"],
      usage: ".profil",
    },

    onLoad: function (client) { },

    onCommand: async function (client, message, args, ertuembed) {

    let kanallar = kanal.KomutKullanımKanalİsim;
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.` }).then((e) => setTimeout(() => { e.delete(); }, 10000));

    let üye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    if (üye.user.bot) return;

    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('profil')
          .setPlaceholder(`${üye.user.username} isimli kullanıcının detaylarını görüntüle!`)
          .addOptions([
            { label: "Genel İstatistikler", description: `${üye.user.username} üyesinin sunucu içerisinde aktifliğini gösterir.`, emoji: { id: "948674910425853993" }, value: "stat" },
            { label: "Ceza Geçmişi", description: `${üye.user.username} üyesinin ceza geçmişini listelenir.`, emoji: { id: "948677924561752104" }, value: "cezalarim" },
            { label: "Ses Geçmişi", description: `${üye.user.username} üyesinin ses kayıtlarını gösterir.`, emoji: { id: "948679866562277456" }, value: "sesgecmisim" },
            { label: "Ekonomi Durumu", description: `${üye.user.username} üyesinin ekonomi durumunu gösterir.`, emoji: { id: "948674949567111248" }, value: "coin" },
            { label: 'Profil Fotoğrafı', description: `${üye.user.username} üyesinin profil resmini büyütür.`, emoji: { id: '926954863647150140' }, value: 'avatar' },
            { label: 'Profil Kapağı', description: `${üye.user.username} üyesinin profil arkaplanını büyütür.`, emoji: { id: '926954863647150140' }, value: 'banner' },
          ]),
      );

    let platform = { web: '`İnternet Tarayıcısı` `🌍`', desktop: '`PC (App)` `💻`', mobile: '`Mobil` `📱`' }
    if(üye.presence && üye.presence.status !== 'offline') { bilgi = `\` • \` Bağlandığı Cihaz: ${platform[Object.keys(üye.presence.clientStatus)[0]]}` } else { bilgi = '\` • \` Bağlandığı Cihaz: `Çevrimdışı` `🔻`' }
    let cezapuanData = await cezapuan.findOne({ userID: üye.user.id });
    let coindb = await Coin.findOne({ userID: üye.user.id })
    if(!coindb) coindb = await Coin.findOneAndUpdate({guildID:message.guild.id,userID:üye.user.id},{$set:{coin:1000,beklemeSuresi:Date.now(),gameSize:0,profilOlusturma:Date.now(),hakkimda:"Girilmedi",evlilik:false,evlendigi:undefined,dailyCoinDate:(Date.now() - 86400000)}},{upsert:true, new:true})
    let yuzukisim;
    switch (coindb ? coindb.evliolduguyuzuk : "Evli Değil") {
      case "pirlanta":
        yuzukisim = "Pırlanta";
        break;
      case "baget":
        yuzukisim = "Baget";
        break;
      case "tektas":
        yuzukisim = "Tektaş";
        break;
      case "tria":
        yuzukisim = "Tria";
        break;
      case "bestas":
        yuzukisim = "Beştaş";
        break;
      default:
        yuzukisim = "Evli Değil"
    }
    let member = message.guild.members.cache.get(üye.id)
const roles = member.roles.cache.filter(role => role.name !== "@everyone").array().map(role => "<@&" + role.id + ">");
const roleList = member.roles.cache.size <= 5
  ? roles.join(", ")
  : "Listelenemedi!";
    const evlendigitarih = coindb ? coindb.evlendigitarih : null;
    const evlendigiTarihi = evlendigitarih ? `<t:${Math.floor(evlendigitarih / 1000)}:R>` : "\`Evli Değil\`";

    message.react(`${client.emoji("ertu_onay")}`)
    let embed = new EmbedBuilder()
      .setImage('attachment://ertu.png')
      .setThumbnail(üye.user.displayAvatarURL({ dynamic: true, size: 2048 }))
      .addFields(
        {
          name: `${client.emoji("ertu_star2")} **Kullanıcı Bilgisi**`,
          value: `
\` • \` Profil: ${üye}
\` • \` ID: \`${üye.id}\`
\` • \` Oluşturulma Tarihi: <t:${Math.floor(member.user.createdTimestamp / 1000)}:R>
${bilgi}
       `, inline: false
        },
        {
          name: `${client.emoji("ertu_info")} **Sunucu Bilgisi**`,
          value: `
\` • \` Sunucu İsmi: \`${member.displayName}\`
\` • \` Ceza Puanı: \`${cezapuanData ? cezapuanData.cezapuan : 0}\`
\` • \` Katılma Tarihi: <t:${Math.floor(member.joinedAt / 1000)}:R>
\` • \` Katılım Sırası: \`${(message.guild.members.cache.filter(a => a.joinedTimestamp <= üye.joinedTimestamp).size).toLocaleString()}/${(message.guild.memberCount).toLocaleString()}\`
\` • \` Rolleri: (\`${member.roles.cache.size - 1 >= 0 ? member.roles.cache.size - 1 : 0}\`): ${roleList}
       `, inline: false
        },
      );

      if (coindb.evlilik === true) {
        embed.addFields(
          {
            name: `${client.emoji("ertu_members")} **Sosyal Bilgisi**`,
            value: `
  \` • \` Evli olduğu kişi: ${coindb ? `<@${coindb.evlendiğikisiID}>` : "Evli Değil"}
  \` • \` Evlenme Tarihi: ${evlendigiTarihi}
  \` • \` Evlendiği Yüzük: \`${yuzukisim} Yüzük\`
       `, inline: false
          }
        )
      }

      if (üye && üye.presence && üye.presence.activities && üye.presence.activities.some(x => x.name == "Spotify" && x.type == ActivityType.Listening)) {
        let status = üye.presence.activities.find(x => x.name == "Spotify");
        const spotify = await new ertuSpotify()
        .setOverlayOpacity(0.7)
        .setAuthor(status.state)
        .setAlbum(status.assets.largeText)
        .setImage(`https://i.scdn.co/image/${status.assets.largeImage.slice(8)}`)
        .setTimestamp(new Date(Date.now()).getTime() - new Date(status.timestamps.start).getTime(), new Date(status.timestamps.end).getTime() - new Date(status.timestamps.start).getTime())
        .setTitle(status.details)
        .build();
        embed.setImage("attachment://spotify.png");
        obje = { content: ``, embeds: [embed], components: [row], files:[{name:"spotify.png",attachment:spotify}]}
       } else {
        obje = { content: ``, embeds: [embed], components: [row]}
       }

    let ertu = await message.reply({ content: `${client.emoji("ertu_loading")} | **${üye.user.username}** isimli üyenin detaylı bilgileri yükleniyor...` })
    ertu.edit(obje)
    var filter = (menu) => menu.user.id === message.author.id;
    const collector = ertu.createMessageComponentCollector({ filter, time: 60000 })

    collector.on("collect", async (menu) => {
      if (menu.values[0] === "avatar") {
        menu.reply({ content: `${üye.displayAvatarURL({ dynamic: true, size: 4096 })}`, ephemeral: true })
      }

      if (menu.values[0] === "banner") {
        let banner = await ertuBanner(üye.id, client)
        menu.reply({ content: `${banner}`, ephemeral: true })
      }

      if (menu.values[0] === "cezalarim") {
        let kom = client.commands.find(x => x.name == "sicil")
        if (kom) kom.onCommand(client, message, args, ertuembed)
        ertu.delete().catch(err => { })
        menu.deferUpdate().catch(err => { })
      }

      if (menu.values[0] === "sesgecmisim") {
        let kom = client.commands.find(x => x.name == "kanallog")
        if (kom) kom.onCommand(client, message, args, ertuembed)
        ertu.delete().catch(err => { })
        menu.deferUpdate().catch(err => { })
      }

      if (menu.values[0] === "coin") {
        let kom = client.commands.find(x => x.name == "coin")
        if (kom) kom.onCommand(client, message, args, ertuembed)
        ertu.delete().catch(err => { })
        menu.deferUpdate().catch(err => { })
      }

      if (menu.values[0] === "stat") {
        let kom = client.commands.find(x => x.name == "stat")
        if (kom) kom.onCommand(client, message, args, ertuembed)
        ertu.delete().catch(err => { })
        menu.deferUpdate().catch(err => { })
      }

    })
    collector.on("end", () => {
      ertu.delete().catch(err => { })
    })
  },
};

async function ertuBanner(user, client) {
  const response = await axios.get(`https://discord.com/api/v9/users/${user}`, { headers: { 'Authorization': `Bot ${client.token}` } });
  if(!response.data.banner) return `Kişinin banneri yok!`
  if(response.data.banner.startsWith('a_')) return `https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.gif?size=512`
  else return(`https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.png?size=512`)
}