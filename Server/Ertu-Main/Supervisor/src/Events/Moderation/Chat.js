const { EmbedBuilder, Events, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, ComponentType } = require('discord.js');
const { green, red } = require("../../../../../../Global/Settings/Emojis.json");
const ertum = require("../../../../../../Global/Settings/Setup.json")
const system = require("../../../../../../Global/Settings/System");
const client = global.client;
const coinDB = require("../../../../../../Global/Schemas/ekonomi");
var size = 0;

client.on("messageCreate", async (message) => {
    if (message.channel.id !== ertum.ChatChannel || message.author.bot || !message.guild) return;
    size++;
    if (size == 100) {
        let kanal = client.channels.cache.get(ertum.ChatChannel)
        if (!kanal) return;
        let cevap = Math.floor(Math.random() * 5) + 1
        let basanlar = []
        const satirBir = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("1").setEmoji(`1️⃣`).setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("2").setEmoji(`2️⃣`).setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("3").setEmoji(`3️⃣`).setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("4").setEmoji(`4️⃣`).setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("5").setEmoji(`5️⃣`).setStyle(ButtonStyle.Secondary),
        )

        let msg = await kanal.send({ components: [satirBir], files: [new AttachmentBuilder().setFile("https://cdn.discordapp.com/attachments/1011397607685374033/1061413475043254342/dolusandik.png").setName("tiklakazan.png")] })
        const filter = i => i
        const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 30000 });

        collector.on('collect', async i => {
            if (i.customId === String(cevap)) {
                if (basanlar.includes(i.user.id)) return await i.reply({ content: `${client.emoji("ertu_carpi")} Cevap hakkınızı doldurmuşsunuz. Üzgünüm!`, ephemeral: true });
                await i.reply({ content: `> **Tebrikler!** Etkinliği kazandığınız için hesabınıza +**5000** ${system.Server} Parası aktarıldı.`, ephemeral: true })
                let member = i.guild.members.cache.get(i.user.id)
                kanal.send({ content: `**Tebrikler!** Doğru kasayı bul etkinliğini ${member} kazandı!`, files: [] }).then(x => setTimeout(() => { x.delete() }, 10000))
                msg.delete().catch(err => { })
                basanlar = []
                if (member) return await coinDB.findOneAndUpdate({ guildID: message.guild.id, userID: i.user.id }, { $inc: { coin: 5000, gameSize: 1 } }, { upsert: true })
            }

            if (i.customId != String(cevap)) {
                if (basanlar.includes(i.user.id)) return await i.reply({ content: `${client.emoji("ertu_carpi")} Cevap hakkınızı doldurmuşsunuz. Üzgünüm!`, ephemeral: true });
                basanlar.push(i.user.id)
                await i.reply({ content: `${client.emoji("ertu_carpi")} **Hay Aksi!** Yanlış, artık birdahaki sorulara. Cevap hakkınız doldu!`, ephemeral: true })
            }
        });

        collector.on('end', collected => msg.delete().catch(err => { }));

    } else if (size == 200) {
        let kanal = client.channels.cache.get(ertum.ChatChannel)
        if (!kanal) return;
        const rastgele = Math.floor(Math.random() * 9) + 1;
        let msg1 = await message.channel.send({ files: [new AttachmentBuilder().setFile("https://cdn.discordapp.com/attachments/1011397607685374033/1061581014616526878/tahminetvekazan.png").setName("kazanamadi.png")] })

        const filter = m => m.content.includes(rastgele);
        const collector = kanal.createMessageCollector({ filter, max: 1, time: 20000 });

        collector.on('collect', async (m) => {
            let member = m.guild.members.cache.get(m.member.id)
            kanal.send({ content: `**Tebrikler!** Hızlı Ol Ve Kazan etkinliğini ${member} kazandı!`, files: [], files: [] }).then(x => setTimeout(() => { x.delete() }, 10000))
            msg1.delete().catch(err => { })
            if (member) return await coinDB.findOneAndUpdate({ guildID: message.guild.id, userID: m.member.id }, { $inc: { coin: 10000, gameSize: 1 } }, { upsert: true })
        });

        collector.on('end', collected => {
            msg1.delete().catch(err => { })
        });

    } else if (size == 300) {
        size = 0;
        let kanal = client.channels.cache.get(ertum.ChatChannel)
        if (!kanal) return;
        const tıklakazanButton = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('tiklakazan').setLabel('Tıkla!').setStyle(ButtonStyle.Secondary));

        let msg = await message.channel.send({ components: [tıklakazanButton], files: [new AttachmentBuilder().setFile('https://cdn.discordapp.com/attachments/1011397607685374033/1061407355423703110/tklakazan.png').setName('tiklakazan.png')] });
        const filter = (interaction) => interaction.customId === 'tiklakazan' && interaction.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 15000 });
        collector.on('collect', async (interaction) => {
            let member = interaction.guild.members.cache.get(interaction.member.id)
            kanal.send({ content: `**Tebrikler!** Tıkla Kazan etkinliğini ${member} kazandı!` })
            interaction.reply({ content: `> **Tebrikler!** Etkinliği kazandığınız için hesabınıza +**10000** ${system.Server} Parası aktarıldı.`, ephemeral: true });
            msg.delete().catch(err => { })
            if (member) return await coinDB.findOneAndUpdate({ guildID: message.guild.id, userID: interaction.member.id }, { $inc: { coin: 10000, gameSize: 1 } }, { upsert: true })
        });

        collector.on('end', collected => {
            msg.delete().catch(err => { })
        });
    }
});

function kodOluştur(length) {
    var randomChars = '123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

