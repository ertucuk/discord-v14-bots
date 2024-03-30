const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder,ButtonStyle } = require("discord.js");
const kanal = require("../../../../../../Global/Settings/AyarName");
const CoinDb = require("../../../../../../Global/Schemas/ekonomi");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const ertucuk = require("../../../../../../Global/Settings/System");

module.exports = {
    name: "removebalance",
    description: "Belirttiğiniz kullanıcının hesabından para alırsınız",
    category: "EKONOMI",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["balremove","bal-remove","ballrev","coinsil"],
      usage: ".removebalance <@user/ID> <Miktar>", 
    },
  

    onLoad: function (client) { },

    onCommand: async function (client, message, args, ertuembed) {

    if(!ertum.OwnerRoles.some(ertucum => message.member.roles.cache.has(ertucum)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!member) return message.reply({content: `Geri almak istediğiniz bi üyeyi belirtin.`}).delete(10)

    let coinVeri = await CoinDb.findOne({ guildID: message.guild.id, userID: member.user.id });  
    if(!coinVeri) coinVeri = await CoinDb.findOneAndUpdate({guildID:message.guild.id,userID:member.id},{$set:{coin:1000,beklemeSuresi:Date.now(),gameSize:0,profilOlusturma:Date.now(),hakkimda:"Girilmedi",evlilik:false,evlendigi:undefined,dailyCoinDate:(Date.now() - 86400000)}},{upsert:true, new:true})

    let miktar = Number(args[1]);
    if(isNaN(miktar)) return message.reply({ content: `Geri almak istediğiniz miktarı rakam olarak girin.`}).delete(10)

    miktar = miktar.toFixed(0);
    if(miktar <= 0) return message.reply({content: `Geri almak rakam birden küçük veya sıfır olamaz.`}).delete(10)

    await CoinDb.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { coin: -miktar } }, { upsert: true });
     message.react(`${client.emoji("ertu_onay")}`)
    message.channel.send({embeds: [ertuembed.setDescription(`${client.emoji("ertu_onay")} ${member} üyesinden başarıyla \`${numberWithCommas(miktar)} ${ertucuk.Server} Parası\` geri aldın.`)]})
     },
  };

function numberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}