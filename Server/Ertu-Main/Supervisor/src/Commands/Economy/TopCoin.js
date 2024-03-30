const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder,ButtonStyle } = require("discord.js");
const kanal = require("../../../../../../Global/Settings/AyarName");
const Coin = require("../../../../../../Global/Schemas/ekonomi");
const ertucuk = require("../../../../../../Global/Settings/System");

module.exports = {
    name: "topcoin",
    description: "Coin sıralamasını gösterir",
    category: "EKONOMI",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["cointop","parasiralamasi"],
      usage: ".topcoin", 
    },
  

    onLoad: function (client) { },

    onCommand: async function (client, message, args, ertuembed) {

    let channels = ["bot-commands","coin","coin-chat"]
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !channels.includes(message.channel.name)) return message.reply({ content: `${channels.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

    const topCoinData =  await Coin.find({guildID: message.guild.id});
    const topCoin = topCoinData.filter(x => message.client.users.cache.get(x.userID)).sort((a, b) => b.coin - a.coin).slice(0, 20).map((x, index) => `${x.userID === message.author.id ? `${client.sayıEmoji(index+1)} <@${x.userID}>: \`${Number(x.coin).toLocaleString()} ${ertucuk.Server} Parası\` **(Siz)**` : `${client.sayıEmoji(index+1)}  <@${x.userID}>: \`${Number(x.coin).toLocaleString()} ${ertucuk.Server} Parası\``}`).join("\n"); 

    const coin = `**Aşağıda ki sıralamada para bazından 20 üye aşağıda listelenmektedir.** \n\n${topCoin.length > 0 ? topCoin : "Veri Bulunmuyor."}`; 
    const embed = new EmbedBuilder()
    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
    .setDescription(`${coin}`)
    message.reply({embeds: [embed]})
     },
  };
