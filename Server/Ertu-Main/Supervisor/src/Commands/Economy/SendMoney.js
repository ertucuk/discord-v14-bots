const { ApplicationCommandOptionType, EmbedBuilder,PermissionsBitField  } = require("discord.js");
const Coin = require("../../../../../../Global/Schemas/ekonomi");
const kanal = require("../../../../../../Global/Settings/AyarName");
const ertucuk = require("../../../../../../Global/Settings/System");

module.exports = {
    name: "paragönder",
    description: "Belirttiğiniz kullanıcıya para gönderirsiniz.",
    category: "EKONOMI",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["para-gönder","money-send", "moneysend"],
      usage: ".paragönder <@user/ID>", 
    },
  

    onLoad: function (client) { },

    onCommand: async function (client, message, args, ertuembed) {

      let channels = ["bot-commands","coin","coin-chat"]
      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !channels.includes(message.channel.name)) return message.reply({ content: `${channels.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!member) return message.reply({content: `Bir üye etiketle ve tekrardan dene.`});

    if (member.id === message.author.id) return message.reply({ content: "Kendine para gönderemezsin." });
	let betCoin = Number(args[1]);
	if (!betCoin || !Number(args[1])) return message.reply({content: `Göndermek istediğin para miktarını girmelisin!`});

    let data1 = await Coin.findOne({userID: member.id});
    let data2 = await Coin.findOne({userID: message.author.id});
    if (data2.coin < betCoin) return message.reply({ content: "Hesabında belirttiğin kadar para yok!" })

    if (!data1) {
        message.reply({
        embeds:[ertuembed.setDescription(`${member} kullanıcısının **Coin** profili bulunmamaktadır.`)]
        });
    } else {
        await Coin.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: -betCoin } }, { upsert: true });
        message.reply({
            content: `Belirttiğin **${member}** kişisine başarıyla **${numberWithCommas(betCoin)}** miktar \`${ertucuk.Server} Parası\` gönderdin!`,
        });
        member.send({embeds: [new EmbedBuilder().setTitle("Hesabınıza Para Geldi!").setDescription(`${message.member} kullanıcısı sizin bankanıza **${numberWithCommas(betCoin)}** \`${ertucuk.Server} Parası\` gönderdi!`)]});
        await Coin.findOneAndUpdate({ guildID: message.guild.id, userID: member.id }, { $inc: { coin: +betCoin } }, { upsert: true });
    }
  },
};

  
function numberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}