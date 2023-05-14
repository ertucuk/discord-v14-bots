const client = global.client;
const inviterSchema = require("../../schemas/inviter");
const inviteMemberSchema = require("../../schemas/inviteMember");
const coin = require("../../schemas/coin");
const { green, red } = require("../../Settings/Emojis.json")
const gorev = require("../../schemas/invite");
const ertum = require("../../Settings/Setup.json")

client.on("guildMemberRemove", async (member) => {
    const channel = member.guild.channels.cache.get(ertum.InviteChannel);
    if (!channel) return;
    if (member.user.bot) return;
  
    const inviteMemberData = await inviteMemberSchema.findOne({ guildID: member.guild.id, userID: member.user.id });
    if (!inviteMemberData) {
      channel.send({ content: `>>> ${red} \`${member.user.tag}\` adlı üye <t:${Math.floor(Date.now() / 1000)}:R> sunucudan çıktı ama kim tarafından davet edildiğini bulamadım. Sunucumuz ise **${member.guild.memberCount}** üye kaldı!`});
    } else {
      const inviter = await client.users.fetch(inviteMemberData.inviter);
      await inviterSchema.findOneAndUpdate({ guildID: member.guild.id, userID: inviter.id }, { $inc: { leave: 1, total: -1 } }, { upsert: true });
      const inviterData = await inviterSchema.findOne({ guildID: member.guild.id, userID: inviter.id, });
      const total = inviterData ? inviterData.total : 0;
      const gorevData = await gorev.findOne({ guildID: member.guild.id, userID: inviter.id });
      channel.send({ content:`>>> ${red} \`${member.user.tag}\` adlı üye sunucudan çıktı. ${inviter.tag} kişinin daveti **${total}** sunucumuz ise** ${member.guild.memberCount}** üye kaldı! `});
      await coin.findOneAndUpdate({ guildID: member.guild.id, userID: inviter.id }, { $inc: { coin: -15 } }, { upsert: true });
      if (gorevData)
      await gorev.findOneAndUpdate({ guildID: member.guild.id, userID: inviter.id }, { $inc: { invite: -1 } }, { upsert: true });
    }
  });