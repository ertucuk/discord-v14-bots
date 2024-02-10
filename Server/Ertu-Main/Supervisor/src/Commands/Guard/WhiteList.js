const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const guard = require("../../../../../Ertu-Guard/Schemas/Guard");

module.exports = {
    name: "güvenli-liste",
    description: "Güvenli listedeki üyelere bakarsınız.",
    category: "OWNER",
    cooldown: 0,
    command: {
        enabled: true,
        aliases: ["gw", "gl"],
        usage: ".güvenli-liste",
    },


    onLoad: function (client) { },

    onCommand: async function (client, message, args, ertuembed) {

        const guardWhitelistData = await guard.findOne({ guildID: message.guild.id });
        var full = guardWhitelistData ? guardWhitelistData.SafedMembers : global.system.BotsOwners
        var server = guardWhitelistData ? guardWhitelistData.serverSafedMembers : global.system.BotsOwners
        var roles = guardWhitelistData ? guardWhitelistData.roleSafedMembers : global.system.BotsOwners
        var channels = guardWhitelistData ? guardWhitelistData.channelSafedMembers : global.system.BotsOwners
        var banAndkick = guardWhitelistData ? guardWhitelistData.banKickSafedMembers : global.system.BotsOwners
        var emojiAndSticker = guardWhitelistData ? guardWhitelistData.emojiStickers : global.system.BotsOwners
        var chatGuard = guardWhitelistData ? guardWhitelistData.chatGuard : global.system.BotsOwners
        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))
                    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                    .setDescription(`**${global.system.BotsOwners.map(x => `${x}`).map(x => `<@${x}>`).join(", ")} tarafından \`${message.guild.name}\` sunucusu için yapılmış __Guard (Koruma)__ sisteminin sunucuda ki her yetki kategorisi için yapılmış olan korumalar ve korumalardan etkilenmicekler kişilerin bulunduğu listeler aşağıda verilmiştir.**`)
                    .setFields(
                        [
                            { name: "Full:", value: `Sunucuda Taç sahibi seviyesinde tam erişime sahip olan kişiler;\n${full.map(x => `<@${x}>`).join(", ")}`, inline: false },
                            { name: "Sunucuyu Yönet:", value: `Sunucu profiline tam erişim iznine sahip olan kişiler;\n ${server.map(x => `<@${x}>`).join(", ")}`, inline: false },
                            { name: "Rolleri Yönet:", value: `Sunucuda ki rollere tam erişim iznine sahip olan kişiler;\n ${roles.map(x => `<@${x}>`).join(", ")}`, inline: false },
                            { name: "Kanalları Yönet:", value: `Sunucu Kanallara tam erişim iznine sahip olan kişiler;\n${channels.map(x => `<@${x}>`).join(", ")}`, inline: false },
                            { name: "Emoji/Sticker Yönet:", value: `Sunucuda Emoji/Stickerlara tam erişim iznine sahip olan kişiler;\n ${emojiAndSticker.map(x => `<@${x}>`).join(", ")}`, inline: false },
                            { name: "Ban&Kick:", value: `Sunucuda ki kullanıcılara sağ tık ban ve kick iznine tam erişimi olan kişiler;\n${banAndkick.map(x => `<@${x}>`).join(", ")}`, inline: false },
                            { name: "Chat Guard:", value: `Sunucuda chatte  tam erişimi olan kişiler;\n${chatGuard.map(x => `<@${x}>`).join(", ")}`, inline: false },
                        ]
                    )
            ]
        })
    },
};