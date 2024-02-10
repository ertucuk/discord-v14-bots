const { ApplicationCommandOptionType, Formatters } = require("discord.js");

module.exports = {
  name: "denetim",
  description: "Sunucu denetimi",
  category: "OWNER",
  cooldown: 0,
  command: {
    enabled: true,
    aliases: ["d"],
    usage: ".denetim",
  },


  onLoad: function (client) { },

  onCommand: async function (client, message, args, ertuembed) {

    if (!args[0] || !args[0].toLowerCase() === "rol" && !args[0].toLowerCase() === "kanal") return message.channel.send({ embeds: [ertuembed.setDescription(`Lütfen \`rol/kanal\` olmak üzere geçerli bir eylem belirtiniz`)] })
    if (args[0].toLowerCase() === "rol") {
      const audit = await message.guild.fetchAuditLogs({ type: 32 }).then(a => a.entries)
      const denetim = audit.filter(e => !e.executor.bot && Date.now() - e.createdTimestamp < 1000 * 60 * 60 * 3).map(e => ` Rol İsim: ${e.changes.filter(e => e.key === 'name').map(e => e.old)}\n Rol id: ${e.target.id}\n Silen: ${e.executor.tag}\n────────────────────────────────────────────────────────────────────────`)
      if (!denetim.length) return message.channel.send({ embeds: [ertuembed.setDescription(`Son **3** saat de silinmiş herhangi bir rol bulunamadı!`)] })
      let list = global.chunkify(denetim, 10);
      list.forEach(x => {
        message.channel.send(Formatters.codeBlock("js", x.join("\n")));
      })
    } else if (args[0].toLowerCase() === "kanal") {
      const audit = await message.guild.fetchAuditLogs({ type: 12 }).then(a => a.entries)
      const denetim = audit.filter(e => !e.executor.bot && Date.now() - e.createdTimestamp < 1000 * 60 * 60 * 3).map(e => ` Kanal İsim: ${e.changes.filter(e => e.key === 'name').map(e => e.old)}\n Kanal id: ${e.target.id}\n Silen: ${e.executor.tag}\n────────────────────────────────────────────────────────────────────────`)
      if (!denetim.length) return message.channel.send({ embeds: [ertuembed.setDescription(`Son **3** saat de silinmiş herhangi bir kanal bulunamadı!`)] })
      let list = global.chunkify(denetim, 10);
      list.forEach(x => {
        message.channel.send(Formatters.codeBlock("js", x.join("\n")));
      })

    }


  },

};