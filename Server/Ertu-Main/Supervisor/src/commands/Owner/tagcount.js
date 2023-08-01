const { ApplicationCommandOptionType,PermissionsBitField,EmbedBuilder } = require("discord.js");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const ertucuk = require("../../../../../../Global/Settings/System");

module.exports = {
    name: "tagsay",
    description: "Tagdaki üyeleri listeler.",
    category: "ADMIN",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: [],
      usage: ".tagsay",
    },

    onLoad: function (client) { },

    onCommand: async function (client, message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            message.channel.send({ content: "Yeterli yetkin bulunmuyor!" }).then((e) => setTimeout(() => { e.delete(); }, 5000));
            return    
        }
        const ServerTag = args.slice(0).join(" ") || ertum.ServerTag;
        let page = 1;
        const memberss = message.guild.members.cache.filter((member) => member.user.displayName.includes(ServerTag) && !member.user.bot);
        let liste = memberss.map((member) => `${member} - \`${member.id}\``) || `**${ServerTag}** taglı kullanıcı yok`
        var msg = await message.channel.send({ embeds: [new EmbedBuilder().setFooter({text: ertucuk.SubTitle}).setDescription(`Kullanıcı adında **${ServerTag}** tagı olan **${memberss.size}** kişi bulunuyor:\n\n ${liste.slice(page == 1 ? 0 : page * 40 - 40, page * 40).join('\n')}`)] });
        if (liste.length > 40) {
            await msg.react(`⬅️`);
            await msg.react(`➡️`);
            let collector = msg.createReactionCollector((react, user) => ["⬅️", "➡️"].some(e => e == react.emoji.name) && user.id == message.member.id, { time: 200000 });
            collector.on("collect", (react) => {
                if (react.emoji.name == "➡️") {
                    if (liste.slice((page + 1) * 40 - 40, (page + 1) * 40).length <= 0) return;
                    page += 1;
                    let tagsay = liste.slice(page == 1 ? 0 : page * 40 - 40, page * 40).join("\n");
                    msg.edit({ embeds: [new EmbedBuilder().setDescription(`Kullanıcı adında **${ServerTag}** tagı olan **${memberss.size}** kişi bulunuyor:\n\n${tagsay}`)] });
                    react.users.remove(message.author.id)
                }
                if (react.emoji.name == "⬅️") {
                    if (liste.slice((page - 1) * 40 - 40, (page - 1) * 40).length <= 0) return;
                    page -= 1;
                    let tagsay = liste.slice(page == 1 ? 0 : page * 40 - 40, page * 40).join("\n");
                    msg.edit({ embeds: [new EmbedBuilder().setDescription(`Kullanıcı adında **${ServerTag}** tagı olan **${memberss.size}** kişi bulunuyor:\n\n${tagsay}`)] });
                    react.users.remove(message.author.id)
                }
            })
        }

     },

  };