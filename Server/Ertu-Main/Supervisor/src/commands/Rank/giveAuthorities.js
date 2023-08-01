const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,PermissionsBitField } = require("discord.js");
const coin = require("../../../../../../Global/Schemas/coin");
const yetkis = require("../../../../../../Global/Schemas/yetkis");
const tagli = require("../../../../../../Global/Schemas/taggorev");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const ertucuk = require("../../../../../../Global/Settings/System");
const { red } = require("../../../../../../Global/Settings/Emojis.json");
const kanal = require("../../../../../../Global/Settings/AyarName");

module.exports = {
    name: "yetkialdır",
    description: "",
    category: "RANK",
    cooldown: 0,
    command: {
        enabled: true,
        aliases: ["yetki-aldır","yetkili","yetkiliyap","yetkili-yap"],
        usage: "",
    },
   

    onLoad: function (client) { },

    onCommand: async function (client, message, args) {

        let kanallar = kanal.KomutKullanımKanalİsim;
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

        if(!ertum.YetkiliAlimDM.some(ertuu => message.member.roles.cache.has(ertuu)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
        {
        message.react(red)
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
        const yetkiData = await yetkis.findOne({ guildID: message.guild.id, userID: message.author.id });
        if (yetkiData && yetkiData.yetkis.includes(member.user.id)) {
            message.channel.send({ content: "Bu üyeye zaten daha önce yetki aldırılmış!" }).then((e) => setTimeout(() => { e.delete(); }, 5000));
            return
        }

        const yetkiliembed = new EmbedBuilder()
        .setFooter({text: ertucuk.SubTitle})
        .setDescription(`${member.toString()} üyesi ${message.author} tarafından ${ertum.StartAuthority.map(x => `<@&${x}>`)} rolleri verilerek yetkili olarak işaretlendi.`)
        const msg = await message.reply({ embeds: [yetkiliembed]});

        await yetkis.findOneAndUpdate({ guildID: message.guild.id , userID:message.member.id }, { $inc: {count:1}, $push:{ users: {memberId:member.id,date:Date.now()}}},{upsert:true})
        member.roles.add(ertum.StartAuthority)
    },

};