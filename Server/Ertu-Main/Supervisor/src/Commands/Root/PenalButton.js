const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const ertum = require('../../../../../../Global/Settings/Setup.json');
const ertucuk = require('../../../../../../Global/Settings/System');
const cezapuan = require('../../../../../../Global/Schemas/cezapuan');
const penals = require('../../../../../../Global/Schemas/penals');
const { nokta, green, star } = require('../../../../../../Global/Settings/Emojis.json');
const moment = require('moment')
moment.locale("tr");

module.exports = {
    name: 'cezabuton',
    description: 'Şüpheli buton',
    category: 'OWNER',
    cooldown: 0,
    command: {
        enabled: true,
        aliases: ['cezabutton', 'ceza-button', 'ceza-buton'],
        usage: '.cezabutton',
    },

    onLoad: function (client) {},

    onCommand: async function (client, message, args) {
        client.channels.cache.get(message.channel.id).send({
            content: `**Merhaba!** Aşağıda ki butonlardan cezalarınız hakkında detaylı bilgi alabilirsiniz.`,
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            style: 2,
                            custom_id: 'cezapuan',
                            label: 'Ceza Puanım',
                        },
                        {
                            type: 2,
                            style: 2,
                            custom_id: 'cezalarim',
                            label: 'Cezalarım',
                        },
                        {
                            type: 2,
                            style: 2,
                            custom_id: 'kalanzamanim',
                            label: 'Kalan Zamanım',
                        },
                        {
                            type: 2,
                            style: 2,
                            custom_id: 'süpheli',
                            label: 'Şüpheliden Çık',
                        },
                    ],
                },
            ],
        });

        client.on('interactionCreate', async (interaction) => {
            const member = await client.guilds.cache
                .get(ertucuk.ServerID)
                .members.fetch(interaction.member.user.id);
            if (!member) return;

            if (interaction.customId === 'cezapuan') {
                const cezapuanData = await cezapuan.findOne({ userID: member.user.id });
                await interaction.reply({
                    content: `${cezapuanData ? cezapuanData.cezapuan : 0} cezapuanın bulunmakta.`,
                    ephemeral: true,
                });
            }

            if (interaction.customId === 'cezalarim') {
                const data = await penals.find({ guildID: ertucuk.ServerID, userID: interaction.member.id }).sort({ date: -1 });
                if (data.length === 0) { return interaction.reply({ content: `${client.emoji("ertu_onay")} ${member.toString()} üyesinin sicili temiz!`, ephemeral: true })}
                let remainingData = [...data];
                while (remainingData.length > 0) {
                const dataSlice = remainingData.splice(0, 2000);
                const formattedData = dataSlice.map((x) => `#${x.id} **[${x.type}]** ${moment(x.date).format("LLL")} tarihinde, <@${x.staff}> tarafından, \`${x.reason}\` nedeniyle, ${x.type.toLowerCase().replace("-", " ")} cezası almış.\n─────────────────`).join("\n");
                const embed = new EmbedBuilder()
                .setDescription(formattedData);
                await interaction.reply({ embeds: [embed], ephemeral: true });
              }
           }
            if (interaction.customId === 'kalanzamanim') {
                let datas = await penals
                    .find({ guildID: ertucuk.ServerID, userID: member.id, active: true })
                    .sort({ date: -1 });
                datas = datas
                    .map(
                        (x) =>
                            `<@${x.staff}> tarafından **${moment(x.date).format(
                                'LLL'
                            )}**'da işlenen __"#${x.id}"__ numaralı __"${
                                x.type
                            }"__ türündeki cezalandırman <t:${Math.floor(
                                x.finishDate / 1000
                            )}:R> sonlandırılacaktır.`
                    )
                    .join('\n');
                if (datas.length === 0)
                    return interaction.reply({
                        content: `Aktif cezan bulunmamakta.`,
                        ephemeral: true,
                    });
                await interaction.reply({ content: `${datas}`, ephemeral: true });
            }

            if (interaction.customId === 'süpheli') {
                if (!ertum.SuspectedRoles.some((x) => member.roles.cache.has(x))) {
                    await interaction.reply({
                        content: `Şüpheli Hesap değilsiniz.`,
                        ephemeral: true,
                    });
                    return;
                }

                let guvenilirlik =
                    Date.now() - member.user.createdTimestamp < 1000 * 60 * 60 * 24 * 7;

                if (guvenilirlik) {
                    await interaction.reply({
                        content: `Hesabınız (<t:${Math.floor(
                            member.user.createdTimestamp / 1000
                        )}:R>) tarihinde oluşturulmuş şüpheli kategorisinden çıkmaya uygun değildir.`,
                        ephemeral: true,
                    });
                } else {
                    await interaction.reply({
                        content: `Doğrulama başarılı! Teyit kanalına yönlendiriliyorsunuz.`,
                        ephemeral: true,
                    });
                    await member.roles.set(ertum.UnRegisteredRoles);
                }
            }
        });
    },
};
