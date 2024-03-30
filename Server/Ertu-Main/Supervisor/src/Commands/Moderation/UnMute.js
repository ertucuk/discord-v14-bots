const { ApplicationCommandOptionType, PermissionsBitField,ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const ertum = require("../../../../../../Global/Settings/Setup.json")
const ertucuk = require("../../../../../../Global/Settings/System");
const penals = require("../../../../../../Global/Schemas/penals");
const moment = require("moment");
moment.locale("tr");
const { red, green } = require("../../../../../../Global/Settings/Emojis.json")
const kanal = require("../../../../../../Global/Settings/AyarName");


module.exports = {
    name: "unmute",
    description: "Susturulmuş kullanıcının susturmasını açarsınız.",
    category: "STAFF",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: [],
      usage: ".unmute <@user/ID>",
    },
 
    onLoad: function (client) { },

    onCommand: async function (client, message, args) {

      let kanallar = kanal.KomutKullanımKanalİsim;
if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !ertum.CMuteHammer.some(x => message.member.roles.cache.has(x))) 
        {
        message.react(`${client.emoji("ertu_carpi")}`)
        message.channel.send({ content: "Yeterli yetkin bulunmuyor!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) 
        {
        message.react(`${client.emoji("ertu_carpi")}`)
        message.channel.send( { content:"Bir üye belirtmelisin!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
        if (!ertum.MutedRole.some(x => member.roles.cache.has(x)) && !ertum.VMutedRole.some(x => member.roles.cache.has(x))) 
        {
        message.react(`${client.emoji("ertu_carpi")}`)
        message.channel.send( { content:"Bu üye muteli değil!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));   
        return }
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && member.roles.highest.position >= message.member.roles.highest.position) 
        {
        message.react(`${client.emoji("ertu_carpi")}`)
        message.channel.send( { content:"Kendinle aynı yetkide ya da daha yetkili olan birinin susturmasını kaldıramazsın!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
        if (!member.manageable) 
        {
        message.react(`${client.emoji("ertu_carpi")}`)
        message.channel.send( { content:"Bu üyenin susturmasını kaldıramıyorum!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
        
        let logChannel = client.channels.cache.find(x => x.name === "mute_log");
        let vlogChannel = client.channels.cache.find(x => x.name === "vmute_log");
        if(!logChannel) {
          let hello = new Error("mute log kanalı ayarlanmamış! lütfen setuptan kurulumu yapınız!");
          console.log(hello);
        }
        if(!vlogChannel) {
          let hello = new Error("Voice mute log kanalı ayarlanmamış! lütfen setuptan kurulumu yapınız!");
          console.log(hello);
        }

        const chatmute = await penals.findOne({ userID: member.id, active: true, type: "Chat-Mute" })
        const sesmute = await penals.findOne({ userID: member.id, active: true, type: "Voice-Mute" })

        let mute = new ButtonBuilder()
        .setCustomId("mute")
        .setLabel("Metin Kanallarında")
        .setStyle(chatmute ? ButtonStyle.Success : ButtonStyle.Secondary)
        .setDisabled(!ertum.MutedRole.some(x => member.roles.cache.has(x)));

        let vmute = new ButtonBuilder()
        .setCustomId("vmute")
        .setLabel("Ses Kanallarında")
        .setStyle(sesmute ? ButtonStyle.Success : ButtonStyle.Secondary)
        .setDisabled(!ertum.VMutedRole.some(x => member.roles.cache.has(x)));

        let iptal = new ButtonBuilder()
        .setCustomId("iptal")
        .setLabel("İşlemi İptal Et")
        .setStyle(ButtonStyle.Danger)
        
        const row = new ActionRowBuilder()
        .addComponents([ mute, vmute, iptal ]);

        let description = ``
        if(chatmute) description = `metin kanallarında **\`#${chatmute.id}\`** ceza numaralı susturulmasını`
        if(sesmute) description = `ses kanallarında ki **\`#${sesmute.id}\`** ceza numaralı susturulmasını`
        if(chatmute && sesmute) description = `**\`#${chatmute.id}\`**, **\`#${sesmute.id}\`** ceza numaralarına sahip metin ve ses susturulmasını`
        let ertu = new EmbedBuilder()  
        .setDescription(`**Merhaba!** ${message.author} 
Belirtilen ${member} üyesinin ${description} kaldırmak için aşağıda ki düğmeleri kullanabilirsiniz.`)
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
        .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));
    
      let msg = await message.channel.send({ embeds: [ertu], components: [row] })
      var filter = button => button.user.id === message.author.id;
      let collector = await msg.createMessageComponentCollector({ filter, time: 30000 })
    
      collector.on("collect", async (button) => {
    
        if (button.customId === "mute") {
          await button.deferUpdate();
    
          mute.setStyle(ButtonStyle.Secondary).setDisabled(true);
    
          message.react(`${client.emoji("ertu_onay")}`)
          member.roles.remove(ertum.MutedRole);
          const data = await penals.findOne({ userID: member.user.id, guildID: message.guild.id, type: "Chat-Mute", active: true });
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
          .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
          .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));
      
          await msg.edit({ embeds: [ertu], components: [row] });
        }
        if (button.customId === "vmute") {
          await button.deferUpdate();
    
          vmute.setStyle(ButtonStyle.Secondary).setDisabled(true);
    
          member.roles.remove(ertum.VMutedRole);
          if (member.voice.channelId && member.voice.serverMute) member.voice.setMute(false);
          const data = await penals.findOne({ userID: member.user.id, guildID: message.guild.id, type: "Voice-Mute", active: true });
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
          .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
          .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));
      
          await msg.edit({ embeds: [ertu], components: [row] });
        }

        if (button.customId === "iptal") {
          message.react(`${client.emoji("ertu_onay")}`)
          msg.delete().catch(err => {})
          button.reply({ content:`${client.emoji("ertu_onay")} Başarıyla mute işlemleri menüsü kapatıldı`, embeds: [], components: [], ephemeral: true});
        }
      })
     },

  };