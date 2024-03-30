const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,PermissionsBitField } = require("discord.js");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const ertucuk = require("../../../../../../Global/Settings/System");
const kanal = require("../../../../../../Global/Settings/AyarName");
const userTask = require("../../../../../../Global/Schemas/userTask");
const tasks = require("../../../../../../Global/Schemas/tasks");
const yetkis = require("../../../../../../Global/Schemas/yetkialdir");
module.exports = {
    name: "yetkialdır",
    description: "Yetkili",
    category: "STAT",
    cooldown: 0,
    command: {
        enabled: true,
        aliases: ["yetki-aldır","yetkili","yetkiliyap","yetkili-yap","yetkiver"],
        usage: ".yetkiiliyap",
    },
   

    onLoad: function (client) { },

    onCommand: async function (client, message, args) {

        let kanallar = kanal.KomutKullanımKanalİsim;
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

        if(!ertum.ConfirmerRoles.some(ertuu => message.member.roles.cache.has(ertuu)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
        {
        message.react(`${client.emoji("ertu_carpi")}`)
        message.reply({ content:`Yeterli yetkin yok!`}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) {
            message.channel.send({ content: "Bir üye belirtmeyi unuttun!" }).then((e) => setTimeout(() => { e.delete(); }, 5000));
            return
        }
        if (!member.user.displayName.includes(ertum.ServerTag)) {
            message.channel.send({ content: "Bu üyede tagımız bulunmuyor!" }).then((e) => setTimeout(() => { e.delete(); }, 5000));
            return
        }
        const yetkiData = await yetkis.findOne({ guildID: message.guild.id});
        if(!yetkiData) new yetkis({ guildID: message.guild.id }).save();
        if (yetkiData) {
        const isaretlenenIDAsNumber = parseInt(yetkiData.ısaretlenenID, 10);
        if (isaretlenenIDAsNumber === parseInt(member.id, 10)) {
        message.react(`${client.emoji("ertu_carpi")}`)
        message.channel.send({ content:"Bu üye daha önceden yetkili olarak işaretlenmiş!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return;
        }
      }

        // Görev 

        const checkForTask = await userTask.findOne({ userId: message.author.id });

        if (!checkForTask) {
            new userTask({
                userId: message.author.id,
                roleId: message.member.roles.highest.id
            }).save()
        }

        const dataForTask = await userTask.findOne({ userId: message.author.id });

        if (dataForTask) {
            const activeTask = await tasks.findOne({ currentRole: dataForTask.roleId })
            
            if (activeTask) {
                if (!dataForTask.completeds?.staff && dataForTask.counts?.staff > activeTask.requiredCounts.staff) {
                    await userTask.findOneAndUpdate(
                        { userId: message.author.id },
                        { $set: {'counts.staff': 0, 'completeds.staff': true} },
                        { upsert: true, new: true }
                    )
                } else {
                    await userTask.findOneAndUpdate(
                        { userId: message.author.id },
                        { $inc: { 'counts.staff': 1 } },
                        { upsert: true, new: true }
                    )
                }
            }
        }

        // Görev

      const row = new ActionRowBuilder()
      .addComponents(
      new ButtonBuilder()
      .setCustomId("evet")
      .setLabel("Evet")
      .setStyle(ButtonStyle.Success),
    
      new ButtonBuilder()
      .setCustomId("hayir")
      .setLabel("Hayır")
      .setStyle(ButtonStyle.Danger)
      );
    
      const row2 = new ActionRowBuilder()
      .addComponents(
      new ButtonBuilder()
      .setCustomId("evet")
      .setLabel("Evet")
      .setStyle(ButtonStyle.Success)
      .setDisabled(true),
    
      new ButtonBuilder()
      .setCustomId("hayir")
      .setLabel("Hayır")
      .setStyle(ButtonStyle.Danger)
      .setDisabled(true),
      );

      const onayembed = new EmbedBuilder() 
      .setAuthor({ name: member.displayName, iconURL: member.user.avatarURL({ dynamic: true })})
      .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true })})
      .setDescription(`${member.toString()}, ${message.member.toString()} üyesi seni yetkili olarak başlatmak istiyor. Kabul ediyor musun?`)

      const msg = await message.reply({ content: `${member.toString()}`, embeds: [onayembed], components: [row]});
      var filter = button => button.user.id === member.user.id;
      let collector = await msg.createMessageComponentCollector({ filter, time: 60000 })

      collector.on("collect", async (button) => {

        if(button.customId === "evet") {
            await button.deferUpdate();
    
            message.react(`${client.emoji("ertu_onay")}`)
            const yetkiliembed = new EmbedBuilder() 
            .setAuthor({ name: member.displayName, iconURL: member.user.avatarURL({ dynamic: true })})
            .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true })})
            .setDescription(`${client.emoji("ertu_onay")} ${member.toString()} üyesi ${message.author} tarafından ${ertum.StartAuthority.map(x => `<@&${x}>`)} rolleri verilerek yetkili olarak işaretlendi.`)
            member.roles.add(ertum.StartAuthority)
            msg.edit({ embeds: [yetkiliembed], components: [row2]})
            await yetkis.findOneAndUpdate({ guildID: message.guild.id , userID: message.member.id }, { $inc: {count:1}, $push:{ users: {memberId:member.id,date:Date.now()}}},{upsert:true})
            const existingDocs = await yetkis.find({});
            for (const doc of existingDocs) {
            doc.ısaretlenenID = [doc.ısaretlenenID];
            await yetkis.updateOne({ _id: doc._id }, { $set: { ısaretlenenID: member.id } });
            }
          }
    
          if(button.customId === "hayir") {
            await button.deferUpdate();
    
            message.react(`${client.emoji("ertu_carpi")}`)
          const embedss = new EmbedBuilder() 
          .setAuthor({ name: member.displayName, iconURL: member.user.avatarURL({ dynamic: true })})
          .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true })})
          .setDescription(`${client.emoji("ertu_carpi")} ${member.toString()} Adlı kullanıcı ${message.author} kişisinin taglı aldırma isteğini reddetti.`)
          msg.edit({ embeds: [embedss], components: [row2]})
          }
      })
    } 
};
