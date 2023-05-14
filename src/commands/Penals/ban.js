const { ApplicationCommandOptionType, PermissionsBitField,EmbedBuilder } = require("discord.js");
const coin = require("../../schemas/coin");
const moment = require("moment");
const ceza = require("../../schemas/ceza");
const cezapuan = require("../../schemas/cezapuan")
const ertum = require("../../Settings/Setup.json");
const ertucuk = require("../../Settings/System");
const banLimit = new Map();
const { BsonDatabase,JsonDatabase,YamlDatabase } = require("five.db");
const db = new YamlDatabase();
moment.locale("tr");
const { red, green } = require("../../Settings/Emojis.json")
const client = global.bot;

module.exports = {
    name: "ban",
    description: "",
    category: "NONE",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["yargı","siktir","sg","uza"],
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

    onLoad: function (client) { },

    onCommand: async function (client, message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers) &&  !ertum.BanHammer.some(x => message.member.roles.cache.has(x))) { message.channel.send({ content:"Yeterli yetkin yok!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
        message.react(red)
        return }
        if (!args[0]) { message.channel.send({ content:"Banlanılacak üyeyi belirtmeyi unuttun!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
        message.react(red)
        return }
        const user = message.mentions.users.first() || message.guild.members.cache.get(args[0])
        if (!user) { message.channel.send({ content:"Böyle bir Kullanıcı bulamadım!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
        message.react(red)
        return }
        const reason = args.slice(1).join(" ") || "Belirtilmedi!";
        const member = message.guild.members.cache.get(user.id);
    
        if (message.guild.members.cache.has(user.id) && message.guild.members.cache.get(user.id).permissions.has(PermissionsBitField.Flags.ViewAuditLog)) return message.channel.send({ content:"Üst yetkiye sahip kişileri yasaklayamazsın!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
        if (message.guild.members.cache.has(user.id) && message.member.roles.highest.position <= message.guild.members.cache.get(user.id).roles.highest.position) return message.channel.send({ content:"Belirttiğin kişinin yetkisi ya senden yüksek yada aynı yetkidesiniz!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
        if (member && !member.bannable) return message.channel.send({ content:"Bu üyeyi banlayamıyorum!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
        if (ertucuk.Moderation.banlimit > 0 && banLimit.has(message.author.id) && banLimit.get(message.author.id) == ertucuk.Moderation.banlimit) return message.channel.send({ content:"Saatlik ban sınırına ulaştın!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
        let logChannel = client.channels.cache.find(x => x.name === "ban_log");
        if(!logChannel) {
          let hello = new Error("BAN LOG KANALI AYARLANMAMIS! LUTFEN SETUPTAN KURULUMU YAPINIZ!");
          console.log(hello);
        }
        
        message.react(green)
        if (ertucuk.Moderation.dmMessages) user.send({ content:`**${message.guild.name}** sunucusundan, **${message.author.tag}** tarafından, **${reason}** sebebiyle banlandın!`}).catch(() => {});
        message.guild.members.ban(user.id, { reason: `${reason} | Yetkili: ${message.author.tag}` , days:1}).catch(() => {});
        db.push(`kullanıcı_${member.id}`,`\` BAN \` [${reason} - <t:${(Date.now() / 1000).toFixed()}>]`);

        const ertucum = new EmbedBuilder()
        .setFooter({text: ertucuk.SubTitle})
        .setDescription(`**•** **${member ? member.toString() : user.username}** adlı kullanıcı başarıyla ${message.author} Tarafından banlandı! \n\n **•** Sebebi: **${reason}**`)
    
        message.react(green)
        message.reply({ embeds: [ertucum]});
    
        const log = new EmbedBuilder()
          .setDescription(`
          **${member ? member.toString() : user.username}** adlı kullanıcıya ${message.author} tarafından ban atıldı.`)
          .addFields(
  { name: "Banlanan", value: `${member ? member.toString() : user.username}`, inline: true },
  { name: "Banlayan", value: `${message.author}`, inline: true},
  { name: "Sebep", value: `${reason}`, inline: true},)

          .setFooter({ text:`${moment(Date.now()).format("LLL")}    (Ceza ID: #${penal.id})` })
          logChannel.send({ embeds: [log]});
        await coin.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { coin: -100 } }, { upsert: true });
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { BanAmount: 1 } }, {upsert: true});
        await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { cezapuan: 100 } }, { upsert: true });
    
        const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });

        let punishmentLogChannel = client.channels.cache.find(x => x.name === "cezapuan_log");
        if(!punishmentLogChannel) {
          let hello = new Error("CEZA PUAN LOG KANALI AYARLANMAMIS! LUTFEN SETUPTAN KURULUMU YAPINIZ!");
          console.log(hello);
        }

        punishmentLogChannel.send({content: `\`${member}\` üyesi ban cezası alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`})
    
        if (ertucuk.Moderation.banlimit > 0) {
          if (!banLimit.has(message.author.id)) banLimit.set(message.author.id, 1);
          else banLimit.set(message.author.id, banLimit.get(message.author.id) + 1);
          setTimeout(() => {
            if (banLimit.has(message.author.id)) banLimit.delete(message.author.id);
          }, 1000 * 60 * 60);
        }
     },

    onSlash: async function (client, interaction) { },
  };