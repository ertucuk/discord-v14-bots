const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const ertucuk = require("../../Settings/System");

module.exports = {
    name: "yardım",
    description: "",
    category: "NONE",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["y","help","h"],
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

    onCommand: async function (client, message, args) {

    message.reply({ embeds: [ new EmbedBuilder().setFooter({text: ertucuk.SubTitle}).setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 })).setDescription(`
    
    **ertu#1000** tarafından \`${message.guild.name}\` sunucusuna yapılmış botun komutları aşağıda verilmiştir.

\`.botsettings
.eval
.leaderboard
.cezabuton
.reload
.setup
.taglıalım
.emojiyükle
.yaz
.ysay
.kontrol
.kilit
.perm <@Ertu/Id>
.sıfırla <@Ertu/Id>
.tagsay
.ban <@Ertu/Id>
.banliste
.forceban <@Ertu/Id>
.jail <@Ertu/Id>
.mute <@Ertu/Id>
.cezapuan 
.cezasorgu
.sicil 
.unban <@Ertu/Id>
.unjail <@Ertu/Id>
.unmute <@Ertu/Id>
.vmute <@Ertu/Id>
.warn <@Ertu/Id>
.yetkialdır <@Ertu/Id>
.tagaldır <@Ertu/Id>
.isim <@Ertu/Id>
.isimler <@Ertu/Id>
.kayıt <@Ertu/Id>
.kayıtsız <@Ertu/Id>
.say
.sil
.snipe
.invite
.me
.top
.afk
.avatar
.banner
.booster
.çek
.spotify
.özel-komut
.git
.help
.link
.profil
.ship
\`
`)]})

     },

    onSlash: async function (client, interaction) { },
  };