const moment = require("moment");
moment.locale("tr");
moment.duration("hh:mm:ss").format()
const { EmbedBuilder,Events,codeBlock } = require("discord.js");
const client = global.client;

client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
if (newMessage.author.bot || newMessage.channel.type != 0) return;
if (oldMessage.content == newMessage.content) return;
const channel = client.channels.cache.find(x => x.name == "message_log");
if (!channel) return;
const embed = new EmbedBuilder()
.setAuthor({ name : newMessage.member.displayName, iconURL: newMessage.author.avatarURL({ dynamic: true })})
.setDescription(`${newMessage.member} üyesi ${newMessage.channel} adlı kanalda bir mesaj düzenlendi!`)
.addFields(
    { name: `Mesaj Kanalı`, value: `${codeBlock("fix", newMessage.channel.name)}`, inline: false },
    { name: `Mesaj Sahibi`, value: `${codeBlock("fix", newMessage.author.username)}`, inline: false },
    { name: `İlk Hali`, value: `${codeBlock("fix", oldMessage.content)}`, inline: false },
    { name: `Düzenlenen Hali`, value: `${codeBlock("fix", newMessage.content)}`, inline: false }
)
if (newMessage.attachments.first()) embed.setImage(newMessage.attachments.first().proxyURL);
channel.send({ embeds: [embed]});
});
  
