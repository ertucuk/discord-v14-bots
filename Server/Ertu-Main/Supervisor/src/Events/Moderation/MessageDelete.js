const { EmbedBuilder,AuditLogEvent,Events,codeBlock } = require("discord.js");
const snipe = require("../../../../../../Global/Schemas/snipe");
const client = global.client;
const system = require('../../../../../../Global/Settings/System');
const moment = require('moment');
require("moment-duration-format")
moment.duration("hh:mm:ss").format()

client.on(Events.MessageDelete, async (message) => {
    if (message.author.bot) return;
    await snipe.findOneAndUpdate({ guildID: system.ServerID , channelID: message.channel.id }, { $set: { messageContent: message.content, userID: message.author.id, image: message.attachments.first() ? message.attachments.first().proxyURL : null, createdDate: message.createdTimestamp, deletedDate: Date.now() } }, { upsert: true });
    const channel = client.channels.cache.find(x => x.name == "message_log");
    let entry = await message.guild.fetchAuditLogs({ type: AuditLogEvent.MessageDelete }).then(audit => audit.entries.first())
    if (!channel) return;
    const embed = new EmbedBuilder()
      .setAuthor({ name : message.member.user.globalName, iconURL: message.author.avatarURL({ dynamic: true })})
      .setColor("Random")
      .setDescription(`${entry.executor} üyesi ${message.channel} kanalında mesajını sildi.`)
      .addFields(
        { name: `Mesaj Kanalı`, value: `${codeBlock("fix", message.channel.name)}`, inline: false },
        { name: `Mesaj Sahibi`, value: `${codeBlock("fix", message.author.username)}`, inline: false },
        { name: `Silindiği Tarih`, value: `${codeBlock("fix", moment(Date.now()).format("LLL"))}`, inline: false },
        { name: `Silinen Mesaj`, value: `${codeBlock("fix", message.content.length > 300 ? "300 Karakterden uzun.." : message.content)}`, inline: false }
    )
      if (!message.attachments.first()) channel.send({ embeds: [embed]});
    const embedx = new EmbedBuilder()
    .setAuthor({ name : message.member.user.globalName, iconURL: message.author.avatarURL({ dynamic: true })})
    .setColor("Random")
    .setDescription(`
    ${entry.executor} üyesi ${message.channel} kanalında bir içerik sildi!
                        
    \`•\` Mesaj Kanalı: ${message.channel} - (\`${message.channel.id}\`)
    \`•\` Mesaj Sahibi: ${message.author} - (\`${message.author.id}\`)
    `)
    .setFooter({ text: `ID: ${message.author.id} • ${moment(Date.now()).format("LLL")}`});
    if (message.attachments.first()) channel.send({ embeds: [embedx.setImage(message.attachments.first().proxyURL)]});
});
