const { ApplicationCommandOptionType,EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField  } = require("discord.js");
const moment = require("moment");
moment.locale("tr");
const client = global.bot;
const ertucuk = require("../../../../../../Global/Settings/System");
const kanal = require("../../../../../../Global/Settings/AyarName");

module.exports = {
    name: "git",
    description: "Belirttiğiniz kullanıcının yanına gidersiniz.",
    category: "USER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: [],
      usage: ".git <@user/ID>",
    },
 

    onLoad: function (client) { },

    onCommand: async function (client, message, args) {

      let kanallar = kanal.KomutKullanımKanalİsim;
     if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 
        
     let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

     if (!message.member.voice.channel) { return message.reply({ content: "Bir ses kanalında değilsin!" });}
     if (!member) {return message.reply({ content: "Bir üye etiketlemeyi unuttun!" });}
     if (!member.voice.channel) {return message.reply({ content: "Bu kullanıcı herhangi bir ses kanalında değil!" });}
     if (message.member.voice.channel === member.voice.channel) {return message.reply({ content: "Zaten aynı kanaldasınız!" });}
   
    
      const row = new ActionRowBuilder()
      .addComponents(
      
      new ButtonBuilder()
      .setCustomId("onay")
      .setLabel("ÇEK")
      .setStyle(ButtonStyle.Success),
      
      new ButtonBuilder()
      .setCustomId("red")
      .setLabel("ÇEKME")
      .setStyle(ButtonStyle.Danger)
      );

      const row2 = new ActionRowBuilder()
      .addComponents(
      new ButtonBuilder()
      .setCustomId("onay2")
      .setLabel("ÇEK")
      .setStyle(ButtonStyle.Success)
      .setDisabled(true),
    
      new ButtonBuilder()
      .setCustomId("red2")
      .setLabel("ÇEKME")
      .setStyle(ButtonStyle.Danger)
      .setDisabled(true),
      );

  if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    message.member.voice.setChannel(member.voice.channel.id)
    message.reply({content:`${message.author}, ${member} kişisinin yanına sizi başarıyla taşıdım.`});
} else {    

let msg = await message.channel.send({ content: `${member}, ${message.author} \`${message.member.voice.channel.name}\` odasına gelmek istiyor. Onaylıyor musun?`,components: [row] })
var filter = button => button.user.id === member.user.id;
let collector = await msg.createMessageComponentCollector({ filter, time: 30000 })

collector.on("collect", async (button) => {

if(button.customId === "onay") {
await button.deferUpdate();
message.member.voice.setChannel(member.voice.channel.id)
msg.edit({content:`${member}, ${message.author} \`${message.member.voice.channel.name}\` odasına gelmek istiyor. Onaylıyor musun?\n\`Kullanıcı odaya çekildi.\``, components: [row2] })
}

if(button.customId === "red") {
await button.deferUpdate();
msg.edit({contetnt: `${member}, ${message.author} \`${message.member.voice.channel.name}\` odasına gelmek istiyor. Onaylıyor musun?\n\`Kullanıcı işlemi reddetti.\``,components: [row2]})
}
});
}
},
  };