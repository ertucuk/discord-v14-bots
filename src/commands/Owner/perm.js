const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder,PermissionsBitField } = require("discord.js");
const ertum = require("../../Settings/Setup.json");
const moment = require("moment");
moment.locale("tr");
const ertucuk = require("../../Settings/System");

module.exports = {
    name: "perm",
    description: "",
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

    onLoad: function (client) { },

    onCommand: async function (client, message, args) {
if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return 

let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if (!member) return message.reply({ embeds: [new EmbedBuilder().setTitle(`Yanlış Kullanım!`).setDescription(`Örnek; .perm @Ertu/ID`)]});
if(message.author.id === member.id) return message.reply({content: `Kendine Rol Veremezsin dostum!`, ephemeral: true })

const row = new ActionRowBuilder()
          .addComponents(
            new StringSelectMenuBuilder()
              .setCustomId('roller')
              .setPlaceholder(`${member.user.tag.toString()}'a vereceğiniz permi seçin.`)
              .addOptions([
                { label: 'Vip', description: `${member.user.tag}'a Vip Rolü verirsin.`, value: 'vip', emoji: '970343074150621215' },
                { label: 'Müzisyen', description: `${member.user.tag}'a Müzisyen Rolü verirsin.`, value: 'musician', emoji: '970343048162725928' },
                { label: 'Tasarımcı', description: `${member.user.tag}'a Tasarımcı Rolü verirsin.`, value: 'designer', emoji: '970343065820753940' },
                { label: 'Streamer', description: `${member.user.tag}'a Streamer Rolü verirsin.`, value: 'streamer', emoji: '970343083818508388' },
                { label: 'Sorum Çözücü', description: `${member.user.tag}'a Sorun Çözücü Rolü verirsin.`, value: 'solving', emoji: '970343056048005120' },
    
              ]),
          );
    
const ertu = await message.reply({ content : `${member} kullanıcısına perm eklemek için aşağıdaki menüyü kullanınız`, components: [row] });
const filter = i => i.user.id == message.author.id
let collector = await ertu.createMessageComponentCollector({ filter, time: 30000 })

collector.on("collect", async (interaction) => {

    if (interaction.values[0] === "vip") {
       member.roles.cache.has(ertum.VipRole) ? member.roles.remove(ertum.VipRole) : member.roles.add(ertum.VipRole);
       if(!member.roles.cache.has(ertum.vipRole)) {
         client.channels.cache.find(x => x.name == "rol_log").send({ embeds: [new EmbedBuilder().setDescription(`${member} isimli kişiye **${moment(Date.now()).format("LLL")}** tarihinde ${message.author} tarafından **Vip** adlı rol verildi.`)]})
         ertu.edit({ content:`Başarıyla ${member}, isimli kişiye **Vip** rolü verildi.`, components: [] });
       } else {
         client.channels.cache.find(x => x.name == "rol_log").send({ embeds: [new EmbedBuilder().setDescription(`${member} isimli kişiye **${moment(Date.now()).format("LLL")}** tarihinde ${message.author} tarafından **Vip** adlı rol geri alındı.`)]})
         ertu.edit({ content:`Başarıyla ${member}, isimli kişinin **Vip** rolü geri alındı.`, components: [] });
       };
    }

    if (interaction.values[0] === "musician") {
       member.roles.cache.has(ertum.MusicianRole) ? member.roles.remove(ertum.müzisyenRole) : member.roles.add(ertum.MusicianRole);
       if(!member.roles.cache.has(ertum.MusicianRole)) {
         client.channels.cache.find(x => x.name == "rol_log").send({ embeds: [new EmbedBuilder().setDescription(`${member} isimli kişiye **${moment(Date.now()).format("LLL")}** tarihinde ${message.author} tarafından **Müzisyen** adlı rol verildi.`)]})
         ertu.edit({ content:`Başarıyla ${member}, isimli kişiye **Müzisyen** rolü verildi.`, components: [] });
       } else {
         client.channels.cache.find(x => x.name == "rol_log").send({ embeds: [new EmbedBuilder().setDescription(`${member} isimli kişiye **${moment(Date.now()).format("LLL")}** tarihinde ${message.author} tarafından **Müzisyen** adlı rol geri alındı.`)]})
         ertu.edit({ content:`Başarıyla ${member}, isimli kişinin **Müzisyen** rolü geri alındı.`, components: [] });
       };
    }

   if (interaction.values[0] === "designer") {
       member.roles.cache.has(ertum.DesignerRole) ? member.roles.remove(ertum.tasarımcıRole) : member.roles.add(ertum.DesignerRole);
       if(!member.roles.cache.has(ertum.DesignerRole)) {
         client.channels.cache.find(x => x.name == "rol_log").send({ embeds: [new EmbedBuilder().setDescription(`${member} isimli kişiye **${moment(Date.now()).format("LLL")}** tarihinde ${message.author} tarafından **Tasarımcı** adlı rol verildi.`)]})
         ertu.edit({ content:`Başarıyla ${member}, isimli kişiye **Tasarımcı** rolü verildi.`, components: [] });
       } else {
         client.channels.cache.find(x => x.name == "rol_log").send({ embeds: [new EmbedBuilder().setDescription(`${member} isimli kişiye **${moment(Date.now()).format("LLL")}** tarihinde ${message.author} tarafından **Tasarımcı** adlı rol geri alındı.`)]})
         ertu.edit({ content:`Başarıyla ${member}, isimli kişinin **Tasarımcı** rolü geri alındı.`, components: [] });
       };
    }

   if (interaction.values[0] === "streamer") {
       member.roles.cache.has(ertum.StreamerRole) ? member.roles.remove(ertum.StreamerRole) : member.roles.add(ertum.StreamerRole);
       if(!member.roles.cache.has(ertum.StreamerRole)) {
         client.channels.cache.find(x => x.name == "rol_log").send({ embeds: [new EmbedBuilder().setDescription(`${member} isimli kişiye **${moment(Date.now()).format("LLL")}** tarihinde ${message.author} tarafından **Streamer** adlı rol verildi.`)]})
         ertu.edit({ content:`Başarıyla ${member}, isimli kişiye **Streamer** rolü verildi.`, components: [] });
       } else {
         client.channels.cache.find(x => x.name == "rol_log").send({ embeds: [new EmbedBuilder().setDescription(`${member} isimli kişiye **${moment(Date.now()).format("LLL")}** tarihinde ${message.author} tarafından **Streamer** adlı rol geri alındı.`)]})
         ertu.edit({ content:`Başarıyla ${member}, isimli kişinin **Streamer** rolü geri alındı.`, components: [] });
       };
    }

   if (interaction.values[0] === "solving") {
       member.roles.cache.has(ertum.ProblemSolversRoles) ? member.roles.remove(ertum.ProblemSolversRoles) : member.roles.add(ertum.ProblemSolversRoles);
       if(!member.roles.cache.has(ertum.ProblemSolversRoles)) {
         client.channels.cache.find(x => x.name == "rol_log").send({ embeds: [new EmbedBuilder().setDescription(`${member} isimli kişiye **${moment(Date.now()).format("LLL")}** tarihinde ${message.author} tarafından **Sorun Çözücü** adlı rol verildi.`)]})
         ertu.edit({ content:`Başarıyla ${member}, isimli kişiye **Sorun Çözücü** rolü verildi.`, components: [] });
       } else {
         client.channels.cache.find(x => x.name == "rol_log").send({ embeds: [new EmbedBuilder().setDescription(`${member} isimli kişiye **${moment(Date.now()).format("LLL")}** tarihinde ${message.author} tarafından **Sorun Çözücü** adlı rol geri alındı.`)]})
         ertu.edit({ content:`Başarıyla ${member}, isimli kişinin **Sorun Çözücü** rolü geri alındı.`, components: [] });
       };
    }
   })



     },

    onSlash: async function (client, interaction) { },
  };