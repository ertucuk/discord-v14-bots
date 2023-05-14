const { ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder,codeBlock } = require("discord.js");
const { BsonDatabase,JsonDatabase,YamlDatabase } = require("five.db");
const db = new YamlDatabase();
const ertucuk = require("../../Settings/System");

module.exports = {
    name: "özel-komut",
    description: "",
    category: "NONE",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["özelkomut"],
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
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.permissions.has(PermissionFlagsBits.BanMembers)) return message.reply({ embeds: [new EmbedBuilder().setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] })
       // ben enayiyim HIOGLASNDGUIASDGA    
        if(!["ekle","çıkar","liste"].some(x=> args[0] == x))return message.reply({ embeds: [new EmbedBuilder().setDescription(`> **Bir Argüman Belirtin!**\n\n> \`${ertucuk.Moderation.Prefixs[0]}özel-komut ekle <komut adı> [verilecek RolID] [verebilecek RolID]\`\n> \`${ertucuk.Moderation.Prefixs[0]}özel-komut çıkar\`\n> \`${ertucuk.Moderation.Prefixs[0]}özel-komut liste\``)] })
        if(message.mentions.roles.first())return message.reply({ embeds: [new EmbedBuilder().setDescription(`> **Rolleri Etiket İle Değil, ID İle Belirtiniz!**`)] })
        if(args[0] == "ekle"){
        const komutisim = args[1];
        const permRolID = args[2];
        const yetkiRolID = args[3]
        if(!komutisim || !permRolID || !yetkiRolID) return message.reply({ embeds: [new EmbedBuilder().setDescription(`> **Eksiksiz Girdiğinize Emin Olunuz!**\n\n> \`${ertucuk.Moderation.Prefixs[0]}özel-komut ekle <komut adı> [verilecek RolID] [verebilecek RolID]\``)] })
        const permsData = db.get(`ozelkomutlar`) || [];  
        if(permsData.some(veri=> veri.permName == komutisim)) return message.reply({ embeds: [new EmbedBuilder().setDescription(`> **Bu Komut Zaten Daha Önceden Eklenmiş!**`)] })
        if(permsData.length >= 15) return message.reply({ embeds: [new EmbedBuilder().setDescription(`> **\`15\`'den Fazla Özel Komut Ekliyemezsin!**`)] })
        db.push(`ozelkomutlar`,{permID:permRolID,permName:komutisim,staffRoleID:yetkiRolID})
        message.reply({embeds:[new EmbedBuilder().setDescription(`${codeBlock("md",`# Komut Eklendi!\n< Kullanım: ${ertucuk.Moderation.Prefixs[0]}}${komutisim} <@Luppux/ID>\n> ${komutisim}\n> ${message.guild.roles.cache.get(permRolID).name}\n> ${message.guild.roles.cache.get(yetkiRolID).name} `)}`)]})
        }
        if(args[0] == "çıkar"){
            const permsData = db.get(`ozelkomutlar`) || [];  
            var liste = [{label:"İşlemi İptal Et!",description:"Menüyü Kapatır.",value:`iptal`}];
            for (let i = 0; i < permsData.length; i++) {
                const veri = permsData[i];
                liste.push({label:`Komut: ${veri.permName}`,description:`Rol: ${message.guild.roles.cache.get(veri.permID) ? message.guild.roles.cache.get(veri.permID).name : "Rol Silinmiş."}`,value:`${veri.permName}`})
            }
        const menu = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
            .setCustomId("permler")
            .setOptions(liste)
            .setPlaceholder("Silmek İstediğiniz Komutu Seçin!")
        )
        message.channel.send({components:[menu],embeds:[new EmbedBuilder().setDescription(`> **Listeden Silmek İstediğiniz Komutu Seçin!**`)]}).then(async msg =>{
            var filter = (button) => button.user.id === message.author.id;
            const collector = msg.createMessageComponentCollector({ filter, time: 60000,max:3})
            collector.on("collect",async(i)=>{
            await i.deferUpdate();
            for (let index = 0; index < liste.length; index++) {
            if(i.values[0] == `${liste[index].value}`){
            db.pull("ozelkomutlar", (eleman, sıra, array) => eleman.permName == liste[index].value, true)
            message.reply({ embeds: [new EmbedBuilder().setDescription(`> **\`${liste[index].value}\` Adlı Komut Başarıyla Silindi!**`)]})
            }
            }   
            if(i.values[0] == "iptal") {
                if(msg) await msg.delete();
                if(message) await message.delete();
                } 
            })
        })
        }
        if(args[0] == "liste"){
            const permsData = db.get(`ozelkomutlar`) || [];  
            message.channel.send({embeds:[new EmbedBuilder().setDescription(`> **${permsData.length == 0 ? "Eklenmiş Özel Komut Bulunmamakta!":`Toplam \`${permsData.length}\` Adet Özel Komut Aşağıda Listelenmiştir!`}**\n\n ${permsData.length == 0 ? " " : `${codeBlock("md",
            `${permsData.map(x=> `# ${x.permName.toUpperCase()} \n> Kullanım: .${x.permName} @Ertu/ID\n< Rol: ${message.guild.roles.cache.get(x.permID) ? message.guild.roles.cache.get(x.permID).name : "Rol Silinmiş."}\n< Y. Rolü: ${message.guild.roles.cache.get(x.staffRoleID) ? message.guild.roles.cache.get(x.staffRoleID).name : "Rol Silinmiş."}`).join("\n")}`
            )}`}`)]})
        }


     },

    onSlash: async function (client, interaction) { },
  };