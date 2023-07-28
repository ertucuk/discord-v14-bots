const { ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField } = require("discord.js");
const canvafy = require("canvafy");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const ertucuk = require("../../../../../../Global/Settings/System");

module.exports = {
    name: "ship",
    description: "Random veya belirttiğiniz üyeyi shipler",
    category: "USER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["lulusik", "ertusorryman"],
      usage: ".ship",
    },
    slashCommand: {
      enabled: true,
      options: [
        {
            name: "otuzbir",
            description: "31 komutu yapmayanın",
            type: ApplicationCommandOptionType.Subcommand,
        },
      ],
    },

    onLoad: function (client) { },

    onCommand: async function (client, message, args) { 

        let channels = ["bot-commands","ship-chat","ship"]
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !channels.includes(message.channel.name)) return message.reply({ content: `${channels.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

        const ertuman = ertum.ManRoles[0];
        const ertuwoman = ertum.GirlRoles[0];
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.filter(m => m.user.bot === false && message.member.roles.cache.has(ertuman) ? m.roles.cache.get(ertuwoman) : m.roles.cache.get(ertuman)).random();
        
        const ship = await new canvafy.Ship()
        .setAvatars(message.author.displayAvatarURL({ forceStatic: true, extension: 'png' }) , member.user.displayAvatarURL({ forceStatic: true, extension: 'png' }))
        .setBorder("#b0324a")
        .setOverlayOpacity(0.31)
        .setBackground("image", `${message.guild.bannerURL({extension:"png",size:2048}) !== null ? message.guild.bannerURL({extension:"png",size:2048}) : ertucuk.BackGround}`)
        .build()

        const attachment = ship
        
        message.channel.send({
          content:`>>> **${message.author.tag}** seni **${member.user.tag}** çok mu seviyor?`,
            files: [{
                attachment: attachment,
                name: `ship-${message.author.id}.png`
            }]
        });

    },

    onSlash: async function (client, interaction) {

        const presence = interaction.member.presence.activities.filter(x => x.name === "Spotify")[0];

        if(presence) {    
            const embed = new EmbedBuilder()
            .setAuthor({ name: `${presence.name}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true })  })
            .setDescription(`**[${presence.assets.largeText}](https://open.spotify.com/intl-tr/track/${presence.party.id.slice("spotify:".length)})** \n **Sanatçı/Grup: ${presence.state}** \n`)
            .setThumbnail(`https://i.scdn.co/image/${presence.assets.largeImage.slice("spotify:".length)}`)
            .setFooter({ text: `<3` });

            interaction.reply({ embeds: [embed] });
        }
     },
  };