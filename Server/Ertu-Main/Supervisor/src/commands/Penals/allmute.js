const { ApplicationCommandOptionType,PermissionsBitField } = require("discord.js");

module.exports = {
    name: "allmute",
    description: "Ses kanalındaki herkesi susturur.",
    category: "PENAL",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: [],
      usage: ".allmute", 
    },

    onLoad: function (client) { },

    onCommand: async function (client, message, args, ertuembed) {

        client.wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return
        let channel = message.guild.channels.cache.get(args[0]) || message.member.voice.channel;
        if (!message.member.voice.channel) return message.reply({ embeds: [ertuembed.setDescription(`Bir Ses Kanalında Değilsin!`)] }).then((e) => setTimeout(() => { e.delete(); }, 5000));
        if (!channel) return message.channel.send({ content:"Bir kanal ID girmeli ya da bir sesli kanalda bulunmalısın!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
        channel.members.filter((x) => !x.permissions.has(PermissionsBitField.Flags.ViewChannel))
        .forEach((x, index) => {
          client.wait(index * 1000);
          x.voice.setMute(true);
        });
     message.react(green)
    message.reply({ content:`\`${channel.name}\` kanalındaki tüm üyeler susturuldu!`}).then((e) => setTimeout(() => { e.delete(); }, 10000));
  



     },

  };