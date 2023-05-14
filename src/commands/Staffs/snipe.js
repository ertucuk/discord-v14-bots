const { ApplicationCommandOptionType, EmbedBuilder,PermissionsBitField, AuditLogEvent } = require("discord.js");
const ertum = require("../../Settings/Setup.json");
const snipe = require("../../schemas/snipe");
const ertucuk = require("../../Settings/System");
const moment = require("moment")
module.exports = {
    name: "snipe",
    description: "snipe atar",
    category: "NONE",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: [],
      usage: "",
    },
    slashCommand: {
      enabled: true,
      options: [
        {
            name: "ertu",
            description: "ertu",
            type: ApplicationCommandOptionType.Subcommand,
        },
      ],
    },

    onLoad: function (client) {

       client.on("messageDelete", async (message) => { 

        await snipe.findOneAndUpdate({ guildID: message.guild.id, channelID: message.channel.id }, { $set: { messageContent: message.content, userID: message.author.id, image: message.attachments.first() ? message.attachments.first().proxyURL : null, createdDate: message.createdTimestamp, deletedDate: Date.now() } }, { upsert: true });
        const channel = client.channels.cache.find(x => x.name == "message_log");
        let entry = await message.guild.fetchAuditLogs({ type: AuditLogEvent.MessageDelete }).then(audit => audit.entries.first())
        if (!channel) return;
        const embed = new EmbedBuilder()
          .setAuthor({ name : message.member.displayName, iconURL: message.author.avatarURL({ dynamic: true })})
          .setDescription(`
          ${entry.executor} tarafından ${message.channel} kanalında bir mesaj silindi !
                              
          \`•\` Mesaj Kanalı: ${message.channel} - (\`${message.channel.id}\`)
          \`•\` Mesaj Sahibi: ${message.author} - (\`${message.author.id}\`)
          \`•\` Mesaj İçeriği: \`\`\`${message.content.length > 300 ? "300 Karakterden uzun.." : `${message.content}`}\`\`\`
          `)
          .setFooter({ text: `ID: ${message.author.id} • ${moment(Date.now()).format("LLL")}`});
          if (!message.attachments.first()) channel.send({ embeds: [embed]});
      
        const embedx = new EmbedBuilder()
        .setAuthor({ name : message.member.displayName, iconURL: message.author.avatarURL({ dynamic: true })})
        .setDescription(`
        ${entry.executor} tarafından ${message.channel} kanalında bir içerik sildi!
                            
        \`•\` Mesaj Kanalı: ${message.channel} - (\`${message.channel.id}\`)
        \`•\` Mesaj Sahibi: ${message.author} - (\`${message.author.id}\`)
        `)
        .setFooter({ text: `ID: ${message.author.id} • ${moment(Date.now()).format("LLL")}`});
        if (message.attachments.first()) channel.send({ embeds: [embedx.setImage(message.attachments.first().proxyURL)]});
})},
    
    onCommand: async function (client, message, args) {

        if(!ertum.ConfirmerRoles.some(oku => message.member.roles.cache.has(oku)) && !ertum.OwnerRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
        {
          return
        }
        let embed = new EmbedBuilder().setAuthor({name: message.member.displayName, iconURL: message.author.displayAvatarURL({dynamic: true})}).setColor('#330066')
    
        const data = await snipe.findOne({ guildID: message.guild.id, channelID: message.channel.id });
        if (!data) 
        {
        message.channel.send({ content:"Bu kanalda silinmiş bir mesaj bulunmuyor!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
        const author = await client.user.fetch(data.author);
    embed.setFooter({text: ertucuk.SubTitle}).setDescription(`
    ${data.messageContent ? `\n\` ❯ \` Silinen Mesaj: **${data.messageContent}**` : ""}
    \` ❯ \` Mesaj Sahibi: <@${data.userID}> - (\`${data.userID}\`)
    \` ❯ \` Mesajın Yazılma Tarihi: <t:${Math.floor(data.createdDate / 1000)}:R>
    \` ❯ \` Mesajın Silinme Tarihi: <t:${Math.floor(data.deletedDate / 1000)}:R>
    `); message.channel.send({ embeds: [embed] });

     },

    onSlash: async function (client, interaction) { },
  };