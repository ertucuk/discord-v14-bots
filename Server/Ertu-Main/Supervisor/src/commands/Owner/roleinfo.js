const { ApplicationCommandOptionType, EmbedBuilder,PermissionsBitField } = require("discord.js");
const { nokta,star } = require("../../../../../../Global/Settings/Emojis.json")
module.exports = {
    name: "rb",
    description: "Belirttiğiniz rolün bilgilerini alırsınız.",
    category: "ADMIN",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["rolbilgi","rolinfo","rol-bilgi"],
      usage: ".rolbilgi @Role", 
    },

    onLoad: function (client) { },

    onCommand: async function (client, message, args) {

    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    message.channel.send({ content: "Yeterli yetkin bulunmuyor!" }).then((e) => setTimeout(() => { e.delete(); }, 5000));
  }
    let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
    
    if (!args[0]) return message.reply({ content:"Bir rol etiketle!"})
    let members = role.members.map(ertu => `${nokta} <@${ertu.id}> (\`${ertu.id}\`) `)
    let number = role.members.size
    if (number > 200) return message.reply({ content:`${role} rolünde toplam ${number} kişi olduğundan dolayı rol bilgisini yollayamıyorum.`})
    const ertu = new EmbedBuilder()
    .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))
    .setDescription(`
    ${star} __**${role.name} | Rol Bilgileri:**__
    ${nokta} \`Rol Rengi             :\` ${role.hexColor}
    ${nokta} \`Rol ID                :\` ${role.id}
    ${nokta} \`Rol Kişi Sayısı       :\` ${number}

    ${star} __**${role.name} | Roldeki Kişiler:**__
    ${members.join("\n") || "\` Rolde Kimse bulunmuyor. \`"}
    `)

    message.channel.send({embeds: [ertu]})
        
     },

  };