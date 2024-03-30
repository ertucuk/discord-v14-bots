const { ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder,codeBlock, RoleSelectMenuBuilder,Formatters } = require("discord.js");
const { BsonDatabase,JsonDatabase,YamlDatabase } = require("five.db");
const db = new YamlDatabase();
const ertucuk = require("../../../../../../Global/Settings/System");
const özelPerms  = require("../../../../../../Global/Schemas/specialcommand");

module.exports = {
    name: "özel-komut",
    description: "Özel komut oluşturursunuz",
    category: "OWNER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["özelkomut"],
      usage: ".özelkomut [ekle/çıkar/liste]", 
    },

    onLoad: function (client) { },

    onCommand: async function (client, message, args, ertuembed) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.permissions.has(PermissionFlagsBits.BanMembers)) return message.reply({ embeds: [new EmbedBuilder().setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] })
        if(!["ekle","çıkar","liste"].some(x=> args[0] == x))return message.reply({ embeds: [new EmbedBuilder().setDescription(`Bir Argüman Belirtin!\n\n> \`${ertucuk.Mainframe.Prefixs[0]}özel-komut ekle <komut adı>\`\n> \`${ertucuk.Mainframe.Prefixs[0]}özel-komut çıkar\`\n> \`${ertucuk.Mainframe.Prefixs[0]}özel-komut liste\``)] })
        if (args[0] === "oluştur" || args[0] === "ekle") {
            const data = await özelPerms.findOne({guildID:message.guild.id})
            const permsData = data ? data.perms : [];
            let mesaj = await message.channel.send(`Eklemek istedin komutun adını yazman için **15 Saniyen** var!`);
            let komutPushlancak = {}
            var isimfilter = m => m.author.id == message.author.id
            await message.channel.awaitMessages({ isimfilter, max: 1, time: 15000, errors: ["time"] })
                .then(async isim => {
                    if (isim.first().content == ("iptal" || "i")) {
                        isim.first().delete();
                        mesaj.delete();
                        return;
                    };
                    if (isim.first().content.includes(" ")) {
                        mesaj.delete();
                        isim.first().content;
                        return message.channel.send(`Boşluk Kullanamazsın!`);
                    }
                    if (permsData.some(veri => veri == (isim.first().content))) return message.reply({ content: `Bu komut daha önce zaten eklenmiş` })
                    if (isim.first().content.length > 20) return message.channel.send(`Eklemek istediğiniz komut 20 karakterden fazla isime sahip.`);
                    komutPushlancak.permName = isim.first().content
                    isim.first().delete();
                    await mesaj.edit({ content: null, embeds: [ertuembed.setDescription(`Komutu kullanma izni verilcek rolleri aşağıda ki menüden seçiniz?`)], components: [new ActionRowBuilder().setComponents(new RoleSelectMenuBuilder().setCustomId("permRoleSelectMenu").setMaxValues(5))] });
                })
            const filter = i => i.user.id == message.member.id
            const collector = mesaj.createMessageComponentCollector({ filter, errors: ["time"], max: 3, time: 50000 })
            collector.on('collect', async i => { 
                await i.deferUpdate();
              if(i.customId == "permRoleSelectMenu") {
                  var role = []
                  for (let index = 0; index < i.values.length; index++) {
                    let ids = i.values[index]
                    role.push(ids)
                  }
            
                  komutPushlancak.staffRoleID = role
        
                  message.react(`${client.emoji("ertu_onay")}`)
                 let mesajx = await mesaj.channel.send({ embeds: [ ertuembed.setDescription(`Komutun vericeği rolü aşağıdan seçiniz`)],components: [new ActionRowBuilder().setComponents(new RoleSelectMenuBuilder().setCustomId("permRolesSelectMenu").setMaxValues(5))]})
                  const collectorx = mesajx.createMessageComponentCollector({ filter,  errors: ["time"], max: 3, time: 50000 })
                  collectorx.on('collect', async t => { 
                    await t.deferUpdate();
                    if(t.customId == "permRolesSelectMenu") {
                        var role1 = []
                        for (let index = 0; index < t.values.length; index++) {
                          let ids = t.values[index]
                          role1.push(ids)
                        }
                        komutPushlancak.permID = role1
                        await özelPerms.findOneAndUpdate({guildID:message.guild.id},{$push:{perms:komutPushlancak}},{upsert:true})
                        await mesajx.edit({components: [], embeds: [ ertuembed.setDescription(`**${komutPushlancak.permName}** isimli alt komut başarıyla oluşturuldu.`).addFields({name:`Kullanacak rol(ler)`,value: `${komutPushlancak.staffRoleID.map(x => message.guild.roles.cache.get(x)).join(",")}`,inline: true}).addFields({name:`Verilecek rol(ler)`,value:`${role1.map(x => message.guild.roles.cache.get(x)).join(", ")}`,inline:true})]});
                    
                    }
                })
            }
        })
        }
        if(args[0] == "çıkar"){
            const data = await özelPerms.findOne({guildID:message.guild.id})
            const permsData = data ? data.perms : [];
            var liste = [{label:"İşlemi iptal et!",description:"Menüyü Kapatır.",value:`iptal`}];
            for (let i = 0; i < permsData.length; i++) {
                const veri = permsData[i];
                liste.push({label:`Komut: ${veri.permName}`,description:`Rol: ${message.guild.roles.cache.get(veri.permID) ? message.guild.roles.cache.get(veri.permID).name : "Rol Silinmiş."}`,value:`${veri.permName}`})
            }
        const menu = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
            .setCustomId("permler")
            .setOptions(liste)
            .setPlaceholder("Silmek istediğin komutu seç")
        )
        message.channel.send({components:[menu],embeds:[ertuembed.setDescription(`Listesen silmek istediğiniz komutu seçiniz.`)]}).then(async msg =>{
            var filter = (button) => button.user.id === message.author.id;
            const collector = msg.createMessageComponentCollector({ filter, time: 30000*2 })
            collector.on("collect",async(i)=>{
            await i.deferUpdate();
            for (let index = 0; index < liste.length; index++) {
            if(i.values[0] == `${liste[index].value}`){
            await özelPerms.findOneAndUpdate({guildID:message.guild.id},{$pull:{perms:{permName:liste[index].value}}},{upsert:true})
            message.channel.send({content:"`Komut başarıyla silindi!`"}).then(x=>{setTimeout(() => {if(x) x.delete();}, 5000);})
            collector.stop();
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
         const data = await özelPerms.findOne({guildID:message.guild.id})
         const permsData = data ? data.perms : [];
         message.channel.send({
                embeds: [ertuembed.setDescription(`Toplam **${permsData.length}** ek komut aşağıda listelenmiştir. \n\n ${permsData.length == 0 ? " " : `${Formatters.codeBlock("md",
`${permsData.map(x => `# ${x.permName.toUpperCase()}
> Kullanım: .${x.permName} @Luppux/ID
< Rol: ${message.guild.roles.cache.get(x.permID) ? message.guild.roles.cache.get(x.permID).name : "Rol Silinmiş."}
< Y. Rolü: ${message.guild.roles.cache.get(x.staffRoleID) ? message.guild.roles.cache.get(x.staffRoleID).name : "Rol Silinmiş."}`).join("\n")}`
                )}`}`)]
            })
        }


     },

  };