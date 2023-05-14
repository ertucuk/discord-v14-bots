const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const moment = require("moment");

module.exports = {
    name: "botsettings",
    description: "",
    category: "OWNER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["botsetting"],
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
        if(!args[0]) return message.reply({ content: `Hata yaptın! Bir seçim belirtmelisin! \`sunucupp , sunucubanner , sunucuisim , botpp , botisim\``, ephemeral: true })
        if(args[0] === "sunucupp")
        { 
        message.attachments.forEach(attachment => {
        const url = attachment.url;
        message.guild.setIcon(url)
        });
        message.reply({ content: `Başarılı bir şekilde sunucu resmi değiştirilmiştir!`, ephemeral: true })
        console.log(`${message.author.tag} (${message.author.id}) tarafından ${moment(message.createdAt).format("lll")} zamanında sunucu resmi değiştirildi!`)
        }
        if(args[0] === "sunucubanner")
        { 
        message.attachments.forEach(attachment => {
        const url = attachment.url;
        message.guild.setIcon(url)
        });
        message.reply({ content: `Başarılı bir şekilde sunucu afişi değiştirilmiştir!`, ephemeral: true })
        console.log(`${message.author.tag} (${message.author.id}) tarafından ${moment(message.createdAt).format("lll")} zamanında sunucu afişi değiştirildi!`)
        }
        if(args[0] === "sunucuisim") 
        {
        let isim = args.slice(1).join(" ")
        message.guild.setName(isim)
        message.reply({ content: `Başarılı bir şekilde sunucu ismi \`${isim}\` olarak değiştirildi!`, ephemeral: true })
        console.log(`${message.author.tag} (${message.author.id}) tarafından ${moment(message.createdAt).format("lll")} zamanında sunucu ismi \`${isim}\` olarak değiştirildi!`)
        }
        if(args[0] === "botpp")
        { 
        message.attachments.forEach(attachment => {
        const url = attachment.url;
        if(!url) return message.reply({ content: `Bir bot fotoğrafı seçmelisin!`, ephemeral: true })
        client.user.setAvatar(url);
        });
        message.reply({ content: `Başarılı bir şekilde bot profili değiştirilmiştir!`, ephemeral: true })
        console.log(`${message.author.tag} (${message.author.id}) tarafından ${moment(message.createdAt).format("lll")} zamanında bot profili değiştirildi!`)
        }
        if(args[0] === "botisim") 
        {
        let isim = args.slice(1).join(" ")
        client.user.setUsername(isim)
        message.reply({ content: `Başarılı bir şekilde bot ismi \`${isim}\` olarak değiştirildi!`, ephemeral: true })
        console.log(`${message.author.tag} (${message.author.id}) tarafından ${moment(message.createdAt).format("lll")} zamanında bot ismi \`${isim}\` olarak değiştirildi!`)
        }

     },

    onSlash: async function (client, interaction) { },
  };