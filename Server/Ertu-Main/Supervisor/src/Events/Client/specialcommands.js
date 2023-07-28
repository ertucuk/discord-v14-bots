
const { EmbedBuilder, Events,PermissionFlagsBits } = require('discord.js');
const { timeformat } = require("../../Helpers/Utils");
const cooldownCache = new Map();
const { green } = require("../../../../../../Global/Settings/Emojis.json");
const ertum = require("../../../../../../Global/Settings/Setup.json")
const system = require("../../../../../../Global/Settings/System");
const client = global.client;
const { BsonDatabase,JsonDatabase,YamlDatabase } = require("five.db");
const db = new YamlDatabase();


client.on("messageCreate", async (message) => {
 
    const permsData = db.get(`ozelkomutlar`) || [];  //approval,luhux <3
    if(permsData.length == 0 || !permsData)return;
    if(!system.Mainframe.Prefixs.find((x) => message.content.toLowerCase().startsWith(x)))return;
    const args = message.content.slice(1).trim().split(/ +/g);
    let talentPerm = permsData.find((approvalluhux) => approvalluhux.permName == args[0]);
    if (talentPerm) {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
       if (!message.member.roles.cache.has(talentPerm.staffRoleID) && !message.member.permissions.has(PermissionFlagsBits.Administrator)) return message.reply({ embeds: [new EmbedBuilder().setColor("#2b2d31").setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] })
        if (!member) message.reply({ embeds: [new EmbedBuilder().setColor("#2b2d31").setDescription(`> **Geçerli Bir User Belirtmelisin!**`)] })
        if (member.roles.cache.has(talentPerm.permID)) {
          member.roles.remove(talentPerm.permID)
          message.reply({ embeds: [new EmbedBuilder().setColor("#2b2d31").setDescription(`${member} Kullanıcısından <@&${talentPerm.permID}> Rolü Alındı!`)] });
        } else {
          member.roles.add(talentPerm.permID)
          message.reply({ embeds: [new EmbedBuilder().setColor("#2b2d31").setDescription(`${member} Kullanıcısına <@&${talentPerm.permID}> Rolü Verildi!`)] });
        }
      }

});

  