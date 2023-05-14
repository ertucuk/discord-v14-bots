const { EmbedBuilder } = require("discord.js");
const bannedTag = require("../../schemas/bannedTag");
const ertucuk = require("../../Settings/System");
const ertum = require("../../Settings/Setup.json")
const regstats = require("../../schemas/registerStats");
const { star, green, red } = require("../../Settings/Emojis.json")
const client = global.client;


client.on("userUpdate", async (oldUser, newUser) => {
  
  if (oldUser.bot || newUser.bot || (oldUser.tag === newUser.tag)) return;
  const guild = client.guilds.cache.get(ertucuk.ServerID);
  if (!guild) return;
  const member = guild.members.cache.get(oldUser.id);
  if (!member) return;
  const channel = client.channels.cache.find(x => x.name == "taglı_log");
  const kanal = guild.channels.cache.get(ertum.ChatChannel)
  const tag = ertum.ServerTag;

  if (tag.some(tag => oldUser.tag.includes(tag) && !newUser.tag.includes(tag))) {
  let ekip = guild.roles.cache.get(ertum.TaggedRole);
  let roles = member.roles.cache.clone().filter(e => e.managed || e.rawPosition < ekip.rawPosition);
  let roles2 = member.roles.cache.clone().filter(e => e.managed || e.rawPosition > ekip.rawPosition);
  if (!channel) return;
  
  const tagModedata = await regstats.findOne({ guildID: ertucuk.ServerID })
  if (tagModedata && tagModedata.tagMode === true) {
  const embed = new EmbedBuilder()
  .setThumbnail(member.displayAvatarURL({ dynamic: true, size: 2048 }))
  .setDescription(`
${red} ${member.toString()} isimli eski taglımız, tagımızı <t:${Math.floor(Date.now() / 1000)}:R> bıraktı.
       
\` ➜ \` İsim Değişikliği: \` ${oldUser.tag} \` => **${newUser.tag}**
\` ➜ \` Anlık taglı üye: **${guild.members.cache.filter(x => tag.some(tag => x.user.tag.includes(tag))).size}**
       
**Üstünden çekilen rolleri şunlardır;**
${roles2 ? `${roles2.map(role => `${role}`).join(', ')}` : `<@&${ertum.TaggedRole}>`}
`);
       
  channel.send({ content: `${member.toString()} [\` ${member.id} \`]`, embeds: [embed]}); 
  
 if(!member.roles.cache.has(ertum.VipRole) && !member.roles.cache.has(ertum.BoosterRole)) return member.roles.set(ertum.UnRegisteredRoles);
} else if (ertum.TaggedRole) {
if (member.roles.cache.has(ekip)) member.roles.remove(ekip).catch();
member.roles.set(roles).catch();
}
const embed = new EmbedBuilder()
.setThumbnail(member.displayAvatarURL({ dynamic: true, size: 2048 }))
.setDescription(`
${red} ${member.toString()} isimli eski taglımız, tagımızı <t:${Math.floor(Date.now() / 1000)}:R> bıraktı.

\` ➜ \` İsim Değişikliği: \` ${oldUser.tag} \` => **${newUser.tag}**
\` ➜ \` Anlık taglı üye: **${guild.members.cache.filter(x => tag.some(tag => x.user.tag.includes(tag))).size}**

**Üstünden çekilen rolleri şunlardır;**
${roles2 ? `${roles2.map(role => `${role}`).join(', ')}` : `<@&${ertum.TaggedRole}>`}
`);

channel.send({ content: `${member.toString()} [\` ${member.id} \`]`, embeds: [embed]});
} else if (tag.some(tag => !oldUser.tag.includes(tag) && newUser.tag.includes(tag))) {
member.roles.add(ertum.TaggedRole);
if (!channel) return;
const embed = new EmbedBuilder()
.setThumbnail(member.displayAvatarURL({ dynamic: true, size: 2048 }))
.setDescription(`
${green} ${member.toString()} isimli üye ailemize katıldı, tagımızı <t:${Math.floor(Date.now() / 1000)}:R> aldı.

\` ➜ \` İsim Değişikliği: \` ${oldUser.tag} \` => **${newUser.tag}**
\` ➜ \` Anlık taglı üye: **${guild.members.cache.filter(x => tag.some(tag => x.user.tag.includes(tag))).size}**
`);
channel.send({ content: `${member.toString()} [\` ${member.id} \`]`, embeds: [embed]});
kanal.send({ content: `${member.toString()} üyesi ${ertum.ServerTag} tagımızı alarak ailemize katıldı! Ailemiz ${guild.members.cache.filter(x => x.user.username.includes(ertum.ServerTag)).size} kişi oldu!` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
}

  const res = await bannedTag.findOne({ guildID: ertucuk.ServerID });
  if (!res) return
  res.taglar.forEach(async x => {
    
  if (!oldUser.tag.includes(x) && newUser.tag.includes(x)) {
      !member.roles.cache.has(ertum.BoosterRole) 
      await member.roles.set(ertum.JailedRole).catch();
      await member.setNickname('Yasaklı Tag');
     member.send({ content:`${guild.name} adlı sunucumuza olan erişiminiz engellendi! Sunucumuzda yasaklı olan bir simgeyi (${x}) isminizde taşımanızdan dolayıdır. Sunucuya erişim sağlamak için simgeyi (${x}) isminizden çıkartmanız gerekmektedir.\n\nSimgeyi (${x}) isminizden kaldırmanıza rağmen üstünüzde halen Yasaklı Tag rolü varsa sunucudan gir çık yapabilirsiniz veya sağ tarafta bulunan yetkililer ile iletişim kurabilirsiniz. **-Yönetim**\n\n__Sunucu Tagımız__\n**${ertum.ServerTag}**`})
    } else
    if (oldUser.tag.includes(x) && !newUser.tag.includes(x)) { 
      !member.roles.cache.has(ertum.BoosterRole) 
      await member.roles.set(ertum.UnRegisteredRoles).catch();
      await member.setNickname(`${ertum.UnRegisteredRoles} İsim ' Yaş`);
    member.send({ content:`${guild.name} adlı sunucumuza olan erişim engeliniz kalktı. İsminizden (${x}) sembolünü kaldırarak sunucumuza erişim hakkı kazandınız. Keyifli Sohbetler**-Yönetim**`})
    }
  })
})

module.exports.config = {
    Event: "userUpdate"
};
  