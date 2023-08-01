const { EmbedBuilder } = require("discord.js");
const bannedTag = require("../../../../../../Global/Schemas/bannedTag");
const ertum = require("../../../../../../Global/Settings/Setup.json")
const ertucuk = require("../../../../../../Global/Settings/System");
const regstats = require("../../../../../../Global/Schemas/registerStats");
const { green, red } = require("../../../../../../Global/Settings/Emojis.json")
const client = global.client;


client.on("userUpdate", async (oldMember, newMember) => {
  
  const guild = client.guilds.cache.get(ertucuk.ServerID);
  const member = guild.members.cache.get(newMember.id);
  const ChatChannel = guild.channels.cache.get(ertum.ChatChannel)

  if (oldMember.displayName == newMember.displayName || oldMember.bot || newMember.bot) return;

  if (ertum.ServerTag.some(ertu => client.users.cache.get(newMember.id).displayName.includes(ertu))) {
    member.roles.add(ertum.TaggedRole);
    client.channels.cache.find(x => x.name === "taglı_log").send({embeds: [ new EmbedBuilder().setThumbnail(member.displayAvatarURL({ dynamic: true, size: 2048 })).setDescription(`
 ${member} kullanıcısı <t:${Math.floor(Date.now() / 1000)}:R> tagımızı aldı.

\` ➜ \` İsim Değişikliği:  ${oldMember.displayName}  **=>** ${newMember.displayName}
\` ➜ \` Anlık taglı üye: **${guild.members.cache.filter(x => x.user.displayName.includes(ertum.ServerTag)).size}**
    `)]});
    ChatChannel.send({ content:`${member} kullanıcısı tagımızı alarak ailemize katıldı! Ailemiz ${guild.members.cache.filter(x => x.user.displayName.includes(ertum.ServerTag)).size} kişi oldu!`}).then((e) => setTimeout(() => { e.delete(); }, 5000));
  } else if (ertum.ServerTag.some(ertu => !client.users.cache.get(newMember.id).displayName.includes(ertu) && member.roles.cache.has(ertum.TaggedRole ))) {
    member.roles.remove(ertum.TaggedRole);
    client.channels.cache.find(x => x.name === "taglı_log").send({embeds: [ new EmbedBuilder().setThumbnail(member.displayAvatarURL({ dynamic: true, size: 2048 })).setDescription(
`${member} kullanıcısı <t:${Math.floor(Date.now() / 1000)}:R> tagımızı bıraktı.
      
\` ➜ \` İsim Değişikliği: ${oldMember.displayName}  **=>** ${newMember.displayName} 
\` ➜ \` Anlık taglı üye: **${guild.members.cache.filter(x => x.user.displayName.includes(ertum.ServerTag)).size}**
`)]});
} 

const res = await bannedTag.findOne({ guildID: ertucuk.ServerID });
if (!res) return
res.taglar.forEach(async x => {
  
if (!oldUser.tag.includes(x) && newUser.tag.includes(x)) {
    !member.roles.cache.has(ertum.BoosterRole) 
    await member.roles.set(ertum.ForbiddenTagRoles).catch();
    await member.setNickname('Yasaklı Tag');
   member.send({ content:`${guild.name} adlı sunucumuza olan erişiminiz engellendi! Sunucumuzda yasaklı olan bir simgeyi (${x}) isminizde taşımanızdan dolayıdır. Sunucuya erişim sağlamak için simgeyi (${x}) isminizden çıkartmanız gerekmektedir.\n\nSimgeyi (${x}) isminizden kaldırmanıza rağmen üstünüzde halen Yasaklı Tag rolü varsa sunucudan gir çık yapabilirsiniz veya sağ tarafta bulunan yetkililer ile iletişim kurabilirsiniz. **-Yönetim**\n\n__Sunucu Tagımız__\n**${ertum.ServerTag}**`}).catch(() => {});
  } else
  if (oldUser.tag.includes(x) && !newUser.tag.includes(x)) { 
    !member.roles.cache.has(ertum.BoosterRole) 
    await member.roles.set(ertum.UnRegisteredRoles).catch();
    await member.setNickname(`${member.user.username.includes(ertum.ServerTag) ? ertum.ServerTag : (ertum.ServerUntagged ? ertum.ServerUntagged : (ertum.ServerTag || ""))} İsim | Yaş`);
  member.send({ content:`${guild.name} adlı sunucumuza olan erişim engeliniz kalktı. İsminizden (${x}) sembolünü kaldırarak sunucumuza erişim hakkı kazandınız. Keyifli Sohbetler`}).catch(() => {});
  }
})






})

module.exports.config = {
    Event: "userUpdate"
};
  