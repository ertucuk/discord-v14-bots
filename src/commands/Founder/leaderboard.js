const { ApplicationCommandOptionType,EmbedBuilder } = require("discord.js");
const ertum = require("../../Settings/System");
const messageUser = require("../../schemas/messageUser");
const voiceUser = require("../../schemas/voiceUser");
const leaderboard = require("../../schemas/leaderboard");
const moment = require("moment");
module.exports = {
    name: "leaderboard",
    description: "",
    category: "OWNER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: [],
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

        const messageUsersData = await messageUser.find({ guildID: ertum.ServerID }).sort({ topStat: -1 });
        const messageUsers = messageUsersData.splice(0, 10).map((x, index) => `\`${index+1}\` <@${x.userID}>: \`${Number(x.topStat).toLocaleString()} mesaj\``).join(`\n`);
        const voiceUsersData = await voiceUser.find({ guildID: ertum.ServerID }).sort({ topStat: -1 });
        const voiceUsers = voiceUsersData.splice(0, 10).map((x, index) => `\`${index+1}\` <@${x.userID}>: \`${moment.duration(x.topStat).format("H [saat], m [dakika]")}\``).join(`\n`);
    
        const ServerName = client.guilds.cache.get(ertum.ServerID).name
        let LeaderBoard = await client.channels.cache.find(x => x.name == "leaderboard")
      
        const msgList = (`${messageUsers.length > 0 ? messageUsers : "Veri Bulunmuyor."}`)
        const voiceList = (`${voiceUsers.length > 0 ? voiceUsers : "Veri Bulunmuyor."}`)

        let ChatMsg = new EmbedBuilder()
        .setAuthor({ name: client.guilds.cache.get(ertum.ServerID).name, iconURL: client.guilds.cache.get(ertum.ServerID).iconURL({dynamic:true})})
        .setDescription(`🎉 Aşağıdaki tabloda mesaj sıralaması listelenmektedir.\n\n${msgList}\n\nSon Güncellenme Zamanı : <t:${Math.floor(Date.now() / 1000)}:R>`)
        LeaderBoard.send({ embeds: [ChatMsg]}).then(async (tmsg) => {
         await leaderboard.findOneAndUpdate({ guildID: message.guild.id }, { $set: { messageListID: tmsg.id } }, { new: true });
       })

       let Voice = new EmbedBuilder()
       .setAuthor({ name: client.guilds.cache.get(ertum.ServerID).name, iconURL: client.guilds.cache.get(ertum.ServerID).iconURL({dynamic:true})})
       .setDescription(`🎉 Aşağıdaki tabloda ses sıralaması listelenmektedir.\n\n${voiceList}\n\nSon Güncellenme Zamanı: <t:${Math.floor(Date.now() / 1000)}:R>`)
       LeaderBoard.send({ embeds: [Voice]}).then(async (vmsg) => {
        await leaderboard.findOneAndUpdate({ guildID: message.guild.id }, { $set: { voiceListID: vmsg.id } }, { upsert: true });
      }).then(async () => {
      })


     },

    onSlash: async function (client, interaction) { },
  };