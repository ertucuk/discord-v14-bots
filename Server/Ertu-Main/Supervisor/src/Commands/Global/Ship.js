const { ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField,AttachmentBuilder,ActionRowBuilder,ButtonBuilder,ButtonStyle } = require("discord.js");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const ertucuk = require("../../../../../../Global/Settings/System");
const Canvas = require('canvas')
const {red,green} = require("../../../../../../Global/Settings/Emojis.json"); 

module.exports = {
    name: "ship",
    description: "Random veya belirttiğiniz üyeyi shipler",
    category: "USER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["lulusik", "ertusorryman"],
      usage: ".ship",
    },


    onLoad: function (client) { },

    onCommand: async function (client, message, args) { 

        let channels = ["bot-commands","ship-chat","ship"]
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !channels.includes(message.channel.name)) return message.reply({ content: `${channels.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

        const ertuman = ertum.ManRoles[0];
        const ertuwoman = ertum.GirlRoles[0];
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.filter(m => m.user.bot === false && message.member.roles.cache.has(ertuman) ? m.roles.cache.get(ertuwoman) : m.roles.cache.get(ertuman)).random();
        
    let replies = [
      '5% Uyumlu!',     '3% Uyumlu!',
      '10% Uyumlu!',    '14% Uyumlu!',
      '17% Uyumlu!',    '20% Uyumlu!',
      '22% Uyumlu!',    '25% Uyumlu!',
      '24% Uyumlu!',    '27% Uyumlu!',
      '32% Uyumlu!',    '36% Uyumlu!',
      '34% Uyumlu!',    '39% Uyumlu!',
      '42% Uyumlu!',    '45% Uyumlu!',
      '47% Uyumlu!',    '51% Uyumlu!',
      '54% Uyumlu!',    '56% Uyumlu!',
      '59% Uyumlu!',    '58% Uyumlu!',
      '60% Uyumlu!',    '63% Uyumlu!',
      '65% Uyumlu!',    '64% Uyumlu!',
      '68% Uyumlu!',    '70% Uyumlu!',
      '74% Uyumlu!',    '78% Uyumlu!',
      '79% Uyumlu!',    '80% Uyumlu!',
      '83% Uyumlu!',    '86% Uyumlu!',
      '84% Uyumlu!',    '89% Uyumlu!',
      '91% Uyumlu!',    '93% Uyumlu!',
      '95% Uyumlu!',    '97% Uyumlu!',
      '98% Uyumlu!',    '99% Uyumlu!',
      'Evlenek Ne Bekliyon', 'Çabuk Evlenmeniz Gereken Konular Var'
  ]
  
  let şarkı = [
      'https://open.spotify.com/track/2SGltWNsdjCjyf6eh3iM0g?si=c49bb2c15ac343f5',
      'https://open.spotify.com/track/0ywlnV6QEZneCbbqLev6qL?si=a94d3ae7328b476c',
      'https://open.spotify.com/track/0JkZUrGmvzpX4yP8CoqItc?si=c5b35b77a6804b43',
      'https://open.spotify.com/track/0yrqfgfaQs222WGcZMvIFA?si=3219a4f749884702',
      'https://open.spotify.com/track/2911GW6Gdfuc3CQ2HrLDn6?si=a590bce4552f40a0',
      'https://open.spotify.com/track/3ZGUpGjkL9D5wjMWd7wFB5?si=ed9b59544f6a4eab',
      'https://open.spotify.com/track/38j60DwttFNYk2GmCTIUod?si=2ab67840f1a84dd0',
      'https://open.spotify.com/track/6KmThLltgcLO058vNzxvMV?si=2a89388eeb42414c',
      'https://open.spotify.com/track/26EzdCBOvRJljcc2zYOEVP?si=e4c5cd109369406e',
      'https://open.spotify.com/track/7hrjh79DQVNwGTL3EgrBi4?si=c4e24bf978ea457c',
      'https://open.spotify.com/track/11AkXmBdjwu4upt22GjJrG?si=76fe1e69c3224af3',
      'https://open.spotify.com/track/6ZvKnJSendvbZGiVMmgIdp?si=c3fb586f7c0142b2',
      'https://open.spotify.com/track/0kjy0Qk3anB4t1dNIL7No3?si=8f9cea3da1e146e3',
      'https://open.spotify.com/track/3jDcUArWhSonfHpK3QXJug?si=2b4db33b15784b89',
      'https://open.spotify.com/track/4uoXb2toU8zWD27TpJS7Yk?si=1a6217915dd5422f',
      'https://open.spotify.com/track/4UohOvkgmCt3p0PYOPnHjN?si=8f0199b91b164724',
      'https://open.spotify.com/track/04RR90pc7GMGHfELXfuX2Z?si=56154d8544164a7b',
      'https://open.spotify.com/track/6CcJMwBtXByIz4zQLzFkKc?si=a76b6157d1c6480b',
      'https://open.spotify.com/track/1GvNBnLOlRKZYS93fdEN9h?si=9e3a97956b3d4046',
      'https://open.spotify.com/track/0wr0JTOlgZVYccny0GlL4T?si=432cd351bee74708',
      'https://open.spotify.com/track/3bKMzeLEDmPHzDMWplhdtP?si=4d28a63f8a3a4a67',
      'https://open.spotify.com/track/5SFBaOi2ELB2P5tFzmcD73?si=713b86f5e0d64a62',
      'https://open.spotify.com/track/2pPJA6IEl9iyXtVyrE06cT?si=05e234d20ad645b7',
      'https://open.spotify.com/track/6nhJ2KSi1rKGX75frHpkXK?si=7bd37d56f85f4148',
      'https://open.spotify.com/track/5XMAeSjjinBwKjdANxHbeZ?si=87ec32afe2994536',
      'https://open.spotify.com/track/0slHapEcgmGP0kwfqQLLmP?si=4bf5c78418ef4136',
  ]

  let emoti ;
  if(ertucuk.BotsOwners.some(x=> x == message.member.id)){
  emoti = 43;
  } else {
  emoti= Math.floor((Math.random()*replies.length))
  }
  let love = replies[emoti]
  let emoticon;
  if(emoti <= 44 && emoti >= 23) {
     emoticon = ('https://cdn.glitch.com/00963c7e-8e86-4a55-8d85-36add9e330d7%2Femoji_2.png?v=1593651528429'); 
  } else if(emoti < 23 && emoti >= 12) {
      emoticon = ('https://cdn.glitch.com/00963c7e-8e86-4a55-8d85-36add9e330d7%2Femoji_3-1.png?v=1593652255529'); 
  } else if(emoti < 11) {
      emoticon = ('https://cdn.glitch.com/00963c7e-8e86-4a55-8d85-36add9e330d7%2Femoji_1.png?v=1593651511900'); 
  }
  const canvas = Canvas.createCanvas(384, 128);
  const ctx = canvas.getContext('2d');
  const emotes = await Canvas.loadImage(emoticon);
  const avatar1 = await Canvas.loadImage(message.member.user.displayAvatarURL({ extension: "jpg" }));
  const avatar2 = await Canvas.loadImage(member.displayAvatarURL({ extension: "jpg" }));
  ctx.beginPath();
  ctx.moveTo(0 + Number(10), 0);
  ctx.lineTo(0 + 384 - Number(10), 0);
  ctx.quadraticCurveTo(0 + 384, 0, 0 + 384, 0 + Number(10));
  ctx.lineTo(0 + 384, 0 + 128 - Number(10));
  ctx.quadraticCurveTo(
  0 + 384,
  0 + 128,
  0 + 384 - Number(10),
  0 + 128
  );
  ctx.lineTo(0 + Number(10), 0 + 128);
    ctx.quadraticCurveTo(0, 0 + 128, 0, 0 + 128 - Number(10));
    ctx.lineTo(0, 0 + Number(10));
    ctx.quadraticCurveTo(0, 0, 0 + Number(10), 0);
    ctx.closePath();
    ctx.clip();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 384, 128);
    let background = await Canvas.loadImage("https://cdn.discordapp.com/attachments/1075535580517113986/1078054796524785754/aesthetic-dreamy-background-purple-cloudy-sky-vector-glitter-design_53876-156334.png");
    ctx.drawImage(background, 0, 0, 384, 129);
    ctx.drawImage(emotes, 160, 30, 64, 64);
    ctx.drawImage(avatar1, 20, 20, 96, 96);
    ctx.drawImage(avatar2, 270, 20, 96, 96);
    const img = new AttachmentBuilder().setFile(canvas.toBuffer())
    let Row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setLabel("Tanış!")
        .setEmoji("🥰")
        .setDisabled(emoti <= 44 && emoti >= 23 ? false : true)
        .setCustomId("test")
        .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
        .setLabel("Sizin Şarkınız")
        .setEmoji("🎶")
        .setDisabled(emoti <= 44 && emoti >= 23 ? false : true)
        .setCustomId("test2")
        .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
        .setLabel("Sil")
        .setEmoji("1099793976644599959")
        .setDisabled(emoti <= 44 && emoti >= 23 ? true : false)
        .setCustomId("test3")
        .setStyle(ButtonStyle.Secondary)
    )
    message.react(`${client.emoji("ertu_onay")}`)
    message.reply({components: [Row] ,content: `[ **${member.displayName}** & **${message.member.displayName}** ]\nYakışıyor musunuz? **${love}**\nBebeğinizin İsmi : **${compareToNames(`${member.displayName}`, `${message.member.displayName}`)}**`, files: [img]})

    .then(async (msg) => {
      msg.react("🥰")
      msg.react("😘")
      msg.react("😳")
      var filter = (i) => i.user.id == message.member.id
      let collector = msg.createMessageComponentCollector({filter: filter, time: 30000 , max: 2})
      collector.on('collect', async (i) => {
          if(i.customId == "test") {
  
              const row = new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                  .setLabel("Profil Görmek İçin Tıkla")
                  .setStyle(ButtonStyle.Link)
                  .setURL(`https://discord.com/users/${member.id}`), )
            
              i.reply({content: `${member}`,components: [row], ephemeral: true})
             
          }
          if(i.customId == "test2") {
              let şarkıcık;
              şarkıcık = Math.floor((Math.random()*şarkı.length))
              let love = şarkı[şarkıcık]
              i.reply({content: `${love}`, ephemeral: true})
             
          }
          if(i.customId == "test3") {
              message.delete().then(i.message.delete()) 
          }
      })

      collector.on("end", async (i) => {
		Row.components[0].setDisabled(true);
		Row.components[1].setDisabled(true);
        Row.components[2].setDisabled(true);
		msg.edit({ components: [Row] });
	  });
    }
   )
 },
};

function compareToNames(name1, name2) {
  const clear = (name) => name.replace(/[^a-z ]+/gi, "").split(/ +/).filter(Boolean)[0]
  name1 = clear(name1)
  name2 = clear(name2)

  return name1.substring(0, 3) + name2.substring(name2.length - 3)
}
