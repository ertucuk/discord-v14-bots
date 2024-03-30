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

  if (oldMember.displayName == newMember.displayName || oldMember.bot || newMember.bot || member.roles.cache.has(ertum.JailedRoles[0])) return;

  if (ertum.ServerTag.some(ertu => client.users.cache.get(newMember.id).displayName.includes(ertu))) {
    member.roles.add(ertum.TaggedRole);
    client.channels.cache.find(x => x.name === "taglı_log").send({embeds: [ new EmbedBuilder().setThumbnail(member.displayAvatarURL({ dynamic: true, size: 2048 })).setDescription(`
 ${member} kullanıcısı <t:${Math.floor(Date.now() / 1000)}:R> tagımızı aldı.

\` ➜ \` İsim Değişikliği:  ${oldMember.displayName} **=>** ${newMember.displayName}
\` ➜ \` Anlık taglı üye: **${guild.members.cache.filter(x => x.user.displayName.includes(ertum.ServerTag)).size}**
    `)]});
    ChatChannel.send({ content:`🎉 Tebrikler, ${member} kullanıcısı tagımızı alarak ailemize katıldı!`}).then((e) => setTimeout(() => { e.delete(); }, 5000));
  } else if (ertum.ServerTag.some(ertu => !client.users.cache.get(newMember.id).displayName.includes(ertu) && member.roles.cache.has(ertum.TaggedRole))) {
    let role = guild.roles.cache.get(ertum.TaggedRole);
    let roles = member.roles.cache.clone().filter(e => e.managed || e.position < role.position);
    await member.roles.set(roles).catch();
    client.channels.cache.find(x => x.name === "taglı_log").send({embeds: [ new EmbedBuilder().setThumbnail(member.displayAvatarURL({ dynamic: true, size: 2048 })).setDescription(
`${member} kullanıcısı <t:${Math.floor(Date.now() / 1000)}:R> tagımızı bıraktı.
      
\` ➜ \` İsim Değişikliği: ${oldMember.displayName}  **=>** ${newMember.displayName} 
\` ➜ \` Anlık taglı üye: **${guild.members.cache.filter(x => x.user.displayName.includes(ertum.ServerTag)).size}**
`)]});
} 


/////////////// YASAKLI TAG KNK //////////////////////////////////////////////////////////////////
const yasaklitag = await bannedTag.findOne({ guildID: ertucuk.ServerID });
if (!yasaklitag) return
yasaklitag.taglar.forEach(async x => {
  
if (!oldMember.tag.includes(x) && newMember.tag.includes(x)) {
    !member.roles.cache.has(ertum.BoosterRole) 
    await member.roles.set(ertum.ForbiddenTagRoles).catch();
    await member.setNickname('Yasaklı Tag');
   member.send({ content:`
   **Merhaba** ${member}

   Bu yazı, sunucumuz içerisindeki kurallarımıza uymadığı tespit edilen bir sembolün, sizin hesabınızda tespit edildiğini bildirmek amacıyla yazılmıştır. Üzerinizde bulunan (${x}) sembolü sunucumuz kurallarına aykırı olduğu için hesabınız yasaklı kategorisine eklenmiştir.

   Bu durumun düzeltilmesi için, yasaklı sembolü kaldırmanız gerekmektedir. Söz konusu yasaklı sembol hesabınızdan çıkarıldığında, eğer daha önce kayıtlıysanız otomatik olarak kayıtlı duruma geçeceksiniz. Ancak, eğer kayıtlı değilseniz, tekrar kayıtsıza düşeceksiniz.
   
   Herhangi bir sorunuz veya açıklamanız için moderatör ekibimizle iletişime geçebilirsiniz.
   
   Saygılarımla,
   **${guild.name}** Moderasyon Ekibi `}).catch(() => {});
  } else
  if (oldMember.tag.includes(x) && !newMember.tag.includes(x)) { 
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
  