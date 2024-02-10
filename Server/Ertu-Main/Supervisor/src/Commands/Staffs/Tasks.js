const { EmbedBuilder } = require("discord.js");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const ertucuk = require("../../../../../../Global/Settings/System");
const userTask = require("../../../../../../Global/Schemas/userTask");
const tasks = require("../../../../../../Global/Schemas/tasks");

module.exports = {
    name: "görev",
    description: "Görev hakkında bilgi verir.",
    category: "ADMIN",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: [],
      usage: ".görev",
    },

    onLoad: function (client) { },

    onCommand: async function (client, message, args) { 
        const data = await userTask.findOne({ userId: message.author.id })
        if (!data) return
    
        const activeTasks = await tasks.findOne({ currentRole: data.roleId })

        if (!activeTasks)  {
            return await message.reply({
                content: 'Rolüne ait görev yok.'
            })
        }

        try {
            const names = Object.keys(activeTasks.requiredCounts)
            const counts = Object.values(data.counts)

            const i = Object.values(activeTasks.requiredCounts).map((val, i) => `${client.emoji("ertu_nokta")} **\` ${names[i].charAt(0).toUpperCase() + names[i].slice(1)}: \`** ${counts[i] > val ? `${progressBar(i == 1 ? Math.floor(val / (1000 * 60 * 60)) : val, i == 1 ? Math.floor(val / (1000 * 60 * 60)) : val, 5)} **\` (${i == 1 ? Math.floor(val / (1000 * 60 * 60)) : val} / ${i == 1 ? Math.floor(val / (1000 * 60 * 60)) + ' saat' : val}) \`**` : `${progressBar(i == 1 ? Math.floor(val / (1000 * 60 * 60)) : val, i == 1 ? Math.floor(val / (1000 * 60 * 60)) : val, 5)} **\` (${i == 1 ? Math.floor(val / (1000 * 60 * 60)) : val} / ${i == 1 ? Math.floor(val / (1000 * 60 * 60)) + ' saat' : val}) \`**`}`).join('\n')

            const embed = new EmbedBuilder()
            .setColor('#2b2d31')
            .setAuthor({ iconURL: message.author.displayAvatarURL({ dynamic: true }), name: message.author.username + ' ' + 'kullanıcısının görevleri' })
            .setDescription(
                `Aşağıda <@&${activeTasks.endOfMissionRole}> rolüne ait yapılması gereken görevler ve ne durumda olduğunuz belirtilmiştir. Görevleri tamamladıktan en geç 1 dakika içerisinde rolünüze sahip olacaksınız.` +
                '\n\n' +
                i
            )
            
                


        /*Object.values(activeTasks.requiredCounts).forEach((val, i) => {

            if (counts[i] > val) {
                return embed.addFields({
                    name: names[i].charAt(0).toUpperCase() + names[i].slice(1),
                    value: `${progressBar(i == 1 ? Math.floor(val / (1000 * 60 * 60)) : val, i == 1 ? Math.floor(val / (1000 * 60 * 60)) : val, 5)} **\` ${i == 1 ? Math.floor(val / (1000 * 60 * 60)) : val} / ${i == 1 ? Math.floor(val / (1000 * 60 * 60)) + ' saat' : val} \`**`,
                })
            }

            embed.addFields({
                name: names[i].charAt(0).toUpperCase() + names[i].slice(1),
                value: `${progressBar(i == 1 ? Math.floor(val / (1000 * 60 * 60)) : val, i == 1 ? Math.floor(val / (1000 * 60 * 60)) : val, 5)} **\` ${i == 1 ? Math.floor(val / (1000 * 60 * 60)) : val} / ${i == 1 ? Math.floor(val / (1000 * 60 * 60)) + ' saat' : val} \`**`,
            }) 
            
        })*/

        await message.reply({
            embeds: [embed]
        })
        } catch (e) {
            throw new Error(e)
        }
      
        
    },
};

function progressBar(value, maxValue, size){
  const progress = Math.round(size * (value / maxValue > 1 ? 1 : value / maxValue));
  const emptyProgress = size - progress > 0 ? size - progress : 0;

  const progressText = `${client.emoji("BlueMid")}`.repeat(progress > 0 ? progress : 0);
  const emptyProgressText = `${client.emoji("EmptyMid")}`.repeat(emptyProgress);

  return emptyProgress > 0
    ? progress === 0
      ? `${client.emoji("EmptyStart")}` + progressText + emptyProgressText + `${client.emoji("EmptyEnd")}`
      : `${client.emoji("BlueStart")}` + progressText + emptyProgressText + `${client.emoji("EmptyEnd")}`
    : `${client.emoji("BlueStart")}` + progressText + emptyProgressText + `${client.emoji("BlueEnd")}`;
}; 