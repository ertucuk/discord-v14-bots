const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const moment = require("moment");
moment.locale("tr");
const penals = require("../../schemas/penals");
const forceBans = require("../../schemas/forceBans");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const ertucuk = require("../../../../../../Global/Settings/System");
const { red, green } = require("../../../../../../Global/Settings/Emojis.json")

module.exports = {
    name: "forceban",
    description: "Belirttiğiniz üyeye kalıcı ban atar.",
    category: "PENAL",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["kalıcıban"],
      usage: ".forceban <@user/ID>",
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

    onLoad: function (client) {

        client.penalize = async (guildID, userID, type, active = true, staff, reason, temp = false, finishDate = undefined) => {
            let id = await penals.find({ guildID });
            id = id ? id.length + 1 : 1;
            return await new penals({ id, userID, guildID, type, active, staff, reason, temp, finishDate }).save();
          };

     },

    onCommand: async function (client, message, args) {

    if (!args[0]) { message.channel.send({ content:"Bir üye belirtmeyi unuttun!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
    message.react(red)
    return }
    const user = message.mentions.users.first() || await client.fetchUser(args[0]);
    if (!user) { message.channel.send({ content:"Böyle bir kullanıcıyı bulamadım!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
    message.react(red)
    return }
    const ban = await forceBans.findOne({ guildID: message.guild.id, userID: user.id });
    if (ban) {
    message.react(red)
    message.channel.send({ content :"Bu üye zaten banlıymış!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    const reason = args.slice(1).join(" ") || "Kalıcı Ban!";
    const member = message.guild.members.cache.get(user.id);
    if (message.guild.members.cache.has(user.id) && message.member.roles.highest.position <= message.guild.members.cache.get(user.id).roles.highest.position) return message.channel.send({ content:"Kendinle aynı yetkide ya da daha yetkili olan birini banlayamazsın!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
    if (member && !member.bannable) {
    message.react(red)
    message.channel.send({ content :"Bu üyeyi banlayamıyorum!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); }

    let logChannel = client.channels.cache.find(x => x.name === "ban_log");
    if(!logChannel) {
      let hello = new Error("BAN LOG KANALI AYARLANMAMIS! LUTFEN SETUPTAN KURULUMU YAPINIZ!");
      console.log(hello);
    }

    if (ertucuk.Mainframe.dmMessages) user.send({ content :`**${message.guild.name}** sunucusundan, **${message.author.tag}** tarafından, **${reason}** sebebiyle **kalıcı olarak** banlandınız!`}).catch(() => {});

    message.guild.members.ban(user.id, { reason }).catch(() => {});
    await new forceBans({ guildID: message.guild.id, userID: user.id, staff: message.author.id }).save();
    const penal = await client.penalize(message.guild.id, user.id, "FORCE-BAN", true, message.author.id, reason);

    message.reply({ content :`${green} ${member ? member.toString() : user.username} üyesi, ${message.author} tarafından, \`${reason}\` nedeniyle **kalıcı olarak** banlandı! \`(Ceza ID: #${penal.id})\``}).then((e) => setTimeout(() => { e.delete(); }, 50000));
    message.react(green)

    const log = new EmbedBuilder()
    .setDescription(`
    **${member ? member.toString() : user.username}** adlı kullanıcıya ${message.author} tarafından ban atıldı.`)
    .addFields(
{ name: "Banlanan", value: `${member ? member.toString() : user.username}`, inline: true},
{ name: "Banlayan", value: `${message.author}`, inline: true},
{ name: "Sebep", value: ` ${reason}`, inline: true},
      )
      .setFooter({ text:`${moment(Date.now()).format("LLL")}    (Ceza ID: #${penal.id})` })
      logChannel.send({ embeds: [log]});



     },

    onSlash: async function (client, interaction) { },
  };