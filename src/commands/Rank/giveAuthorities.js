const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const coin = require("../../schemas/coin");
const yetkis = require("../../schemas/yetkis");
const ertum = require("../../Settings/setup.json");
const ertucuk = require("../../Settings/System")
module.exports = {
    name: "yetkialdır",
    description: "",
    category: "NONE",
    cooldown: 0,
    command: {
        enabled: true,
        aliases: ["yetki-aldır"],
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
        if (!ertum.YetkiliAlimDM.some(x => message.member.roles.cache.has(x))) return
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) {
            message.channel.send({ content: "Bir üye belirtmeyi unuttun!" }).then((e) => setTimeout(() => { e.delete(); }, 5000));
            return
        }
        if (!member.user.username.includes(ertum.tag)) {
            message.channel.send({ content: "Bu üyede tagımız bulunmuyor!" }).then((e) => setTimeout(() => { e.delete(); }, 5000));
            return
        }
        const yetkiData = await yetkis.findOne({ guildID: message.guild.id, userID: message.author.id });
        if (yetkiData && yetkiData.yetkis.includes(member.user.id)) {
            message.channel.send({ content: "Bu üyeye zaten daha önce yetki aldırılmış!" }).then((e) => setTimeout(() => { e.delete(); }, 5000));
            return
        }

        const yetkiliembed = new EmbedBuilder()
        .setFooter({text: ertucuk.SubTitle})
        .setDescription(`${member.toString()} üyesi ${message.author} tarafından ${ertum.StartAuthority.map(x => `<@&${x}>`)} rolleri verilerek yetkili yapıldı.`)
        const msg = await message.reply({ embeds: [yetkiliembed]});

        await yetkis.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $push: { yetkis: member.user.id } }, { upsert: true });
        client.channels.cache.find(x => x.name == "yetki_log").wsend({ content: `${message.author} \`(${message.author.id})\` kişisi ${member} \`(${member.id})\` kişisini yetkiye aldı!` })
        member.roles.add(ertum.StartAuthority)
    },

    onSlash: async function (client, interaction) { },
};