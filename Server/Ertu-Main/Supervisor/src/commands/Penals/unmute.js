const { ApplicationCommandOptionType, PermissionsBitField,ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const ertum = require("../../../../../../Global/Settings/Setup.json")
const ertucuk = require("../../../../../../Global/Settings/System");
const penals = require("../../schemas/penals");
const moment = require("moment");
moment.locale("tr");
const { red, green } = require("../../../../../../Global/Settings/Emojis.json")
const kanal = require("../../../../../../Global/Settings/AyarName");


module.exports = {
    name: "unmute",
    description: "Susturulmuş kullanıcının susturmasını açarsınız.",
    category: "PENAL",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: [],
      usage: ".unmute <@user/ID>",
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

      let kanallar = kanal.KomutKullanımKanalİsim;
if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !ertum.CMuteHammer.some(x => message.member.roles.cache.has(x))) 
        {
        message.react(red)
        message.channel.send({ content: "Yeterli yetkin bulunmuyor!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) 
        {
        message.react(red)
        message.channel.send( { content:"Bir üye belirtmelisin!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
        if (!ertum.MutedRole.some(x => member.roles.cache.has(x)) && !ertum.VMutedRole.some(x => member.roles.cache.has(x))) 
        {
        message.react(red)
        message.channel.send( { content:"Bu üye muteli değil!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));   
        return }
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && member.roles.highest.position >= message.member.roles.highest.position) 
        {
        message.react(red)
        message.channel.send( { content:"Kendinle aynı yetkide ya da daha yetkili olan birinin susturmasını kaldıramazsın!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
        if (!member.manageable) 
        {
        message.react(red)
        message.channel.send( { content:"Bu üyenin susturmasını kaldıramıyorum!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
        
        let logChannel = client.channels.cache.find(x => x.name === "mute_log");
        let vlogChannel = client.channels.cache.find(x => x.name === "vmute_log");
        if(!logChannel) {
          let hello = new Error("MUTE LOG KANALI AYARLANMAMIS! LUTFEN SETUPTAN KURULUMU YAPINIZ!");
          console.log(hello);
        }
        if(!vlogChannel) {
          let hello = new Error("VOICE MUTE LOG KANALI AYARLANMAMIS! LUTFEN SETUPTAN KURULUMU YAPINIZ!");
          console.log(hello);
        }

        let mute = new ButtonBuilder()
        .setCustomId("mute")
        .setLabel("Chat Mute")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("997820341718089739");
    
        let vmute = new ButtonBuilder()
        .setCustomId("vmute")
        .setLabel("Voice Mute")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("997876085624668231");
    
        if (!ertum.MutedRole.some(x => member.roles.cache.has(x))) {
            mute.setStyle(ButtonStyle.Secondary).setDisabled(true);
        } else {
            mute.setStyle(ButtonStyle.Success);
        }
    
        if (!ertum.VMutedRole.some(x => member.roles.cache.has(x))) {
            vmute.setStyle(ButtonStyle.Secondary).setDisabled(true);
        } else {
            vmute.setStyle(ButtonStyle.Danger);
        }
    
        const row = new ActionRowBuilder()
        .addComponents([ mute, vmute ]);
      
        let ertu = new EmbedBuilder()  
        .setDescription(`${member} üyesinin kaldırmak istediğiniz chat/voice mute cezalarını butonla aşağıdan seçiniz.`)
        .setFooter({ text: `Kapalı olan buton mutesi olmadığını gösterir kullanılamaz.`})
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
        .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));
    
      let msg = await message.channel.send({ embeds: [ertu], components: [row] })
      var filter = button => button.user.id === message.author.id;
      let collector = await msg.createMessageComponentCollector({ filter, time: 30000 })
    
      collector.on("collect", async (button) => {
    
        if (button.customId === "mute") {
          await button.deferUpdate();
    
          mute.setStyle(ButtonStyle.Secondary).setDisabled(true);
    
          message.react(green)
          member.roles.remove(ertum.MutedRole);
          const data = await penals.findOne({ userID: member.user.id, guildID: message.guild.id, type: "CHAT-MUTE", active: true });
          if (data) {
            data.active = false;
            await data.save();
          }
    
          if (ertucuk.Mainframe.dmMessages) member.send({ content:`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından susturmanız kaldırıldı!`}).catch(() => {});
    
            const log1 = new EmbedBuilder()
            .setAuthor({ name: member.user.username, iconURL:  member.user.displayAvatarURL({ dynamic: true }) })
            .setColor("#2f3136")
            .setDescription(`
            **${member.user.tag}** adlı kullanıcının **${message.author.tag}** tarafından Chat cezası kaldırıldı.    
      `)
      .addFields(
{ name: "Affedilen", value: `${member ? member.toString() : user.username}`, inline: true},
{ name: "Affeden", value: `${message.author}`, inline: true},
      )
      .setFooter({ text:`${moment(Date.now()).format("LLL")}` })
       await logChannel.send({ embeds: [log1]});
    
          let ertu = new EmbedBuilder()  
          .setDescription(`${member.toString()} üyesinin susturması, ${message.author} tarafından kaldırıldı.`)
          .setFooter({ text: `Kapalı olan buton mutesi olmadığını gösterir kullanılamaz.`})
          .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
          .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));
      
          await msg.edit({ embeds: [ertu], components: [row] });
        }
        if (button.customId === "vmute") {
          await button.deferUpdate();
    
          vmute.setStyle(ButtonStyle.Secondary).setDisabled(true);
    
          member.roles.remove(ertum.VMutedRole);
          if (member.voice.channelId && member.voice.serverMute) member.voice.setMute(false);
          const data = await penals.findOne({ userID: member.user.id, guildID: message.guild.id, type: "VOICE-MUTE", active: true });
          if (data) {
            data.active = false;
            data.removed = true;
            await data.save();
          }
    
          if (ertucuk.Mainframe.dmMessages) member.send({ content:`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından **sesli kanallarda** olan susturmanız kaldırıldı!`}).catch(() => {});
    
          const log = new EmbedBuilder()
          .setAuthor({ name: member.user.username, iconURL:  member.user.displayAvatarURL({ dynamic: true }) })
            .setColor("#2f3136")
            .setDescription(`
            **${member.user.tag}** adlı kullanıcının **${message.author.tag}** tarafından Ses cezası kaldırıldı.    
      `)
      .addFields(
        { name: "Affedilen", value: `${member ? member.toString() : user.username}`, inline: true},
        { name: "Affeden", value: `${message.author}`, inline: true},
              )
      .setFooter({ text:`${moment(Date.now()).format("LLL")}` })
       await vlogChannel.send({ embeds: [log]});
    
          let ertu = new EmbedBuilder()  
          .setDescription(`${member.toString()} üyesinin **sesli kanallarda** susturması, ${message.author} tarafından kaldırıldı.`)
          .setFooter({ text: `Kapalı olan buton mutesi olmadığını gösterir kullanılamaz.`})
          .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
          .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));
      
          await msg.edit({ embeds: [ertu], components: [row] });
        }
    
      })
     },

    onSlash: async function (client, interaction) { },
  };