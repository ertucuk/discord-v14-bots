const { ApplicationCommandOptionType,ActionRowBuilder,ButtonBuilder,ButtonStyle } = require("discord.js");
const children = require("child_process");

module.exports = {
    name: "restart",
    description: "botu baştan başlatır",
    category: "OWNER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["reload"],
      usage: ".reload",
    },


    onLoad: function (client) { },

    onCommand: async function (client, message, args) {

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("ErtuRestart1").setLabel("Moderasyonu Yeniden Başlat").setStyle(ButtonStyle.Secondary).setEmoji(`1107229410609860658`),
        new ButtonBuilder().setCustomId("ErtuRestart2").setLabel("Tüm Botları Yeniden Başlat").setStyle(ButtonStyle.Success).setEmoji(`1107229410609860658`)
      );

    let msg = await message.channel.send({content: `Yeniden başlatmak için aşağıdaki butonları kullanınız.`, components: [row]});
    var filter = (button) => button.user.id === message.author.id;
    let collector = await msg.createMessageComponentCollector({ filter, time: 60000 })
  
    collector.on("collect", async (button) => {
      if (button.customId === "ErtuRestart1") {
        msg.delete()
        await message.reply({ content: `🔃 Bot Yeniden Başlatılıyor...`})
        process.exit(1)
      }
      if (button.customId === "ErtuRestart2") {
        msg.delete()
        const ertu = children.exec(`pm2 restart all`);
        ertu.stdout.on('data', async (datas) => {
        button.reply({ content: `🔃 Botlar Yeniden Başlatılıyor...` })
        });
      }})},

    onSlash: async function (client, interaction) {

    await interaction.channel.send({ content: `🔃 Bot Yeniden Başlatılıyor...`, ephemeral: false })
    process.exit(0)
      
    
     },
  };