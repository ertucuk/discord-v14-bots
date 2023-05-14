const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const ertucuk = require("../../Settings/System");

module.exports = {
    name: "cihaz",
    description: "",
    category: "NONE",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["cihazlar"],
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

    onLoad: function (client) { },

    onCommand: async function (client, message, args, embed) {

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        if(!user) return message.reply({ embeds: [ new EmbedBuilder().setFooter({text: ertucuk.SubTitle}).setDescription(`> **Geçerli Bir User Belirt!**`)] }).sil(5);
        if (user.presence == null) return message.reply({ embeds: [ new EmbedBuilder().setFooter({text: ertucuk.SubTitle}).setDescription(`> **Belirtilen User Ofline Durumda Olduğu İçin Kontrol Edilemiyor!**`)] }).sil(5);
        let dev = Object.keys(user.presence.clientStatus)
        let tür = {desktop: "(💻) Bilgisayar / Uygulama",mobile: "(📱) Mobil / Uygulama",web: "(🌐) Web Tarayıcı / İnternet"}
        let tür2 = {online: "(🟢) Çevrimiçi",dnd: "(🔴) Rahatsız Etme",idle: "(🟡) Boşta",offline:"(⚪) Çevrimdışı"}
        message.reply({ embeds: [ new EmbedBuilder().setFooter({text: ertucuk.SubTitle}).setDescription(`**${user} Kullanıcısının Aktif Cihazları!**\n**Durum; \`${tür2[user.presence.status]}\`**\n**Cihazlar; ${dev.map(x => `\`${tür[x]}\``).join("\n")}**`).setThumbnail(user.user.avatarURL({dynamic:true}))] });
     },

    onSlash: async function (client, interaction) { },
  };