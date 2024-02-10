const { ApplicationCommandOptionType,PermissionsBitField,ActionRowBuilder,StringSelectMenuBuilder, EmbedBuilder,Formatters } = require("discord.js");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const moment = require("moment");
moment.locale("tr");

module.exports = {
    name: "ysay",
    description: "Yetkililerin ses denetimleri için kullanırsınız.",
    category: "ADMIN",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["yses","yetkilisay","yetkili-say","y-say"],
      usage: ".ysay",
    },

    onLoad: function (client) { },

    onCommand: async function (client, message, args) {

      if (!message.guild) return;
      if(!ertum.OwnerRoles.some(ertucum => message.member.roles.cache.has(ertucum)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
      { 
      message.react(`${client.emoji("ertu_carpi")}`)
      message.reply({ content:`Yeterli yetkin yok!`}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
      return }
    
          var ToplamYetkili = message.guild.members.cache.filter(m => ertum.ConfirmerRoles.some(x => m.roles.cache.get(x)))
          var AktifOlanYetkili = message.guild.members.cache.filter(m => ertum.ConfirmerRoles.some(x => m.roles.cache.get(x)) && m.presence && m.presence.status !== 'offline')
          var AktifOlmayanYetkili = message.guild.members.cache.filter(m => ertum.ConfirmerRoles.some(x => m.roles.cache.get(x)) && m.presence && m.presence.status == 'offline')
          var SesteOlmayanYetkili = message.guild.members.cache.filter(m => ertum.ConfirmerRoles.some(x => m.roles.cache.get(x)) && !m.voice.channel)
          var SesteOlanYetkili = message.guild.members.cache.filter(m => ertum.ConfirmerRoles.some(x => m.roles.cache.get(x)) && m.voice.channel)

          const row = new ActionRowBuilder()
          .addComponents(
            new StringSelectMenuBuilder()
              .setCustomId('yetkilisay')
              .setPlaceholder(`Menüden bir işlem seçin!`)
              .addOptions([
                { label: 'Yetkilileri listele', value: 'yetkilikontrol', emoji: '📋'},
                { label: 'Yetkilileri sese davet et',  value: 'yetkilisesdavet', emoji: '📢' },
                { label: 'Sesteki yetkilileri listele', value: 'sestekiyetkililer', emoji: '🔉' },
                { label: 'Seste olmayan yetkilileri listele', value: 'sesteolmayanyetkililer', emoji: '🔇' },
              ]),
          );

          const luhuxunannesi = new EmbedBuilder()
          .setDescription(`
          Yetkili istatistikleri aşağıda verilmiştir. Menüyü kullanarak gerekli işlemleri yerine getirebilirsiniz.
        \`\`\`
Toplam yetkili        : ${ToplamYetkili.size}
Çevrimiçi yetkili     : ${AktifOlanYetkili.size}
Çevrimdışı yetkili    : ${AktifOlmayanYetkili.size}
Seste olan yetkili    : ${SesteOlanYetkili.size}  
Seste olmayan yetkili : ${SesteOlmayanYetkili.size}
\`\`\`  
          `)

          const ertu = await message.reply({ embeds: [luhuxunannesi], components: [row] });
          const filter = i => i.user.id == message.author.id
          let collector = await ertu.createMessageComponentCollector({ filter, time: 30000 })

          collector.on("collect", async (interaction) => {
            if (interaction.values[0] === "yetkilikontrol") {
              await interaction.deferUpdate();
              var uyeListe = [];
              ToplamYetkili.forEach(member=>{uyeListe.push({memberTag:member.user.tag,online:member.presence ? true:false,voice:member.voice && member.voice.channel? true:false})})
              let list = chunkify(uyeListe,20);
              for (let index = 0; index < list.length; index++) {
              const listeİcerik = list[index];
              interaction.channel.send({
                  content:`${Formatters.codeBlock("md",
                  `${listeİcerik.map(x=> `# ${x.memberTag}\n${x.online == true ? `< Çevrimiçi 🟢`:`> Çevrimdışı`}\n${x.voice == true ? `< Seste 🔉`:`> Seste Değil 🔇`}`).join("\n")}`)}`
              })}}

                if (interaction.values[0] === "yetkilisesdavet") {
                  await interaction.deferUpdate();
                if(SesteOlmayanYetkili == 0) return interaction.channel.send({content:"Tüm Yetkililer seste!"})
                var uyeListe = [];
                SesteOlmayanYetkili.forEach(async member=>{
                await  member.send({content:`**Heyy ${member.user.tag}**
\`${message.member.user.tag}\` tarafından **${message.guild.name}** sunucusunda her hangi bir ses kanalına çağrılıyorsun.
          `}).catch(erro=> message.channel.send({content:`**Heyyy ${member}**
**${message.member.user.tag}** tarafından her hangi bir ses kanalına çağrılıyorsun.`}))
})}
if (interaction.values[0] === "sestekiyetkililer") {
  await interaction.deferUpdate();
  if(SesteOlanYetkili.size == 0) return interaction.channel.send({content:`Ses kanallarında yetkili bulunamadı!`})
  var uyeListe = [];
  SesteOlanYetkili.forEach(member=>{uyeListe.push({memberTag:member.user.tag,channel:member.voice.channel.name,memberId:member.id})})
  let list = chunkify(uyeListe,20);
  for (let index = 0; index < list.length; index++) {
    const listeİcerik = list[index];
  interaction.channel.send({
    content:`**Seste olan yetkililer:**\n${Formatters.codeBlock("md",
    `${listeİcerik.map(x=> `# ${x.memberTag}\n< Ses Kanalı: #${x.channel}`).join("\n")}`)}`
  })
}}
if (interaction.values[0] === "sesteolmayanyetkililer") {
  await interaction.deferUpdate();

  if(SesteOlmayanYetkili == 0) return interaction.channel.send({content:"garip.. tüm yetkililer seste görünüyor ? :D"})
  var uyeListe = [];
  SesteOlmayanYetkili.forEach(member=>{uyeListe.push({memberId:member.id})})
  let list = chunkify(uyeListe,20);
  for (let index = 0; index < list.length; index++) {
      const listeİcerik = list[index];
  interaction.channel.send({
      content:`**Seste olmayan yetkililer:**\n${Formatters.codeBlock("md",
      `${listeİcerik.map(x=> `<@${x.memberId}>`).join(", ")}`)}`
  })}}
})

},

  };