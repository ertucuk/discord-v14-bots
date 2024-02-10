const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder,ButtonStyle } = require("discord.js");
const ertum = require("../../../../../../Global/Settings/Setup.json");

module.exports = {
    name: "svkontrol",
    description: "Sunucu hakkındaki bilgileri görüntülersiniz",
    category: "ADMIN",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["serverkontrol", "server-kontrol"],
      usage: ".svkontrol",
    },
  

    onLoad: function (client) { },

    onCommand: async function (client, message, args, ertuembed) {

    if(!ertum.OwnerRoles.some(ertucum => message.member.roles.cache.has(ertucum)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
    { 
    message.react(`${client.emoji("ertu_carpi")}`)
    message.reply({ content:`Yeterli yetkin yok!`}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }

    const row = new ActionRowBuilder()
    .addComponents(
    new ButtonBuilder()
    .setCustomId("rolemembers")
    .setLabel("Roldeki Kişiler")
    .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
    .setCustomId("guildlogin")
    .setLabel("Sunucuya Giriş")
    .setStyle(ButtonStyle.Success),
    );

    const Administrator = message.guild.roles.cache.filter((role) =>role.permissions.has(PermissionsBitField.Flags.Administrator) && !role.managed);
    const GuildManage = message.guild.roles.cache.filter((role) =>role.permissions.has(PermissionsBitField.Flags.ManageGuild) && !role.managed);
    const RoleManage = message.guild.roles.cache.filter((role) =>role.permissions.has(PermissionsBitField.Flags.ManageRoles) && !role.managed);
    const ChannelManage = message.guild.roles.cache.filter((role) =>role.permissions.has(PermissionsBitField.Flags.ManageChannels) && !role.managed);

    const ertu = new EmbedBuilder()
	.setAuthor({name: message.guild.name,iconURL: message.guild.iconURL()})
    .setColor("Random")
    .addFields({
        name: "SUNUCU BİLGİLERİ",
        value: `
Taç Sahibi: ${message.guild.members.cache.get(message.guild.ownerId)}
Özel URL: ${message.guild.vanityURLCode ? message.guild.vanityURLCode +(await message.guild.fetchVanityData().uses) : "Özel URL Yok"}
Sunucu Kurulma Tarihi: <t:${Math.floor(message.guild.createdAt / 1000)}:R>
Rol Sayısı: **${message.guild.roles.cache.size}** - Kanal Sayısı: **${message.guild.channels.cache.size}**`
        })

        .addFields({
            name: "ROL BİLGİLERİ",
            value: `
Yönetici Açık olan: **${Administrator.size}** rol
${Administrator.map((role) => role).join(",")}
--
Sunucuyu Yönet Açık olan: **${GuildManage.size}** rol
${GuildManage.map((role) => role).join(",")}
--
Rol Yönet Açık olan: **${RoleManage.size}** rol
${RoleManage.map((role) => role).join(",")}
--
Kanal Yönet Açık olan: **${ChannelManage.size}** rol
${ChannelManage.map((role) => role).join(",")}
`,
        });
    let msg = await message.reply({ embeds: [ertu], components: [row] });
    const filter = i => i.user.id == message.author.id
    const collector = msg.createMessageComponentCollector({filter,time: 30000});

    collector.on("collect", async (button) => {
    if (button.customId === "rolemembers") {
    row.components[0].setDisabled(true);
msg.edit({ components: [row] });

function getAdminMembers() {
return message.guild.members.cache.filter((member) =>member.permissions.has(PermissionsBitField.Flags.Administrator) && !member.user.bot);
}

const adminMembers = getAdminMembers();
const adminMembersCount = adminMembers.size;
const adminMembersList = adminMembers.map((member) => member).join(", ");

const manageGuildMembers = message.guild.members.cache.filter((member) =>member.permissions.has(PermissionsBitField.Flags.ManageGuild) && !member.user.bot);
const manageGuildMembersCount = manageGuildMembers.size;
const manageGuildMembersList = manageGuildMembers.map((member) => member).join(", ");

const manageRolesMembers = message.guild.members.cache.filter((member) =>member.permissions.has(PermissionsBitField.Flags.ManageRoles) && !member.user.bot);
const manageRolesMembersCount = manageRolesMembers.size;
const manageRolesMembersList = manageRolesMembers.map((member) => member).join(", ");

const manageChannelsMembers = message.guild.members.cache.filter((member) =>member.permissions.has(PermissionsBitField.Flags.ManageChannels) && !member.user.bot);
const manageChannelsMembersCount = manageChannelsMembers.size;
const manageChannelsMembersList = manageChannelsMembers.map((member) => member).join(", ");

const embed = new EmbedBuilder()
.setAuthor({name: message.guild.name,iconURL: message.guild.iconURL()}) 
.setColor("Random")
.addFields({name: "ROL BİLGİLERİ",
value: `
Yönetici rolü olan: **${adminMembersCount}** kişi
${adminMembersList}
-----
Sunucuyu yönet rolü olan: **${manageGuildMembersCount}** kişi
${manageGuildMembersList}
-----
Rol yönet rolü olan: **${manageRolesMembersCount}** kişi
${manageRolesMembersList}
-----
Kanal yönet rolü olan: **${manageChannelsMembersCount}** kişi
${manageChannelsMembersList}
`});
button.reply({ embeds: [embed], ephemeral: true });
    }

   if (button.customId === "guildlogin") {
row.components[1].setDisabled(true);
msg.edit({ components: [row] });

const now = Date.now();
const dailyJoinCount = message.guild.members.cache.filter((member) => now - member.joinedTimestamp < 86400000).size;
const weeklyJoinCount = message.guild.members.cache.filter((member) => now - member.joinedTimestamp < 604800000).size;
const fortnightlyJoinCount = message.guild.members.cache.filter((member) => now - member.joinedTimestamp < 1296000000).size;
const monthlyJoinCount = message.guild.members.cache.filter((member) => now - member.joinedTimestamp < 2592000000).size;

const embed = new EmbedBuilder()
.setAuthor({name: message.guild.name,iconURL: message.guild.iconURL()}) 
.setColor("Random")
.setDescription(`
Günlük giriş: **${dailyJoinCount}**
Haftalık giriş: **${weeklyJoinCount}**
15 günlük giriş: **${fortnightlyJoinCount}**
1 aylık giriş: **${monthlyJoinCount}**`);

button.reply({ embeds: [embed], ephemeral: true });
    }
   })
  },
};