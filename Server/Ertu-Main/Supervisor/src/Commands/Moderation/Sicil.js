const { ApplicationCommandOptionType, EmbedBuilder , PermissionsBitField, StringSelectMenuBuilder, ActionRowBuilder} = require("discord.js");
const moment = require("moment");
moment.locale("tr");
const { YamlDatabase } = require("five.db");
const db = new YamlDatabase();
const penals = require("../../../../../../Global/Schemas/penals");
const { green , red } = require("../../../../../../Global/Settings/Emojis.json")
const ertucuk = require("../../../../../../Global/Settings/System");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const kanal = require("../../../../../../Global/Settings/AyarName");
const ceza = require("../../../../../../Global/Schemas/ceza");

module.exports = {
    name: "sicil",
    description: "Kullanıcının sicilini gösterir.",
    category: "PENAL",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: [],
      usage: ".sicil <@user/ID>",  
    },

    onLoad: function (client) { },

    onCommand: async function (client, message, args) {

      let kanallar = kanal.KomutKullanımKanalİsim;
      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 
      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !ertum.CMuteHammer.some(x => message.member.roles.cache.has(x))) return message.channel.send({ content:"Yeterli yetkin bulunmuyor!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));

      let member = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.member;
      if (!member) { message.channel.send({ content:"Böyle bir kullanıcı bulunamadı!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
      message.react(`${client.emoji("ertu_carpi")}`)
      return  
    }
    
    const cezalar = await penals.find({ guildID: message.guild.id, userID: member.id })
    const cezaData = await ceza.findOne({ guildID: message.guild.id, userID: member.id });

    if (cezalar.length === 0) {
      return await message.reply({ embeds: [new EmbedBuilder().setDescription( `${client.emoji("ertu_onay")} ${member.toString()} üyesinin sicili temiz!`)]}).then((e) => setTimeout(() => { e.delete(); }, 5000));
    }

    const selectMenu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
      .setCustomId("MEMBER_PENALS")
      .setPlaceholder('Sicil Kayıtları (1-25)')
      .setMaxValues(1)
      .setMinValues(1)
      .addOptions([
         ...cezalar.slice(0, 25).map((x) => ({
              value: `${x.id}`,
              label: `${x.type} (#${x.id})`,
              description: `${x.reason.length > 100 ? x.reason.substring(0, 98).trim() + '..' : x.reason}`,
            }))
      ])
    ) 

    const secondMenu = new ActionRowBuilder().addComponents(
      cezalar.length > 25 
        ?
          new StringSelectMenuBuilder()
            .setCustomId("MEMBER_PENALSS")
            .setPlaceholder('Sicil Kayıtları (26-50)')
            .setMaxValues(1)
            .setMinValues(1)
            .addOptions([
              ...cezalar.slice(25, 50).map((x) => ({
                    value: `${x.id}`,
                    label: `${x.type} (#${x.id})`,
                    description: `${x.reason.length > 100 ? x.reason.substring(0, 98).trim() + '..' : x.reason}`,
                  }))
            ])  
        : 
          new StringSelectMenuBuilder()
            .setCustomId("MEMBER_PENALSS")
            .setPlaceholder('Sicil Kayıtları (26-50)')
            .setDisabled(true)
            .addOptions([
              {
                label: 'null',
                value: 'null yok bişe'
              }
            ])  
    )

    let ceza1 = [
        ["ID", "Tarih", "Ceza", "Sebep"]
    ];

    let ceza2 = [
        ["ID", "Ceza", "Tarih", "Bitiş", "Yetkili", "Sebep"]
    ]; 
    
    cezalar.map(x => {
      ceza1.push([x.id, `${moment(x.date).format("LLL")}`, x.type, x.reason])
    })

    cezalar.map(x => {
      ceza2.push([x.id, x.type, `${moment(x.date).format("LLL")}`, `${x.finishDate ? `${moment(x.finishDate).format("LLL")}` : "Yok"}`, client.users.cache.get(x.staff).tag, x.reason])
    })

    
    let tip = cezalar.map(x => (x.type))
    let chatMute = tip.filter(x => x == "Chat-Mute").length || 0
    let voiceMute = tip.filter(x => x == "Voice-Mute").length || 0
    let jail = tip.filter(x => x == "Jail").length || 0
    let ban = tip.filter(x => x == "Ban" || x == "FORCE-BAN").length || 0
    let reklam = tip.filter(x => x == "Reklam").length || 0
    let warn = tip.filter(x => x == "Uyarı").length || 0
    
    const embed = new EmbedBuilder()
      .setDescription(`${member} (\`${member.id}\`) adlı kullanıcının cezaları: (\`${cezaData ? cezaData.ceza.length : 0}\`)`)
      .addFields(
        { name: "Chat Mute", value: `${chatMute}`, inline: true },
        { name: "Ses Mute", value: `${voiceMute}`, inline: true },
        { name: "Jail", value: `${jail}`, inline: true },
      )
      .addFields(
        { name: "Ban", value: `${ban}`, inline: true },
        { name: "Reklam", value: `${reklam}`, inline: true },
        { name: "Uyarı", value: `${warn}`, inline: true },
      )

    if (cezalar.length > 25) {
      return await message.reply({
        embeds: [embed],
        components: [selectMenu, secondMenu]
      })
    } else {
      await message.reply({
        embeds: [embed],
        components: [selectMenu]
      })
    }
  
    }
};