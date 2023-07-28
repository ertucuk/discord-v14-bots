const moment = require("moment");
moment.locale("tr");
const { EmbedBuilder,AuditLogEvent } = require("discord.js");
const snipe = require("../../schemas/snipe");
const client = global.client;

client.on("messageDelete", async (message) => {

    if (message.author.bot) return;

    await snipe.findOneAndUpdate({ guildID: message.guild.id, channelID: message.channel.id }, { $set: { messageContent: message.content, userID: message.author.id, image: message.attachments.first() ? message.attachments.first().proxyURL : null, createdDate: message.createdTimestamp, deletedDate: Date.now() } }, { upsert: true });
    const channel = client.channels.cache.find(x => x.name == "message_log");
    let entry = await message.guild.fetchAuditLogs({ type: AuditLogEvent.MessageDelete }).then(audit => audit.entries.first())
    if (!channel) return;
    const embed = new EmbedBuilder()
      .setAuthor({ name : message.member.displayName, iconURL: message.author.avatarURL({ dynamic: true })})
      .setColor("Random")
      .setDescription(`
      ${entry.executor} tarafından ${message.channel} kanalında bir mesaj sildi!
                          
      \`•\` Mesaj Kanalı: ${message.channel} - (\`${message.channel.id}\`)
      \`•\` Mesaj Sahibi: ${message.author} - (\`${message.author.id}\`)
      \`•\` Mesaj İçeriği: \`\`\`${message.content.length > 300 ? "300 Karakterden uzun.." : `${message.content}`}\`\`\`
      `)
      .setFooter({ text: `ID: ${message.author.id} • ${moment(Date.now()).format("LLL")}`});
      if (!message.attachments.first()) channel.send({ embeds: [embed]});
  
    const embedx = new EmbedBuilder()
    .setAuthor({ name : message.member.displayName, iconURL: message.author.avatarURL({ dynamic: true })})
    .setColor("Random")
    .setDescription(`
    ${entry.executor} tarafından ${message.channel} kanalında bir içerik sildi!
                        
    \`•\` Mesaj Kanalı: ${message.channel} - (\`${message.channel.id}\`)
    \`•\` Mesaj Sahibi: ${message.author} - (\`${message.author.id}\`)
    `)
    .setFooter({ text: `ID: ${message.author.id} • ${moment(Date.now()).format("LLL")}`});
    if (message.attachments.first()) channel.send({ embeds: [embedx.setImage(message.attachments.first().proxyURL)]});
});
  
  module.exports.config = {
    name: "messageDelete",
  };
  
