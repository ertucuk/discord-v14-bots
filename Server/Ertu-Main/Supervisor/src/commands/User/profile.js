const { ApplicationCommandOptionType, EmbedBuilder,ActionRowBuilder,StringSelectMenuBuilder,PermissionsBitField} = require("discord.js");
const voice = require("../../schemas/voiceInfo");
const isimler = require("../../schemas/names");
const axios = require('axios');
const ertucuk = require("../../../../../../Global/Settings/System");
const cezapuan = require("../../schemas/cezapuan")
const moment = require("moment");
const register = require("../../schemas/registerStats");
const client = global.bot;
const levels = require("../../schemas/level");
const canvafy = require("canvafy");
const { profileImage } = require('discord-arts');
const { DiscordBanners } = require('discord-banners');
const kanal = require("../../../../../../Global/Settings/AyarName");

require("moment-duration-format")
moment.locale("tr")
module.exports = {
    name: "profil",
    description: "Kullanıcının discord verilerini gösterir.",
    category: "USER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["kb","info","bilgi","kullanıcıbilgi"],
      usage: ".profil",
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

      let üye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
      if (üye.user.bot) return;

      const row = new ActionRowBuilder()
      .addComponents(
          new StringSelectMenuBuilder()
              .setCustomId('banner')
              .setPlaceholder(`${üye.user.tag.toString()} isimli kullanıcının detaylarını görüntüle!`)
              .addOptions([
                  {
                      label: 'Banner',
                      description: `${üye.user.tag.toString()} bannerını görüntülemek için tıklayınız.`,
                      value: 'banner',
                  },
                  {
                      label: 'Avatar',
                      description: `${üye.user.tag.toString()} avatarını görüntülemek için tıklayınız.`,
                      value: 'avatar',
                  },
              ]),
      );
    
     

      let cezapuanData = await cezapuan.findOne({ userID: üye.user.id });

               const roles = üye.roles.cache.filter(role => role.id !== message.guild.id).sort((a, b) => b.position - a.position).map(role => `<@&${role.id}>`);
                const rolleri = []
                if (roles.length > 6) {
                    const lent = roles.length - 6
                    let itemler = roles.slice(0, 6)
                    itemler.map(x => rolleri.push(x))
                    rolleri.push(`${lent} daha...`)
                } else {
                    roles.map(x => rolleri.push(x))
                }
                let member3 = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        if(member3.presence && member3.presence.clientStatus){
        

          const ertu = await levels.findOne({ guildID: message.guild.id, userID: üye.user.id })
    let status;

    if(üye.presence && üye.presence.status === "dnd") status = "#ff0000"
    if(üye.presence && üye.presence.status === "idle") status = "#ffff00"
    if(üye.presence && üye.presence.status === "online") status = "#00ff00"
    if(üye.presence && üye.presence.status === "offline") status = "#808080"

    const buffer = await profileImage(üye.id, {
    borderColor: '#087996',
    presenceStatus: üye.presence ? üye.presence.status : 'offline',
    badgesFrame: true,
    rankData: {
      currentXp: ertu ? ertu.xp : 1,
      requiredXp: ertu ? ertu.gerekli : 500,
      level: ertu ? ertu.level : 1,
      barColor: '0b7b95'
}
})
                const members = [...message.guild.members.cache.filter(x => !x.user.bot).values()].sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);
                const joinPos = members.map((u) => u.id).indexOf(üye.id);
                const previous = members[joinPos - 1] ? members[joinPos - 1].user : null;
                const next = members[joinPos + 1] ? members[joinPos + 1].user : null;
                const bilgi = `${previous ? `**${previous.tag}** > ` : ""}<@${üye.id}>${next ? ` > **${next.tag}**` : ""}`
               
                let member = message.guild.members.cache.get(üye.id)
                let nickname = member.displayName == üye.username ? "" + üye.username + " [Yok] " : member.displayName
    
      let embed = new EmbedBuilder()
      .setImage('attachment://ertu.png')
      .setThumbnail(üye.user.displayAvatarURL({ dynamic: true, size: 2048 }))
      .addFields(
    {
        name: '**👤 Kullanıcı Bilgisi**',
       value: `
\`•\` Profil: ${üye}
\`•\` ID: \`${üye.id}\`
\`•\` Oluşturulma Tarihi: <t:${Math.floor(member.user.createdTimestamp / 1000)}:R>
       `, inline: false
      },
        {  name: '**📁 Sunucu Bilgisi**',
       value: `
\`•\` Sunucu İsmi: \`${nickname}\`
\`•\` Ceza Puanı: \`${cezapuanData ? cezapuanData.cezapuan : 0}\`
\`•\` Katılma Tarihi: <t:${Math.floor(member.joinedAt / 1000)}:R>
\`•\` Katılım Sırası: \`${(message.guild.members.cache.filter(a => a.joinedTimestamp <= üye.joinedTimestamp).size).toLocaleString()}/${(message.guild.memberCount).toLocaleString()}\`
\`•\` Rolleri: (\`${rolleri.length}\`): ${rolleri.join(", ")}
       `, inline: false },
      
       );
      
      let msg = await message.channel.send({ embeds: [embed], components: [row],files: [{name: "ertu.png", attachment: buffer}]})
      var filter = (menu) => menu.user.id === message.author.id;
      const collector = msg.createMessageComponentCollector({ filter, time: 30000 })
     
      collector.on("collect", async (menu) => {
         if(menu.values[0] === "avatar") {
            menu.reply({ content:`${üye.displayAvatarURL({ dynamic: true, size: 4096 })}`, ephemeral: true })
        } 
        else if(menu.values[0] === "banner") {
          async function bannerXd(user, client) {
            const response = await axios.get(`https://discord.com/api/v9/users/${user}`, { headers: { 'Authorization': `Bot ${client.token}` } });
            if(!response.data.banner) return `Kişinin banneri yok!`
            if(response.data.banner.startsWith('a_')) return `https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.gif?size=512`
            else return(`https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.png?size=512`)
          }
              let banner = await bannerXd(üye.id, client)
              menu.reply({ content: `${banner}`, ephemeral: true })
        
            }
          })

      }},
    onSlash: async function (client, interaction) { },
};