const { ApplicationCommandOptionType, EmbedBuilder,PermissionsBitField } = require("discord.js");
const ertucuk = require("../../../../../../Global/Settings/System");
const kanal = require("../../../../../../Global/Settings/AyarName");

module.exports = {
    name: "cihaz",
    description: "Kullanıcın hangi cihazda olduğunu gösterir.",
    category: "USER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["cihazlar"],
      usage: ".cihazlar", 
    },
 

    onLoad: function (client) { },

    onCommand: async function (client, message, args, embed) {

      let kanallar = kanal.KomutKullanımKanalİsim;
     if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        if(!user) return message.reply({ embeds: [ new EmbedBuilder().setFooter({text: ertucuk.SubTitle}).setDescription(`**Geçerli Bir User Belirt!**`)] })
        if (user.presence == null) return message.reply({ embeds: [ new EmbedBuilder().setFooter({text: ertucuk.SubTitle}).setDescription(`**Belirtilen User Ofline Durumda Olduğu İçin Kontrol Edilemiyor!**`)] })
        let dev = Object.keys(user.presence.clientStatus)
        let tür = {desktop: "(💻) Bilgisayar / Uygulama",mobile: "(📱) Mobil / Uygulama",web: "(🌐) Web Tarayıcı / İnternet"}
        let tür2 = {online: "(🟢) Çevrimiçi",dnd: "(🔴) Rahatsız Etme",idle: "(🟡) Boşta",offline:"(⚪) Çevrimdışı"}
        message.reply({ embeds: [ new EmbedBuilder().setFooter({text: ertucuk.SubTitle}).setDescription(`**${user} Kullanıcısının Aktif Cihazları!**\n**Durum; \`${tür2[user.presence.status]}\`**\n**Cihazlar; ${dev.map(x => `\`${tür[x]}\``).join("\n")}**`).setThumbnail(user.user.avatarURL({dynamic:true}))] });
     },

  };