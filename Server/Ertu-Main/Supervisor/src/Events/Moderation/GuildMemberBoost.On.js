const { EmbedBuilder, Events } = require("discord.js");
const ertum = require('../../../../../../Global/Settings/Setup.json');
const system = require('../../../../../../Global/Settings/System');
const coinDB = require("../../../../../../Global/Schemas/ekonomi");

client.on("guildMemberBoost", async (member) => {
await coinDB.findOneAndUpdate({ guildID: system.ServerID, userID: member.id }, { $inc: { coin: 1000000 } }, { upsert: true })
if (ertum.ChatChannel && client.channels.cache.has(ertum.ChatChannel)) client.channels.cache.get(ertum.ChatChannel)
.send({
content:
`${member}, Sunucumuza takviye yaptığınız için teşekkür ederiz.
Bizde sana ufak bir hediye vermek istedik ve hesabına **1.000.000 Coin** ekledik.`
}).then(ertu => { setTimeout(() => { ertu.delete().catch(err => {}) }, 7500);
})
})