
const { EmbedBuilder, Events } = require('discord.js');
const { timeformat } = require("../../Helpers/Utils");
const cooldownCache = new Map();
const { green } = require("../../../../../../Global/Settings/Emojis.json");
const ertum = require("../../../../../../Global/Settings/Setup.json")
const system = require("../../../../../../Global/Settings/System");
const client = global.client;


client.on("messageCreate", async (message) => {
  let prefix = system.Mainframe.Prefixs.find((x) => message.content.toLowerCase().startsWith(x))
    if (!message.guild || message.author.bot || !prefix || ertum.UnRegisteredRoles.some(x => message.member.roles.cache.has(x)) || ertum.JailedRoles.some(x => message.member.roles.cache.has(x))) return;

    if ([".patlat", ".gumlet"].includes(message.content.toLowerCase())) return message.channel.send({ content: `Çocuk musun essek urusbu cucu` }).delete(5)
    if ([".tag"].includes(message.content.toLowerCase())) return message.channel.send({ content: `${ertum.ServerTag}` })
  
    let args = message.content.substring(system.Mainframe.Prefixs.some(x => x.length)).split(" ");
    let kaanxsrd = args[0].toLocaleLowerCase();
    args = args.splice(1);

    let command = client.commands.get(kaanxsrd) || client.aliases.get(kaanxsrd); 
    const ertuembed = new EmbedBuilder()
    .setAuthor({ name: message.member.displayName, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) })
    .setFooter({ text: system.SubTitle ? system.SubTitle : `Ertu Was Here`, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) })

    let komutLog = client.channels.cache.find(x => x.name == "komut_log");

    const ertu = new EmbedBuilder()
    .setColor("#2f3136")
    .setTimestamp()
    .setFooter({ text: `Kullanma Zamanı :`})
    .setDescription(`
    ${message.author} tarafından ${message.channel} kanalında \`${prefix}${kaanxsrd}\` komutu kullanıldı.
                        
    \`•\` Komut Kanalı: ${message.channel} - (\`${message.channel.id}\`)
    \`•\` Komut Sahibi: ${message.author} - (\`${message.author.id}\`)
    \`•\` Komut İçeriği: \`\`\`js${message.content}\`\`\`
    `)
    if(komutLog) komutLog.send({ embeds: [ertu]})

    if (command) {
        if (command.category === "OWNER" && !system.BotsOwners.includes(message.author.id)) {
            return message.reply({ content: "Bu komuta yalnızca bot sahipleri erişebilir"});
        }

        if (command.cooldown > 0) {
            const remaining = getRemainingCooldown(message.author.id, command);
            if (remaining > 0) {
              return message.reply({ content: `Bekleme süresindesin. Bu komudu tekrar \`${timeformat(remaining)}\` sonra kullanabilirsiniz.`});
            }
        }

        try {
              await command.onCommand(client, message, args, ertuembed);
            if (command.cooldown > 0) applyCooldown(message.author.id, command);
          } catch (ex) {
            message.client.logger.error("Message-Run - " + ex, ex);
            message.react("❌")
          }
     }

function applyCooldown(memberId, cmd) {
    const key = cmd.name + "|" + memberId;
    cooldownCache.set(key, Date.now());
  }
  
  function getRemainingCooldown(memberId, cmd) {
    const key = cmd.name + "|" + memberId;
    if (cooldownCache.has(key)) {
      const remaining = (Date.now() - cooldownCache.get(key)) * 0.001;
      if (remaining > cmd.cooldown) {
        cooldownCache.delete(key);
        return 0;
      }
      return cmd.cooldown - remaining;
    }
    return 0;
  }
});

  