const { ApplicationCommandOptionType } = require("discord.js");
const ertum = require("../../Settings/System")
const cezapuan = require("../../schemas/cezapuan")
const ceza = require("../../schemas/ceza")
const penals = require("../../schemas/penals");
const data = require("../../schemas/penals");
const moment = require("moment");
moment.locale("tr");
const client = global.bot;

module.exports = {
    name: "cezabuton",
    description: "",
    category: "OWNER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["cezabutton"],
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

        client.channels.cache.get(message.channel.id).send({
              content: ` Aşağıda ki düğmelerden ceza puanınızı, ceza listenizi ve aktif cezanızın kalan süresini görüntüleyebilirsiniz.`, "components": [{
                "type": 1, "components": [
                  { "type": 2, "style": 2, "custom_id": "cezapuan", "label": "Ceza Puanım", "emoji": { "id": "916734243328114718" } },
                  { "type": 2, "style": 3, "custom_id": "cezalarım", "label": "Cezalarım", "emoji": { "id": "915754688224321546" } },
                  { "type": 2, "style": 4, "custom_id": "kalanzaman", "label": "Kalan Zamanım?", "emoji": { "id": "915754687448379393" } }
      
                ]
              }]
          });
      
      client.on('interactionCreate', async interaction => {

        const member = interaction.user;
      
        const cezaData = await ceza.findOne({ guildID: ertum.ServerID, userID: member.id });
        const cezapuanData = await cezapuan.findOne({ guildID: ertum.ServerID, userID: member.id });
      
        if (interaction.customId === "cezapuan") {
          interaction.reply({
            content: `${member.toString()} Ceza Puanınız : 
      
       Toplamda \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanı\` ve (Toplam **${cezaData ? cezaData.ceza.length : 0}** Ceza) olarak gözükmekte.`, ephemeral: true
          });
        }
      
        let data = await penals.find({ guildID: ertum.ServerID, userID: member.id, active: true }).sort({ date: -1 });
        data = data.map((x) => `\`#${x.id}:\` ${x.active ? "\`Aktif\`" : "\`Pasif\`"} **[${x.type}]** <@${x.staff}>: **${x.reason}** - ${moment(x.date).format("LLL")}`);
        if (interaction.customId === "cezalarım") {
          if (data.length === 0) return interaction.reply({ content: `${member.toString()} üyesinin aktif cezası bulunmamaktadır.`, ephemeral: true });
          if (data.length > 0) return interaction.reply({ content: `${data}`, ephemeral: true });
        }
      
        let datas = await penals.find({ guildID: ertum.ServerID, userID: member.id, active: true }).sort({ date: -1 });
        datas = datas.map((x) => `${red} <@${x.staff}> tarafından **${moment(x.date).format("LLL")}**'da işlenen __"#${x.id}"__ numaralı __"${x.type}"__ türündeki cezalandırman **${moment(x.finishDate).format("LLL")}** tarihinde biticektir.`);
      
        if (interaction.customId === "kalanzaman") {
          if (data.length === 0) return interaction.reply({ content: `${member.toString()} üyesinin aktif ceza bilgisi bulunmamakta.`, ephemeral: true})
          await interaction.reply({ content: `${datas}`, ephemeral: true });
      }


      
      })},

    onSlash: async function (client, interaction) { },
  };