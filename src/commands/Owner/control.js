const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const ertum = require("../../Settings/setup.json");
const sunucu = require("../../Settings/System");
const ayar = require("../../Settings/NameSettings.json");
module.exports = {
    name: "kontrol",
    description: "",
    category: "NONE",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["control"],
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

        if (!ertum.OwnerRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has()) {
            message.reply({ content: `Yetkin bulunmamakta dostum.` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
            return
          }
          const etkinlik = await client.guilds.cache.get(sunucu.ServerID).roles.cache.find(x => x.name.includes(ayar.etkinlik)).id
          const cekilis = await client.guilds.cache.get(sunucu.ServerID).roles.cache.find(x => x.name.includes(ayar.cekilis)).id
      
          let ertutagli = message.guild.members.cache.filter(s => s.user.username.includes(ertum.tag) && !s.roles.cache.get(ertum.ekipRolu))
          let ertuet = message.guild.members.cache.filter(member => !member.roles.cache.has(cekilis) || !member.roles.cache.has(etkinlik)).size;
          let ertucuk = message.guild.members.cache.filter(m => m.roles.cache.filter(r => r.id !== message.guild.id).size == 0)

          const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder().setStyle(ButtonStyle.Primary).setLabel('1').setCustomId('kayitsiz'),
            new ButtonBuilder().setStyle(ButtonStyle.Primary).setLabel('2').setCustomId('tag'),
            new ButtonBuilder().setStyle(ButtonStyle.Primary).setLabel('3').setCustomId('ec'),
          );

          let ertu = new EmbedBuilder()
          .setFooter({text: ertucuk.SubTitle})
          .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
          .setDescription(`
    ${message.member.toString()}, ${message.guild.name} Sunucusunda rolü olmayan üyelerin rol dağıtım menüsü aşağıda verilmiştir.
    
    \` 1 \` Kayıtsız Rol: (**${ertucuk.size}** kişi)
    \` 2 \` Taglı Rol: (**${ertutagli.size}** kişi)
    \` 3 \` Etkinlik/Çekiliş Rol: (**${ertuet}** kişi)
    `)
        let msg = await message.channel.send({ embeds: [ertu], components: [row] })
        var filter = (button) => button.user.id === message.author.id;
        let collector = await msg.createMessageComponentCollector({ filter, time: 30000 }) 

        collector.on("collect", async (button) => {

            if (button.customId === 'ec') {

                let ertuet = message.guild.members.cache.filter(member => !member.roles.cache.has(etkinlik) || !member.roles.cache.has(cekilis))
                button.reply({
                  content: `
        Etkinlik/Çekiliş rolü olmayan ${ertuet.size} kullanıcıya etkinlik, çekiliş rolleri verildi.`
                })
                message.guild.members.cache.filter(member => !member.roles.cache.has(etkinlik) || !member.roles.cache.has(cekilis)).map(x => x.roles.add([etkinlik, cekilis]));
              }
              if (button.customId === 'tag') {
        
                let ertutagli = message.guild.members.cache.filter(s => s.user.username.includes(ertum.ServerTag) && !s.roles.cache.has(ertum.FamilyRole))
        
                button.reply({
                  content: `
        Tagı olup rolü olmayan ${ertutagli.size} kullanıcıya rol verildi.
        
        Tag Rolü verilen kullanıcılar;
        ${ertutagli.map(x => x || "Rolü olmayan Kullanıcı bulunmamaktadır.")}`
                })
        
                message.guild.members.cache.filter(s => s.user.username.includes(ertum.ServerTag) && !s.roles.cache.has(ertum.FamilyRole)).map(x => x.roles.add(ertum.FamilyRole))
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