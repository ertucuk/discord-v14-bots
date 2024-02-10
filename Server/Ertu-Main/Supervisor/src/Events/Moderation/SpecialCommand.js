
const { EmbedBuilder, Events,PermissionFlagsBits,ChannelType,PermissionsBitField } = require('discord.js');
const { green } = require("../../../../../../Global/Settings/Emojis.json");
const ertum = require("../../../../../../Global/Settings/Setup.json")
const özelPerms = require("../../../../../../Global/Schemas/specialcommand")
const system = require("../../../../../../Global/Settings/System");
const client = global.client;
const { BsonDatabase,JsonDatabase,YamlDatabase } = require("five.db");
const db = new YamlDatabase();


client.on(Events.MessageCreate, async (message) => {

  if (!message.guild || message.channel.type === ChannelType.DM) return;
  const data = await özelPerms.findOne({ guildID: message.guild.id })
  const permsData = data ? data.perms : [];
  let args = message.content.toLocaleLowerCase().substring(system.Mainframe.Prefixs.some(x => x.length)).split(" ");
  let talentPerm = permsData.find((e) => e.permName === args[0]);
  if (talentPerm) {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]) 
    if (Array.isArray(talentPerm.staffRoleID) ? !talentPerm.staffRoleID.some(app => message.member.roles.cache.has(app)) : !message.member.roles.cache.has(talentPerm.staffRoleID) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !message.member.permissions.has(PermissionsBitField.Flags.ManageRoles) && !message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return message.reply({content: `${client.emoji("ertu_carpi")} Yetkin Yetersiz!`})
    if (!member) return message.reply({ embeds: [new EmbedBuilder().setDescription(`${client.emoji("ertu_carpi")} Lütfen rol verilecek kişiyi etiketle.`)] }).then((e) => setTimeout(() => { e.delete(); }, 5000)).catch(err => {});
    if (Array.isArray(talentPerm.permID) ? talentPerm.permID.some(app => member.roles.cache.has(app)) : member.roles.cache.has(talentPerm.permID)) {
      let removedRoles = member.roles.cache.filter(x => Array.isArray(talentPerm.permID) ? talentPerm.permID.some(y => x.id === y) : talentPerm.permID == x.id).map(x => x.id)
      member.roles.remove(removedRoles)
      message.channel.send({
        embeds: [new EmbedBuilder().setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true }) })
          .setDescription(`${client.emoji("ertu_onay")} ${member} kullanıcısından ${Array.isArray(talentPerm.permID) ? talentPerm.permID.map(x => `<@&${x}>`) : `<@&${talentPerm.permID}>`} ${Array.isArray(talentPerm.permID) ? "rolleri" : `rolü`} alındı.`)]
      }).then(e => setTimeout(() => e.delete(), 5000))
    } else {
      member.roles.add(talentPerm.permID)
      message.channel.send({
        embeds: [new EmbedBuilder().setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true }) })
          .setDescription(`${client.emoji("ertu_onay")} ${member} kullanıcısına ${Array.isArray(talentPerm.permID) ? talentPerm.permID.map(x => `<@&${x}>`) : `<@&${talentPerm.permID}>`} ${Array.isArray(talentPerm.permID) ? "rolleri" : `rolü`} verdi.`)]
      }).then(e => setTimeout(() => e.delete(), 5000))
    }
    await message.react(`${client.emoji("ertu_onay")}`)
  }
});

  