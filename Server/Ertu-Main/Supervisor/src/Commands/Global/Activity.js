const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder,ButtonStyle } = require("discord.js");
const kanal = require("../../../../../../Global/Settings/AyarName");
const { DiscordTogether } = require('discord-together');
const client = global.client;
client.discordTogether = new DiscordTogether(client);

module.exports = {
    name: "aktivite",
    description: "Ses kanalında oyun oynarsınız.",
    category: "USER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["aktivite", "together","etkinlik"],
      usage: ".aktivite", 
    },
  

    onLoad: function (client) { },

    onCommand: async function (client, message, args, ertuembed) {

        if (!message.member.voice.channel) {
            return message.reply({ content: `Herhangi bir ses kanalı bağlı değilsin, Üzgünüm!` }).delete(10);
          }
          
          const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
              .setCustomId("aktivite")
              .setPlaceholder(`Aktiviteler için menüyü açın!`)
              .addOptions(
                { label: "Youtube", description: "Arkadaşlarınla birlikte YouTube videoları izlemek ister misin?", value: "youtube", emoji: { id: "997820361246789713" } },
                { label: "Poker Night", description: "Arkadaşlarınla Poker Night oynamak ister misin? Eğlenceli bir poker deneyimi için buradayız!", value: "poker", emoji: { name: "🃏" } },
                { label: "Satranç", description: "Arkadaşlarınla Satranç oynamak ister misin? Zeka ve strateji gerektiren bir oyun.", value: "chess", emoji: { name: "♟️" } },
                { label: "Dama", description: "Arkadaşlarınla Dama oynamak ister misin? Dama oyununun keyfini çıkarın.", value: "checkers", emoji: { name: "🥏" } },
                { label: "Kelime Oyunu", description: "Arkadaşlarınla Kelime Oyunu oynamak ister misin? Kelime dağarcığınızı test edin.", value: "wordsnack", emoji: { name: "🔠" } },
                { label: "Heceleme", description: "Arkadaşlarınla Heceleme oynamak ister misin? Kelimeleri nasıl doğru bir şekilde heceleyebildiğini göster!", value: "spellcast", emoji: { name: "🆗" } }                
              ),
          );
          
          const embed = new EmbedBuilder()
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
            .setTimestamp()
            .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true }) })
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .addFields(
            { name: "AKTİVİTE SEÇİMİ", value: `\` ❯ \` Aşağıda listelenen aktivitelerden birini seçerek arkadaşlarınla oynayabilir veya aktivite yapabilirsin.`, inline: false },
            );
          
          message.channel.send({ embeds: [embed], components: [row] }).then(msg => {
            var filter = (component) => component.user.id === message.author.id;
            let collector = msg.createMessageComponentCollector({ filter, time: 30000 });
          
            collector.on('collect', async (i) => {
              if (i.customId === "aktivite") {
                const etkinlik = i.values[0];

                function bebegimharbidennekibarsinmanitanasoylebenisalsin(activityType) {
                  client.discordTogether.createTogetherCode(message.member.voice.channel.id, activityType).then(async invite => {
                    embed.setDescription(`${message.member} tarafından ${activityType === 'youtube' ? 'Youtube Together' : activityType} seçildi!`).setFooter({ text: "Bu davet 10 saniye içerisinde silinecektir." });
                    msg.edit({ embeds: [embed], components: [] }).then((e) => setTimeout(() => { e.delete(); }, 10000));
                    await i.reply({ content: `İzlemek için arkadaşlarınla bu davet kodunu kullanabilirsin.\n${invite.code}`, ephemeral: true });
                  });
                }
          
                switch (etkinlik) {
                  case "youtube":
                    bebegimharbidennekibarsinmanitanasoylebenisalsin('youtube');
                    break;
                  case "poker":
                    bebegimharbidennekibarsinmanitanasoylebenisalsin('poker');
                    break;
                  case "chess":
                    bebegimharbidennekibarsinmanitanasoylebenisalsin('chess');
                    break;
                  case "checkers":
                    bebegimharbidennekibarsinmanitanasoylebenisalsin('checkers');
                    break;
                  case "wordsnack":
                    bebegimharbidennekibarsinmanitanasoylebenisalsin('wordsnack');
                    break;
                  case "spellcast":
                    bebegimharbidennekibarsinmanitanasoylebenisalsin('spellcast');
                    break;
                  default:
                    i.reply({ content: "Geçersiz etkinlik seçildi.", ephemeral: true });
                    break;
                }
              }
            });
          });          

     },
  };