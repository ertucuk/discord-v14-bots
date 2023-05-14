const { ApplicationCommandOptionType,EmbedBuilder } = require("discord.js");
const ertucuk = require("../../Settings/System");

module.exports = {
    name: "spotify",
    description: "",
    category: "NONE",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["spo"],
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

        const presence = message.member.presence.activities.filter(x => x.name === "Spotify")[0];

        if(presence) {    //ertu <3 crane
            const embed = new EmbedBuilder()
            .setAuthor({ name: `${presence.name}`, iconURL: message.member.displayAvatarURL({ dynamic: true })  })
            .setDescription(`**[${presence.assets.largeText}](https://open.spotify.com/intl-tr/track/${presence.party.id.slice("spotify:".length)})** \n **Sanatçı/Grup: ${presence.state}** \n`)
            .setThumbnail(`https://i.scdn.co/image/${presence.assets.largeImage.slice("spotify:".length)}`)
            .setFooter({ text: ertucuk.SubTitle });

            message.reply({ embeds: [embed] });
        }


     },

    onSlash: async function (client, interaction) { },
  };