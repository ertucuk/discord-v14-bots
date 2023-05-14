const { ApplicationCommandOptionType, EmbedBuilder,PermissionsBitField } = require("discord.js");
const nameData = require("../../schemas/names")
const ertum = require("../../Settings/setup.json");
const { red , green } = require("../../Settings/Emojis.json");
const ertucuk = require("../../Settings/System");

module.exports = {
    name: "names",
    description: "",
    category: "NONE",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["isimler"],
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
        if(!ertum.ConfirmerRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
        {
        message.reply({ content:`Yeterli yetkin yok!`}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        const data = await nameData.findOne({ guildID: message.guild.id, userID: member.user.id });
       
        const ertu = new EmbedBuilder()
        .setAuthor({ name: `❗ ${member.user.username} adlı kullanıcının isim geçmişi;`})
        .setFooter({text: `Toplamda ${data ? `${data.names.length}` : "0"} kere ismi değiştirilmiş.`})
        .setDescription(`
        ${data ? data.names.splice(0, 20).map((x, i) => `\` ${i + 1} \` [<t:${Math.floor(x.date / 1000)}:R>] - \` ${x.name} \`  - (${x.rol}) - (<@${x.yetkili}>)`).join("\n") : "Bu kullanıcının isim geçmişi bulunmuyor!"}
        `)
        message.channel.send({ embeds: [ertu], ephemeral: false });

     },

    onSlash: async function (client, interaction) { },
  };