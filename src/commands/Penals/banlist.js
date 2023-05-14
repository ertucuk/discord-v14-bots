const { ApplicationCommandOptionType, PermissionsBitField } = require("discord.js");
const ertucuk = require("../../Settings/System");

module.exports = {
    name: "banliste",
    description: "",
    category: "NONE",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["banlist","yargıliste","yargılist","ban-liste"],
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
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers) &&  !ertum.BanHammer.some(x => message.member.roles.cache.has(x))) { message.channel.send({ content:"Yeterli yetkin bulunmuyor!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
        return }
        const ban = await message.guild.bans.fetch();
        if (!ban) { message.channel.send({ content: "Sunucuda Banlı üye bulunmamaktır."}).then((e) => setTimeout(() => { e.delete(); }, 5000));
        return }
        message.guild.bans.fetch().then(ertucuk => {
        let list = ertucuk.map(user => `Kullanıcı ID:       | Kullanıcı Adı:\n${user.user.id} | ${user.user.tag}`).join('\n');
        message.channel.send({ content:`\`\`\`js\n${list}\n\nSunucuda toplamda ${ertucuk.size} yasaklı kullanıcı bulunmakta.\n\`\`\``})
        })
     },

    onSlash: async function (client, interaction) { },
  };