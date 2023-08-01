const { ApplicationCommandOptionType,PermissionsBitField , ActionRowBuilder,ButtonStyle , ButtonBuilder, EmbedBuilder } = require("discord.js");
const { star , fill, empty, fillStart, emptyEnd, fillEnd, red, nokta } = require("../../../../../../Global/Settings/Emojis.json");
const ertucuk = require("../../../../../../Global/Settings/System");
const conf = require("../../../../../../Global/Settings/Setup.json");
const voiceUserParent = require("../../../../../../Global/Schemas/voiceUserParent");
const messageUser = require("../../../../../../Global/Schemas/messageUser");
const voiceUser = require("../../../../../../Global/Schemas/voiceUser");
const cezapuan = require("../../../../../../Global/Schemas/cezapuan");
const coin = require("../../../../../../Global/Schemas/coin");
const taggeds = require("../../../../../../Global/Schemas/taggeds");
const yetkis = require("../../../../../../Global/Schemas/yetkis");
const ceza = require("../../../../../../Global/Schemas/ceza");
const toplams = require("../../../../../../Global/Schemas/toplams");
const inviterSchema = require("../../../../../../Global/Schemas/inviter");
const kanal = require("../../../../../../Global/Settings/AyarName");
const moment = require("moment");
moment.locale("tr");

module.exports = {
    name: "yetki",
    description: "",
    category: "RANK",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["yetkiyükselt"],
      usage: "", 
    },
  

    onLoad: function (client) { },

    onCommand: async function (client, message, args, ertuembed) {

      let kanallar = kanal.KomutKullanımKanalİsim;
if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

        const ranks = [
            "1121409813537116211",// en alt yetki permi 0 coinken
            "1121409824496816208",
            "1121409822194147348",
            "1121409821023940701",
            "1121409819841155072"
            ]

         if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return

  const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
  if (!member) {
    message.reply({ content: `Bir kullanıcı etiketlemelisin ya da ID'sini girmelisin.` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
    return
  }

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

  const maxValue = client.ranks[client.ranks.indexOf(client.ranks.find(x => x.coin >= (coinData ? coinData.coin : 0)))] || client.ranks[client.ranks.length-1];
    let currentRank = client.ranks.filter(x => (coinData ? coinData.coin : 0) >= x.coin);
    currentRank = currentRank[currentRank.length-1];

    const coinStatus = client.ranks.length > 0 ?
    `${currentRank ?`
    ${currentRank !== client.ranks[client.ranks.length-1] ? `Şu an üye ${Array.isArray(currentRank.role) ? currentRank.role.map(x => `<@&${x}>`).join(", ") : `<@&${currentRank.role}>`} rolünde. ${Array.isArray(maxValue.role) ? maxValue.role.length > 1 ? maxValue.role.slice(0, -1).map(x => `<@&${x}>`).join(', ') + ', ' + maxValue.role.map(x => `<@&${x}>`).slice(-1) : maxValue.role.map(x => `<@&${x}>`).join("") : `Üyenin <@&${maxValue.role}>`} rolüne ulaşması için \`${maxValue.coin-coinData.coin}\` puan daha kazanmanız gerekiyor!` : "Şu an son yetkidesin!"}` : ` 
    Şuan üye ${message.member.roles.highest} rolünde. ${Array.isArray(maxValue.role) ? maxValue.role.length > 1 ? maxValue.role.slice(0, -1).map(x => `<@&${x}>`).join(', ') + ', ' + maxValue.role.map(x => `<@&${x}>`).slice(-1) : maxValue.role.map(x => `<@&${x}>`).join("") : `Üyenin <@&${maxValue.role}>`} rolüne ulaşması için \`${maxValue.coin - (coinData ? coinData.coin : 0)}\`  Puan daha kazanması gerekiyor!`}` : ""

  const inviterData = await inviterSchema.findOne({ guildID: message.guild.id, userID: member.user.id });
    const total = inviterData ? inviterData.total : 0;

      var YükseltButon = new ButtonBuilder()
      .setLabel("Yetki Yükselt")
      .setCustomId("yükselt")
      .setStyle(ButtonStyle.Success)
      .setEmoji("1119299056292855890")
  
      var DüşürButon = new ButtonBuilder()
      .setLabel("Yetki Düşür")
      .setCustomId("düşür")
      .setStyle(ButtonStyle.Danger)
      .setEmoji("1119299078090657916")
  
      const row = new ActionRowBuilder()
      .addComponents([YükseltButon, DüşürButon])

      const ertu = new EmbedBuilder()
      .setDescription(`${member.toString()}, (${member.roles.highest}) üyesinin \`${moment(Date.now()).format("LLL")}\` tarihinden itibaren puanlama tablosu aşağıda belirtilmiştir.`)
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
        ${nokta} Yazı yazarak, ortalama olarak, \`+2\` puan kazanırsınız. \n ${coinStatus}
        `, inline: false},
        )

  let msg = await message.channel.send({ embeds: [ertu], components: [row] });
  var filter = (button) => button.user.id === message.author.id;
  let collector = await msg.createMessageComponentCollector({ filter, time: 99999999 })

  
  collector.on("collect", async (button) => {

    if(button.customId === "yükselt") {
      await button.deferUpdate();
      let yetkiNumber;
      let sahipOlunanRol = Number();
      for (yetkiNumber = 0; yetkiNumber < ranks.length ; yetkiNumber++) {
        if(member.roles.cache.has(ranks[yetkiNumber])) {
          sahipOlunanRol += yetkiNumber
        };
      }  
   if(!member.roles.cache.has(ranks[ranks.length-1])){
      await member.roles.add(ranks[sahipOlunanRol+1]).catch(e => { })
      await member.roles.remove(ranks[sahipOlunanRol]).catch(e => { })
  
      const yk = new EmbedBuilder()
      .setDescription(`${member} Kullanısı <@&${ranks[sahipOlunanRol+1]}> Yetkisine Başarılı bir Şekilde Yükseltildi.`)
  
      await msg.edit({ embeds: [yk], components: []}).catch(() => {})
  
      if (client.ranks.some(x => member.hasRole(x.role))) {
        let rank = client.ranks.filter(x => member.hasRole(x.role));
        rank = rank[rank.length-1];
        await coin.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $set: { coin: rank.coin } }, { upsert: true });
      }
  
    } else { 
      button.reply({ content:`:x: Belirtilen Kullanıcı Zaten Max Role Sahip.`, ephemeral: true})}
  }
  
        if(button.customId === "düşür") {
          await button.deferUpdate();
          let yetkiNumber;
          let sahipOlunanRol = Number();
          for (yetkiNumber = 0; yetkiNumber < ranks.length ; yetkiNumber++) {
            if(member.roles.cache.has(ranks[yetkiNumber])) {
              sahipOlunanRol += yetkiNumber
            };
          }  
          if(!member.roles.cache.has(ranks[0])){
          await member.roles.add(ranks[sahipOlunanRol-1]).catch(e => { })
          await member.roles.remove(ranks[sahipOlunanRol]).catch(e => { })
  
          const dşr = new EmbedBuilder()
          .setDescription(`${member} Kullanısı <@&${ranks[sahipOlunanRol-1]}> Yetkisine Başarılı bir Şekilde Düşürüldü.`)
          await msg.edit({ embeds: [dşr], components: []}).catch(() => {})
  
          if (client.ranks.some(x => member.hasRole(x.role))) {
            let rank = client.ranks.filter(x => member.hasRole(x.role));
            rank = rank[rank.length-1];
            await coin.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $set: { coin: rank.coin } }, { upsert: true });
          }
        } else {
          const sex = new EmbedBuilder()
          .setDescription(`${member} adlı kullanıcısı zaten suanda başlangıç yetkisinde yetkisini almak için tepkiye tıkla.
          ${member} adlı kullanıcının Yetkisi: ${conf.Authorities.length > 1 ? conf.Authorities.slice(0, -1).map(x => `<@&${x}>`).join(", ") + " ve " + conf.Authorities.map(x => `<@&${x}>`).slice(-1) : conf.Authorities.map(x => `<@&${x}>`).join("")}`)
  
          msg.edit({ embeds: [sex], components: []}).then(async msj => {
          await msj.react('✅');
        const filter = (reaction, user) => {
          return reaction.emoji.name === '✅' && user.id === message.author.id;
        };
        const collector = msj.createReactionCollector({filter, max: 1, time: 50000, error: ['time']})
        collector.on('collect', (reaction, user) => {
        member.roles.remove(conf.Authorities)
        msg.edit({ content:`${member} kullanıcısının [Yetki-Rolleri] rolleri başarılı bir şekilde alındı.`, embeds: []})
        coin.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $set: { coin: 0 } }, { upsert: true });
        });
})
}
}}) 

     },

  };