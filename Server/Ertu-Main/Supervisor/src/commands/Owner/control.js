const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const sunucu = require("../../../../../../Global/Settings/System");

module.exports = {
    name: "kontrol",
    description: "Kontrol Komudu",
    category: "ADMIN",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["control"],
      usage: ".kontrol",
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

        if (!ertum.OwnerRoles.some(ertucum => message.member.roles.cache.has(ertucum)) && !message.member.permissions.has()) {
            message.reply({ content: `Yetkin bulunmamakta dostum.` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
            return
          }
          
          let ertutagli = message.guild.members.cache.filter(s => s.user.displayName.includes(ertum.ServerTag) && !s.roles.cache.get(ertum.TaggedRole))
          let ertucuk = message.guild.members.cache.filter(m => m.roles.cache.filter(r => r.id !== message.guild.id).size == 0)

          const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder().setStyle(ButtonStyle.Primary).setLabel('1').setCustomId('kayitsiz'),
            new ButtonBuilder().setStyle(ButtonStyle.Primary).setLabel('2').setCustomId('tag'),
          );

          let ertu = new EmbedBuilder()
          .setFooter({text: sunucu.SubTitle})
          .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
          .setDescription(`
    ${message.member.toString()}, ${message.guild.name} Sunucusunda rolü olmayan üyelerin rol dağıtım menüsü aşağıda verilmiştir.
    
    \` 1 \` Kayıtsız Rol: (**${ertucuk.size}** kişi)
    \` 2 \` Taglı Rol: (**${ertutagli.size}** kişi)
    `)
        let msg = await message.channel.send({ embeds: [ertu], components: [row] })
        var filter = (button) => button.user.id === message.author.id;
        let collector = await msg.createMessageComponentCollector({ filter, time: 30000 }) 

        collector.on("collect", async (button) => {
              if (button.customId === 'tag') {
        
                let ertutagli = message.guild.members.cache.filter(s => s.user.displayName.includes(ertum.ServerTag) && !s.roles.cache.has(ertum.TaggedRole))
        
                button.reply({
                  content: `
        Tagı olup rolü olmayan ${ertutagli.size} kullanıcıya rol verildi.
        
Tag Rolü verilen kullanıcılar;
${ertutagli.map(x => x || "Rolü olmayan Kullanıcı bulunmamaktadır.")}`
                })
        
                message.guild.members.cache.filter(s => s.user.displayName.includes(ertum.ServerTag) && !s.roles.cache.has(ertum.TaggedRole)).map(x => x.roles.add(ertum.TaggedRole))
              }
              if (button.customId === 'kayitsiz') {
        
                let ertucuk = message.guild.members.cache.filter(m => m.roles.cache.filter(r => r.id !== message.guild.id).size == 0)
        
                button.reply({
                  content: `
        Kayıtsız rolü olmayan ${ertucuk.size} kullanıcıya kayıtsız rolü verildi.
        
Kayıtsız Rolü verilen kullanıcılar;
${ertucuk.map(x => x || "Rolü olmayan Kullanıcı bulunmamaktadır.")} `
                })
        
                message.guild.members.cache.filter(m => m.roles.cache.filter(r => r.id !== message.guild.id).size == 0).map(x => x.roles.add(ertum.UnRegisteredRoles))
              }
            });
     },

    onSlash: async function (client, interaction) { },
  };