const { ApplicationCommandOptionType,EmbedBuilder,ActivityType,PermissionsBitField } = require("discord.js");
const ertucuk = require("../../../../../../Global/Settings/System");
const kanal = require("../../../../../../Global/Settings/AyarName");

module.exports = {
    name: "spotify",
    description: "Kullanıcının hangi şarkıyı dinlediğini gösterir.",
    category: "USER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["spo"],
      usage: ".spotify", 
    },
  
    onLoad: function (client) { },

    onCommand: async function (client, message, args,ertuembed) {

      let kanallar = kanal.KomutKullanımKanalİsim;
     if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        if (member && member.presence && member.presence.activities && member.presence.activities.some(ertucum => ertucum.name == "Spotify" && ertucum.type == ActivityType.Listening)) {
          let status = await member.presence.activities.find(ertucum => ertucum.type == ActivityType.Listening);
            const embed = new EmbedBuilder()
            .setAuthor({ name: `${status.name}`, iconURL: message.member.displayAvatarURL({ dynamic: true })  })
            .setDescription(`**[${status.assets.largeText}](https://open.spotify.com/intl-tr/track/${status.party.id.slice("spotify:".length)})** \n **Sanatçı/Grup: ${status.state}** \n`)
            .setThumbnail(`https://i.scdn.co/image/${status.assets.largeImage.slice("spotify:".length)}`)
            .setFooter({ text: ertucuk.SubTitle });

            message.reply({ embeds: [embed] });
          }else{ return message.reply({content:`Kullanıcı şarkı dinlemiyor.`}).then((e) => setTimeout(() => { e.delete(); }, 5000));
        }


     },

  };