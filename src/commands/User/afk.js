const afk = require("../../schemas/afk");
const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const ertucuk = require("../../Settings/System");


module.exports = {
    name: "afk",
    description: "afk kalırsınız",
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
            name: "afk",
            description: "afk",
            type: ApplicationCommandOptionType.Subcommand,
        },
      ],
    },

    onLoad: function (client) {

        const afk = require("../../schemas/afk");

        client.on("messageCreate", async (message) => { 
          if (message.author.bot || !message.guild) return;
          const data = await afk.findOne({ guildID: message.guild.id, userID: message.author.id });
          const embed = new EmbedBuilder().setAuthor({ name: message.member.displayName, iconURL: message.author.displayAvatarURL({ dynamic: true })});
          if (data) {
            const afkData = await afk.findOne({ guildID: message.guild.id, userID: message.author.id });
            await afk.deleteOne({ guildID: message.guild.id, userID: message.author.id });
            if (message.member.displayName.includes("[AFK]") && message.member.manageable) await message.member.setNickname(message.member.displayName.replace("[AFK]", ""));
            message.reply({ content:`Başarıyla **[AFK]** modundan çıktınız. <t:${Math.floor(afkData.date / 1000)}:R> AFK olmuştunuz.`}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
          }
          
          const member = message.mentions.members.first();
          if (!member) return;
          const afkData = await afk.findOne({ guildID: message.guild.id, userID: member.user.id });
          if (!afkData) return;
          embed.setDescription(`${member.toString()} kullanıcısı, \`${afkData.reason}\` sebebiyle, <t:${Math.floor(afkData.date / 1000)}:R> afk oldu!`);
          message.channel.send({ embeds: [embed]}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 
        })
 },

    onCommand: async function (client, message, args) {

if (message.member.displayName.includes("[AFK]")) return
const reason = args.join(" ") || "Belirtilmedi";
await afk.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $set: { reason, date: Date.now() } }, { upsert: true });
message.reply({ content:"Başarıyla [AFK] moduna girdiniz!"}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 
if (message.member.manageable) message.member.setNickname(`[AFK] ${message.member.displayName}`);
     
},

    onSlash: async function (client, interaction) { },
  };