const { ApplicationCommandOptionType, PermissionsBitField, EmbedBuilder, parseEmoji, ComponentType } = require("discord.js");

module.exports = {
    name: "emoji",
    description: "",
    category: "NONE",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["uploademoji","emoji-yükle"],
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

if(!message.member.permissions.has(PermissionsBitField.Flags.ManageEmojisAndStickers)) return message.reply({ embeds: [ new EmbedBuilder().setTitle(`Yetki Yetersiz!`).setDescription(`${message.author} bu komutu kullanabilmek için \`Emojileri Yönet\` Yetkisine sahip olmalısın.`)]});


const emoji = args[0];
if(!emoji) return message.reply({ embeds: [ new EmbedBuilder().setDescription(`Bir emoji belirtmelisin.`)]}).delete(5)
let emojiName = args.slice(1).join("_")
if(!emojiName) return message.reply({ embeds: [ new EmbedBuilder().setDescription(`Bir emoji adı belirtmelisin.`)]}).delete(5)

if(emoji.startsWith("https://cdn.discordapp.com/emojis/")) {

let directlyEmoji = await message.guild.emojis.create({ attachment: emoji, name: emojiName || "noname" });

return await message.reply({ embeds: [ new EmbedBuilder().setDescription(`Emoji başarıyla eklendi. ${directlyEmoji}`)]}).delete(10)

}

const parseCustomEmoji = parseEmoji(emoji);
if(!parseCustomEmoji.id) return message.reply({ embeds: [ new EmbedBuilder().setDescription(`Lütfen geçerli bir emoji belirtmelisin.`)]}).delete(5)

const emojiURL = `https://cdn.discordapp.com/emojis/${parseCustomEmoji.id}.${parseCustomEmoji.animated ? "gif" : "png"}`;

const createEmoji = await message.guild.emojis.create({ attachment: emojiURL, name: emojiName || parseCustomEmoji.name });
message.reply({ embeds: [ new EmbedBuilder().setDescription(`Emoji başarıyla oluşturuldu. ${createEmoji}`)]}).delete(10)


     },

    onSlash: async function (client, interaction) { },
  };