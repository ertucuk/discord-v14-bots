const { ApplicationCommandOptionType,ActionRowBuilder,ButtonBuilder,ButtonStyle ,PermissionsBitField} = require("discord.js");
const kanal = require("../../../../../../Global/Settings/AyarName");

module.exports = {
    name: "avatar",
    description: "Kullanıcının avatarını gösterir.",
    category: "USER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["av"],
      usage: ".avatar",
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

let kanallar = kanal.KomutKullanımKanalİsim;
if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

let member = args.length > 0 ? message.mentions.users.first() || await client.users.fetch(args[0]) || message.author : message.author
let Link = new ActionRowBuilder({components:[new ButtonBuilder({label:"Tarayıcıda Aç", style:ButtonStyle.Link, url: member.displayAvatarURL({dynamic:true})})]})
let msg = await message.channel.send({ content: `${member.displayAvatarURL({ dynamic: true, size: 4096 })}`, components: [Link] })
     },

    onSlash: async function (client, interaction) { },
  };