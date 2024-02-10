const { ApplicationCommandOptionType, EmbedBuilder,PermissionsBitField } = require("discord.js");
const isimler = require("../../../../../../Global/Schemas/names");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const { red , green } = require("../../../../../../Global/Settings/Emojis.json");
const kanal = require("../../../../../../Global/Settings/AyarName");

module.exports = {
    name: "name",
    description: "Belirttiğiniz kişinin isim ve yaşını düzeltirsiniz",
    category: "REGISTER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["isim","i","nick"],
      usage: ".isim <@user/ID> <Isim> <Yaş>",
    },
  

    onLoad: function (client) { },

    onCommand: async function (client, message, args) {

      let kanallar = kanal.KomutKullanımKanalİsim;
      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    
    if (!ertum.ConfirmerRoles.some(ertucum => message.member.roles.cache.has(ertucum)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return messageReactAndReply(`${client.emoji("ertu_carpi")}`, "Yeterli yetkin yok!");
      }
      
      if (!member) {
        return messageReactAndReply(`${client.emoji("ertu_carpi")}`, "Bir kullanıcı etiketlemelisin ya da ID'sini girmelisin.\nÖrn: .isim @Ertu Ertu 23");
      }
      
      if (message.author.id === member.id) {
        return messageReactAndReply(`${client.emoji("ertu_carpi")}`, "Kendi ismini değiştiremezsin.");
      }
      
      if (!member.manageable) {
        return messageReactAndReply(`${client.emoji("ertu_carpi")}`, "Böyle birisinin ismini değiştiremiyorum.");
      }
      
      if (message.member.roles.highest.position <= member.roles.highest.position) {
        return messageReactAndReply(`${client.emoji("ertu_carpi")}`, "Senden yüksekte olan birisinin ismini değiştiremezsin.");
      }

      function messageReactAndReply(emoji, content) {
        message.react(emoji);
        message.reply({ content }).then((e) => setTimeout(() => { e.delete(); }, 5000));
      }
      
    const data = await isimler.findOne({ guildID: message.guild.id, userID: member.user.id });
    args = args.filter(a => a !== "" && a !== " ").splice(1);
    let setName;
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
    let yaş = args.filter(arg => !isNaN(arg))[0] || "";
    if(!isim && !yaş) 
    {
message.react(`${client.emoji("ertu_carpi")}`)
    message.reply({ content:`\`.isim <@User/ID> <Isim> <Yas>\``}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    if(!yaş) 
    { setName = `${ertum.ServerUntagged} ${isim}`;
    } else { setName = `${ertum.ServerUntagged} ${isim} | ${yaş}`;
  } member.setNickname(`${setName}`).catch(err => message.reply({ content:`İsim çok uzun.`}))
  message.react(`${client.emoji("ertu_onay")}`)

let ertu = new EmbedBuilder()
.setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true })})
.setDescription(`
${client.emoji("ertu_onay")} ${member.toString()} üyesinin ismi başarıyla \` ${setName} \` olarak değiştirildi.
`)

message.channel.send({ embeds: [ertu] , ephemeral: false })

await isimler.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { names: { name: setName, yetkili: message.author.id,  rol: "İsim Değiştirme", date: Date.now() } } }, { upsert: true });
     },
  };

