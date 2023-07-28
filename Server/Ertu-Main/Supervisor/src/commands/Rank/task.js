const { ApplicationCommandOptionType, ButtonStyle, ButtonBuilder, ActionRowBuilder, Events, EmbedBuilder, StringSelectMenuBuilder, ComponentType, codeBlock,GuildMember, PermissionsBitField } = require("discord.js");
const gorev = require("../../schemas/invite");
const coinn = require("../../schemas/coin");
const kayitg = require("../../schemas/kayitgorev");
const mesaj = require("../../schemas/mesajgorev");
const yetkis = require("../../schemas/yetkis");
const tagli = require("../../schemas/taggorev");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const ertucuk = require("../../../../../../Global/Settings/System");
const {emptystart, fillstart, fill, empty, emptyEnd, fillend, red, star, coin } = require("../../../../../../Global/Settings/Emojis.json");
const client = global.client;
const ms = require("ms")
const moment = require("moment");
const kanal = require("../../../../../../Global/Settings/AyarName");

module.exports = {
    name: "görev",
    description: "",
    category: "RANK",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["göreval","görev-al","gettask"],
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

    onLoad: function (client) {},

    onCommand: async function (client, message, args, ertuembed) {

      let kanallar = kanal.KomutKullanımKanalİsim;
       if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

        if (!ertum.ConfirmerRoles.some(ertucum => message.member.roles.cache.has(ertucum)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            message.react(red)
            message.reply({ content: `Yeterli yetkin yok!` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
            return
        }

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

    const gorevData = await gorev.findOne({ guildID: message.guild.id, userID: member.user.id });

    const coinData = await coinn.findOne({ guildID: message.guild.id, userID: member.user.id });

    const maxValuee = client.ranks[client.ranks.indexOf(client.ranks.find(x => x.coin >= (coinData ? coinData.coin : 0)))] || client.ranks[client.ranks.length-1];
    let currentRank = client.ranks.filter(x => (coinData ? coinData.coin : 0) >= x.coin);
    currentRank = currentRank[currentRank.length-1];

    const coinStatus = client.ranks.length > 0 ?
    `${currentRank ?`
    ${currentRank !== client.ranks[client.ranks.length-1] ? `Şu an ${Array.isArray(currentRank.role) ? currentRank.role.map(x => `<@&${x}>`).join(", ") : `<@&${currentRank.role}>`} rolündesiniz. ${Array.isArray(maxValuee.role) ? maxValuee.role.length > 1 ? maxValuee.role.slice(0, -1).map(x => `<@&${x}>`).join(', ') + ', ' + maxValuee.role.map(x => `<@&${x}>`).slice(-1) : maxValuee.role.map(x => `<@&${x}>`).join("") : `<@&${maxValuee.role}>`} rolüne ulaşmak için \`${maxValuee.coin-coinData.coin}\` puan daha kazanmanız gerekiyor!` : "Şu an son yetkidesiniz! Emekleriniz için teşekkür ederiz. :)"}` : ` 
    Şuan ${message.member.roles.highest} rolündesiniz. ${Array.isArray(maxValuee.role) ? maxValuee.role.length > 1 ? maxValuee.role.slice(0, -1).map(x => `<@&${x}>`).join(', ') + ', ' + maxValuee.role.map(x => `<@&${x}>`).slice(-1) : maxValuee.role.map(x => `<@&${x}>`).join("") : `<@&${maxValuee.role}>`} rolüne ulaşmak için \`${maxValuee.coin - (coinData ? coinData.coin : 0)}\`  Puan daha kazanmanız gerekiyor!`}` : ""

    const total = gorevData ? gorevData.invite : 0;
    const maxValue = "10"
    const coinStatus1 = client.ranks.length > 0 ?
`**10 Kişiyi Davet Et:** 
${progressBar(gorevData ? gorevData.invite : 0, 10, 10)} \`(${total} / 10)\` 
` : "";
          //
    const kayitgData = await kayitg.findOne({ guildID: message.guild.id, userID: member.user.id });
    const kayittotal = kayitgData ? kayitgData.kayit : 0;
    const maxValue2 = "10"
    const coinStatus2 = client.ranks.length > 0 ?
`**10 Kişi Kaydet:**  
${progressBar(kayitgData ? kayitgData.kayit : 0, 10, 10)} \` (${kayittotal} / 10)\`
` : "";
          //
    const mesajData = await mesaj.findOne({ guildID: message.guild.id, userID: member.user.id });
    const mesajtotal = mesajData ? mesajData.mesaj : 0;
    const maxValue3 = "10"
    const coinStatus3 = client.ranks.length > 0 ?
`**Chat kanalında mesajlaş:**  
${progressBar(mesajData ? mesajData.mesaj : 0, 500, 5)} \`(${mesajtotal} / 500)\`
` : "";
          //
    const tagData = await tagli.findOne({ guildID: message.guild.id, userID: member.user.id });
    const tagTotal = tagData ? tagData.tagli : 0;
    const maxValue4 = "5"
    const coinStatus4 = client.ranks.length > 0 ?
`**5 kişiyi taga davet et:**  
${progressBar(tagData ? tagData.tagli : 0, 5, 5)} \`${tagTotal} / 5\`
` : "";

const yetkiData = await yetkis.findOne({ guildID: message.guild.id, userID: member.user.id });
const yetkiTotal = yetkiData ? yetkiData.count : 0;
const maxValue5 = "5"
const coinStatus5 = client.ranks.length > 0 ?
`**5 kişiyi yetkili yap:**  
${progressBar(yetkiData ? yetkiData.count : 0, 5, 5)} \`${yetkiTotal} / 5\`
` : "";


message.channel.send({ embeds: [ertuembed.setDescription(`
${member.toString()}, (${member.roles.highest}) rolüne ait görevlerin aşağıda belirtilmiştir.  

Kalan Süre: \`${moment.duration(moment().endOf('day').valueOf() - Date.now()).format("H [saat], m [dakika] s [saniye]")}\`
          
${coinStatus1} **Ödül :** ${coin} \`30\` Coin\n
${coinStatus2} **Ödül :** ${coin} \`30\` Coin\n
${coinStatus3} **Ödül :** ${coin} \`30\` Coin\n
${coinStatus4} **Ödül :** ${coin} \`30\` Coin\n
${coinStatus5} **Ödül :** ${coin} \`30\` Coin
${coinStatus} 
`)]})
 },
};

function progressBar (value, maxValue, size)  {
    const progress = Math.round(size * (value / maxValue > 1 ? 1 : value / maxValue));
    const emptyProgress = size - progress > 0 ? size - progress : 0;
  
    const progressText = `${client.emoji("fill")}`.repeat(progress);
    const emptyProgressText = `${client.emoji("empty")}`.repeat(emptyProgress);
  
    return emptyProgress > 0
      ? progress === 0
        ? `${client.emoji("emptystart")}` + progressText + emptyProgressText + `${client.emoji("emptyend")}`
        : `${client.emoji("fillstart")}` + progressText + emptyProgressText + `${client.emoji("emptyend")}`
      : `${client.emoji("efillstart")}` + progressText + emptyProgressText + `${client.emoji("fillend")}`;
  };



  