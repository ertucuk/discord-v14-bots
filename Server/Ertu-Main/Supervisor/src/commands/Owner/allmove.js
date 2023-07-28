const { ApplicationCommandOptionType,PermissionsBitField } = require("discord.js");

module.exports = {
    name: "toplutaşı",
    description: "",
    category: "ADMIN",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["toplutası","toplutasi","allmove"],
      usage: ".toplutaşı <taşıyacağınız-kanal>", 
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

      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return

        if (message.member.permissions.has(8n)) {
            let kanal = message.guild.channels.cache.get(args[0]);
            if (kanal) {
         [...kanal.members.values()].forEach((member,index) => {
            setTimeout(async () => {
         await member.voice.setChannel(kanal)
            },index*1500)
            })
            message.channel.send({ content: `**Üyeleri başarılı bir şekilde ${kanal} kanalına taşıdınız!`})
            } else return message.reply({ content:`Doğru kullanım: \`.toplutaşı <taşıyacağınız-kanal>\``});
        }
      




    },

    onSlash: async function (client, interaction) { },
  };