const { ApplicationCommandOptionType, EmbedBuilder , PermissionsBitField, Embed } = require("discord.js");
const registerData  = require("../../schemas/registerStats");

module.exports = {
    name: "taglıalım",
    description: "",
    category: "OWNER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["taglı-alım"],
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

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return message.channel.send({ embeds: [ new EmbedBuilder().setDescription(`${message.member}, Bu komutu kullanmak için gerekli yetkiye sahip değilsin!`)] });
        let data = await registerData.findOne({ guildID: message.guild.id })
        if(!data) new registerData({guildID: message.guild.id, tagMode: false}).save();
        switch (args[0]) {
            case "aç":
                if (data && data.tagMode === true) return message.channel.send({ embeds: [ new EmbedBuilder().setDescription(`${red} taglı alım modu zaten aktif!`)] });
                data.tagMode = true;
                data.save();
                message.channel.send({ embeds: [ new EmbedBuilder().setDescription(`Taglı alım modu başarıyla aktif edildi!`)] });
                break;
            case "kapat":
                if (data && data.tagMode === false) return message.channel.send({ embeds: [ new EmbedBuilder().setDescription(`${red} taglı alım modu zaten kapalı!`)] });
                data.tagMode = false;
                data.save();
                message.channel.send({ embeds: [ new EmbedBuilder().setDescription(`Taglı alım modu başarıyla deaktif edildi!`)] });
                break;
            default:
                message.channel.send({ embeds: [ new EmbedBuilder().setDescription(`${message.member} Hatalı kullanım! \`\`\`.taglıalım aç/kapat\`\`\``)] });
                break;
        }


     },

    onSlash: async function (client, interaction) { },
  };