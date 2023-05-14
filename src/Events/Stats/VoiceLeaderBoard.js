const ertucuk = require("../../Settings/System")
const voiceUser = require("../../schemas/voiceUser");
const ertum = require("../../schemas/leaderboard");
const moment = require("moment");
const { EmbedBuilder } = require("discord.js");
const client = global.client;

client.on("ready", async () => {

    const voiceUsersData = await voiceUser.find({ guildID: ertucuk.ServerID }).sort({ topStat: -1 });
    const voiceUsers = voiceUsersData.splice(0, 10).map((x, index) => `\` ${index+1} \` <@${x.userID}>: \`${moment.duration(x.topStat).format("H [saat], m [dakika]")}\``).join(`\n`);
  
    let data = await ertum.findOne({ guildID: ertucuk.ServerID })
    if (!data || data && !data.voiceListID.length) return
  
    const sunucuisim = client.guilds.cache.get(ertucuk.ServerID).name
    let LeaderBoard = await client.channels.cache.find(x => x.name == "leaderboard").messages.fetch(data.voiceListID);
    setInterval(() => {
    checkingLeader()
    }, 600000);
    function checkingLeader() {  
    const voiceList = (`${voiceUsers.length > 0 ? voiceUsers : "Veri Bulunmuyor."}`)
  
    let MessageEdit = new EmbedBuilder()
    .setAuthor({ name: client.guilds.cache.get(ertucuk.ServerID).name, iconURL: client.guilds.cache.get(ertucuk.ServerID).iconURL({dynamic:true})})
    .setDescription(`🎉 Aşağı da \`${sunucuisim}\` sunucusunun genel ses sıralaması listelenmektedir.\n\n${voiceList}\n\nGüncellenme Tarihi: <t:${Math.floor(Date.now() / 1000)}:R>`)
    LeaderBoard.edit({ embeds: [MessageEdit]})
  
  }



})
