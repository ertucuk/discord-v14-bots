const { ApplicationCommandOptionType, EmbedBuilder,PermissionsBitField } = require("discord.js");
const isimler = require("../../schemas/names");
const ertum = require("../../Settings/Setup.json");
const { red , green } = require("../../Settings/Emojis.json");
const ertucuk = require("../../Settings/System");

module.exports = {
    name: "name",
    description: "",
    category: "NONE",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["isim","i","nick"],
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
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    
    if(!ertum.ConfirmerRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
    {
    message.react(red)
    message.reply({ content:`Yeterli yetkin yok!`}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    if(!uye) 
    {
    message.react(red)
    message.reply({ content:`bir kullanıcı etiketlemelisin ya da ID'sini girmelisin.\nÖrn: .isim @Ertu Ertu 23`}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    if(message.author.id === uye.id) 
    {
    message.react(red)
    message.reply({ content:`Kendi ismini değiştiremezsin. Booster isen \`.zengin\` komudunu kullanarak ismini değiştirebilirsin.`}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    if(!uye.manageable) 
    {
    message.react(red)
    message.reply({ content:`Böyle birisinin ismini değiştiremiyorum.`}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    if(message.member.roles.highest.position <= uye.roles.highest.position) 
    {
    message.react(red)
    message.reply({ content:`Senden yüksekte olan birisinin ismini değiştiremezsin.`}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    const data = await isimler.findOne({ guildID: message.guild.id, userID: uye.user.id });
    args = args.filter(a => a !== "" && a !== " ").splice(1);
    let setName;
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
    let yaş = args.filter(arg => !isNaN(arg))[0] || "";
    if(!isim && !yaş) 
    {
    message.react(red)
    message.reply({ content:`\`${prefix}isim <@Ertu/ID> <Isim> <Yas>\``}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    if(!yaş) 
    { setName = `${ertum.ServerUntagged} ${isim}`;
    } else { setName = `${ertum.ServerUntagged} ${isim} | ${yaş}`;
  } uye.setNickname(`${setName}`).catch(err => message.reply({ content:`İsim çok uzun.`}))

    message.react(green)

let ertu = new EmbedBuilder()
.setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true })})
.setDescription(`
${green} ${uye.toString()} üyesinin ismi başarıyla \` ${setName} \` olarak değiştirildi.
`)

message.channel.send({ embeds: [ertu] , ephemeral: false })

await isimler.findOneAndUpdate({ guildID: message.guild.id, userID: uye.user.id }, { $push: { names: { name: setName, yetkili: message.author.id,  rol: "İsim Değiştirme", date: Date.now() } } }, { upsert: true });
     },

    onSlash: async function (client, interaction) { },
  };