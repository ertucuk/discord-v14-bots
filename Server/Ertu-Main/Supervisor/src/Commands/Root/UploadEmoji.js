const { ApplicationCommandOptionType, PermissionsBitField, EmbedBuilder, parseEmoji, ComponentType } = require("discord.js");

module.exports = {
    name: "emoji",
    description: "Sunucuya emoji yüklersiniz.",
    category: "ADMIN",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["uploademoji","emoji-yükle"],
      usage: ".emoji [emoji] [emojiadı]",
    },


    onLoad: function (client) { },

    onCommand: async function (client, message, args) {

if(!message.member.permissions.has(PermissionsBitField.Flags.ManageEmojisAndStickers)) return message.reply({ embeds: [ new EmbedBuilder().setTitle(`Yetki Yetersiz!`).setDescription(`${message.author} bu komutu kullanabilmek için \`Emojileri Yönet\` Yetkisine sahip olmalısın.`)]});
let emoji = args[0];
if (!emoji) return message.reply({content: "Bir Emoji belirtmelisin."})
const parseCustomEmoji = parseEmoji(emoji);
if (parseCustomEmoji.id) {
const emojiLink = `https://cdn.discordapp.com/emojis/${parseCustomEmoji.id}.${
parseCustomEmoji.animated ? 'gif' : 'png'
  }`;
  const createEmoji = await message.guild.emojis.create({ attachment: emojiLink, name: parseCustomEmoji.name});
  message.reply({
  content: `${createEmoji} emojisi sunucuya eklendi.`,
    });
   } else {
    message.reply({content: "Emoji bulunamadı."})
}
}
}