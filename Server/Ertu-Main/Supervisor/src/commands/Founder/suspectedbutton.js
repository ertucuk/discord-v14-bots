const { ApplicationCommandOptionType } = require("discord.js");
const ertum = require("../../../../../../Global/Settings/Setup.json")
const ertucuk = require("../../../../../../Global/Settings/System");
module.exports = {
    name: "süphelibutton",
    description: "Şüpheli buton",
    category: "OWNER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["şüphelibutton"],
      usage: ".şüphelibutton", 
    },

    onLoad: function (client) { },

    onCommand: async function (client, message, args) { 

        client.channels.cache.get(message.channel.id).send({
              content: `\`\`\`js\nMerhaba,\n➜ Sunucumuz 7 gün içeresinde açılan hesapları kabul etmemektedir.\n➜ Lütfen "Lütfen Cezalıdan Çıkarır mısın?", "İçeri alır mısın?" gibi sorarak yetkilileri rahatsız etmeyin.\n\nEğer Hesabınız 7 günden fazla ise butona tıklayarak kayıt bölümüne gidebilirsiniz.\`\`\``, "components": [{
                "type": 1, "components": [
      
                  { "type": 2, "style": 4, "custom_id": "süpheli", "label": "Hesap Kontrol"},
      
                ]
              }]

          })
        
          client.on('interactionCreate', async interaction => {
            const member = await client.guilds.cache.get(ertucuk.ServerID).members.fetch(interaction.member.user.id)
            if (!member) return;
          
            if (interaction.customId === "süpheli") {
              if (!ertum.SuspectedRoles.some(x => member.roles.cache.has(x))) {
              await interaction.reply({ content: `Şüpheli Hesap değilsiniz.`, ephemeral: true });
            return }
          
           let guvenilirlik = Date.now() - member.user.createdTimestamp < 1000 * 60 * 60 * 24 * 7;
          
           if (guvenilirlik) {
            await interaction.reply({ content: `Hesabınız (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>) tarihinde oluşturulmuş şüpheli kategorisinden çıkmaya uygun değildir.`, ephemeral: true });
          } else {
            await interaction.reply({ content: `Doğrulama başarılı! Teyit kanalına yönlendiriliyorsunuz.`, ephemeral: true });
            await member.roles.set(ertum.UnRegisteredRoles)
          } 
          }})  
    },

  };