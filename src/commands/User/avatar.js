const { ApplicationCommandOptionType,ActionRowBuilder,ButtonBuilder,ButtonStyle } = require("discord.js");
const ertucuk = require("../../Settings/System");

module.exports = {
    name: "avatar",
    description: "kullanıcının avatarını gösterir.",
    category: "NONE",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["av"],
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
if (!message.guild) return;

let member = args.length > 0 ? message.mentions.users.first() || await client.users.fetch(args[0]) || message.author : message.author
let Link = new ActionRowBuilder({components:[new ButtonBuilder({label:"Tarayıcıda Aç", style:ButtonStyle.Link, url: member.displayAvatarURL({dynamic:true})})]})
let msg = await message.channel.send({ content: `${member.displayAvatarURL({ dynamic: true, size: 4096 })}`, components: [Link] })
     },

    onSlash: async function (client, interaction) { },
  };