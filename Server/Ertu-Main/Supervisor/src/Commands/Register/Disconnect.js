const { ApplicationCommandOptionType, EmbedBuilder,PermissionsBitField } = require("discord.js");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const ertucuk = require("../../../../../../Global/Settings/System");
module.exports = {
    name: "bağlantıkes",
    description: "Belirttiğiniz kullanıcıyı ses kanalından atarsınız.",
    category: "REGISTER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["kes", "voicekick", "voice-kick", "at", "bağlantıkes"],
      usage: ".bağlantıkes", 
    },
  

    onLoad: function (client) { },

    onCommand: async function (client, message, args, ertuembed) {

        if(!ertum.OwnerRoles.some(ertucum => message.member.roles.cache.has(ertucum)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
        {
        message.reply({ content:`Yeterli yetkin yok!`}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
   
        let user = message.mentions.users.first() || message.guild.members.cache.get(args[0])
        if (!user)
            return message.channel.send({
                content: "Bağlantısını kesmek istediğin kullanıcıyı belirtmelisin!",
            });
        
        if (!user.voice.channel)
            return message.channel.send({
                content: "Bağlantısını kesmek istediğiniz kullanıcı sesli odalarda bulunmuyor.",
            });
        
        if (user.voice.channel.parentId !== ertum.RegisterRoomCategory)
            return message.channel.send({
                content: `Yalnızca "V.Confirmed" odalarından birisinin bağlantısını kesebilirsiniz! Bu kullanıcı şu an "${user.voice.channel.name}" kanalında bulunmakta.`,
            });
        
        if (message.member.roles.highest.rawPosition < user.roles.highest.rawPosition)
            return message.channel.send({
                content: "Rolleri senden yüksek birinin ses kanallarında ki bağlantısını kesemezsin.",
            });
        
        const ertu = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({name: message.author.username,iconURL: message.author.displayAvatarURL({ dynamic: true })})
        .setDescription("<@" + user +"> üyesi " + user.voice.channel.name + " ses kanalından çıkarıldı.")
        user.voice.disconnect();
        message.react(`${client.emoji("ertu_onay")}`)
        message.channel.send({ embeds: [ertu] }).then((message) => {
            setTimeout(() => {
                    message.delete();
                }, 5000);
            })
     },
  };