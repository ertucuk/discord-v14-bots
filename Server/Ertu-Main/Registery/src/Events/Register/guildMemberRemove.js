const client = global.client;
const inviterSchema = require("../../../../../../Global/Schemas/inviter");
const inviteMemberSchema = require("../../../../../../Global/Schemas/inviteMember");
const coin = require("../../../../../../Global/Schemas/coin");
const { red } = require("../../../../../../Global/Settings/Emojis.json");
const gorev = require("../../../../../../Global/Schemas/invite");
const isimler = require("../../../../../../Global/Schemas/names");
const ertum = require("../../../../../../Global/Settings/Setup.json")

client.on("guildMemberRemove", async (member) => {
    const ertucukk = member.guild.channels.cache.get(ertum.InviteChannel);
    if (!ertucukk) return;
    if (member.user.bot) return;
    const data = await isimler.findOne({ guildID: member.guild.id, userID: member.user.id });

    if (data && data.names.length) {
      await isimler.findOneAndUpdate({ guildID: member.guild.id, userID: member.user.id }, { $push: { names: { name: data.names.splice(-1).map((x, i) => `${x.name}`), sebep: "Sunucudan Ayrılma", date: Date.now() } } }, { upsert: true });
      }
  
    const inviteMemberData = await inviteMemberSchema.findOne({ guildID: member.guild.id, userID: member.user.id });
    if (!inviteMemberData) {
      ertucukk.send({ content: `>>> ${red} \`${member.user.tag}\` adlı üye <t:${Math.floor(Date.now() / 1000)}:R> sunucudan çıktı ama kim tarafından davet edildiğini bulamadım. Sunucumuz ise **${member.guild.memberCount}** üye kaldı!`});
    } else {
      const inviter = await client.users.fetch(inviteMemberData.inviter);
      await inviterSchema.findOneAndUpdate({ guildID: member.guild.id, userID: inviter.id }, { $inc: { leave: 1, total: -1 } }, { upsert: true });
      const inviterData = await inviterSchema.findOne({ guildID: member.guild.id, userID: inviter.id, });
      const total = inviterData ? inviterData.total : 0;
      ertucukk.send({ content:`>>> ${red} \`${member.user.tag}\` adlı üye sunucudan çıktı. ${inviter.tag} kişinin daveti **${total}** sunucumuz ise** ${member.guild.memberCount}** üye kaldı! `});
      await coin.findOneAndUpdate({ guildID: member.guild.id, userID: inviter.id }, { $inc: { coin: -15 } }, { upsert: true });
      if (gorev)
      await gorev.findOneAndUpdate({ guildID: member.guild.id, userID: inviter.id }, { $inc: { invite: -1 } }, { upsert: true });
    }
  });