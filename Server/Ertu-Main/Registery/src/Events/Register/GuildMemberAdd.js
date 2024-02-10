const client = global.client;
const { ActivityType, Events, ChannelType } = require('discord.js');
const { green } = require('../../../../../../Global/Settings/Emojis.json');
const ertum = require('../../../../../../Global/Settings/Setup.json');
const system = require('../../../../../../Global/Settings/System');
const forceBans = require('../../../../../../Global/Schemas/forceBans');
const inviterSchema = require('../../../../../../Global/Schemas/inviter');
const inviteMemberSchema = require('../../../../../../Global/Schemas/inviteMember');
const otokayit = require('../../../../../../Global/Schemas/otokayit');
const bannedTag = require('../../../../../../Global/Schemas/bannedTag');
const regstats = require('../../../../../../Global/Schemas/registerStats');
const isimler = require('../../../../../../Global/Schemas/names');
const penals = require('../../../../../../Global/Schemas/penals');
const userTask = require('../../../../../../Global/Schemas/userTask');
const tasks = require('../../../../../../Global/Schemas/tasks');

client.on('guildMemberAdd', async (member) => {
    if (member.user.bot) return;

    const ErtuData = await forceBans.findOne({ guildID: system.ServerID, userID: member.user.id });

    if (ErtuData) {
        return member.guild.members
            .ban(member.user.id, {
                reason: 'Force Ban Systems | Sunucudan kalıcı olarak yasaklandı!',
            })
            .catch(() => { });
    }

    const muteRoles = ertum.MutedRole[0];
    const vmuteRoles = ertum.VMutedRole[0];
    const jailRoles = ertum.JailedRoles[0];
    await muteyigotunesokamk('Chat-Mute', muteRoles);
    await muteyigotunesokamk('Jail', jailRoles);
    await muteyigotunesokamk('Voice-Mute', vmuteRoles);

    async function muteyigotunesokamk(type, roleID) {
        try {
            const activeMutes = await penals.find({
                guildID: member.guild.id,
                userID: member.id,
                type: type,
                active: true,
            });

            if (activeMutes && activeMutes.length > 0) {
                const role = member.guild.roles.cache.get(roleID);
                if (role) {
                    await member.roles.add(role);
                } else {
                    console.error(`${type} rolü bulunamadı.`);
                }
            }
        } catch (error) {
            console.error(`Hata oluştu: ${error}`);
        }
    }

    const cachedInvites = client.invites.get(member.guild.id);
    const newInvites = await client.guilds.cache.get(member.guild.id).invites.fetch();
    const usedInvite = await newInvites.find((inv) => cachedInvites.get(inv.code) < inv.uses);
    newInvites.each((inv) => cachedInvites.set(inv.code, inv.uses));
    client.invites.set(member.guild.id, cachedInvites);

    const otoreg = await otokayit.findOne({ userID: member.id });
    const tagModedata = await regstats.findOne({ guildID: system.ServerID });


    if (otoreg && system.Mainframe.otoKayit == true) {
            await member.roles.set(otoreg.roleID);
            await member.setNickname(`${ertum.ServerUntagged} ${otoreg.name} | ${otoreg.age}`);
            await isimler.findOneAndUpdate(
                { guildID: system.ServerID, userID: member.user.id },
                {
                    $push: {
                        names: {
                            name: member.displayName,
                            sebep: 'Oto Bot Kayıt',
                            rol: otoreg.roleID.map((x) => `<@&${x}>`),
                            date: Date.now(),
                        },
                    },
                },
                { upsert: true }
            );
            return;
    } else {
        await member.setNickname(`${ertum.ServerUntagged} İsim | Yaş`);
    }

    if (member.user.displayName.includes(ertum.ServerTag)) {
        await member.roles.add(ertum.TaggedRole);
        await member.roles.add(ertum.UnRegisteredRoles);
    } else {
        await member.roles.add(ertum.UnRegisteredRoles);
    }

    let guvenilirlik = Date.now() - member.user.createdTimestamp < 1000 * 60 * 60 * 24 * 7;
    if (guvenilirlik) {
        if (ertum.SuspectedRoles) member.roles.set(ertum.SuspectedRoles).catch();
    } else if (ertum.UnRegisteredRoles) member.roles.add(ertum.UnRegisteredRoles).catch();
    if (member.user.username.includes(ertum.ServerTag)) { member.setNickname(`${ertum.ServerUntagged} İsim | Yaş`).catch(); }
    else {
        member.setNickname(`${ertum.ServerUntagged} İsim | Yaş`).catch();
    }


    const invChannel = member.guild.channels.cache.get(ertum.InviteChannel);
    const welChannel = member.guild.channels.cache.get(ertum.WelcomeChannel);
    const RulesChannel = member.guild.channels.cache.get(ertum.RulesChannel);
    var memberCount = member.guild.memberCount.toString().replace(/ /g, "    ")

    if (!invChannel) return;
    if (!welChannel) return;
    if (!RulesChannel) return;

    if (!usedInvite) {
        welChannel.send({
            content: `
### ${member}, Sunucumuza hoş geldin.

Seninle beraber sunucumuz ${rakam(memberCount)} üye sayısına ulaştı.
                        
Hesabın **<t:${Math.floor(member.user.createdTimestamp / 1000)}>** **(<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>)** tarihinde oluşturulmuş!
Kayıt işleminden sonra ${RulesChannel} kanalına göz atmayı unutmayın. ${ertum.ConfirmerRoles.map((x) => `<@&${x}>`)}

${member.guild.channels.cache.filter(x => x.parentId == ertum.RegisterRoomCategory && x.type == ChannelType.GuildVoice).random()} Kanalına katılarak **"İsim | Yaş"** vererek kayıt olabilirsiniz.
\`\`\`fix
Kayıt edildikten sonra Topluluk kurallarını okumuş ve kabul etmiş sayılarak ceza-i işlem yapılıcaktır.
\`\`\``,
        });
        invChannel.send({
            content: `${member} üyesi **Sunucu Özel URL** kullanarak <t:${Math.floor(member.joinedAt / 1000)}:R> sunucumuza katıldı.`,
        });
    }

    if (!usedInvite) return;
    await inviteMemberSchema.findOneAndUpdate(
        { guildID: member.guild.id, userID: member.user.id },
        { $set: { inviter: usedInvite.inviter.id } },
        { upsert: true }
    );
    await inviterSchema.findOneAndUpdate(
        { guildID: member.guild.id, userID: member.id },
        { $set: { inviterID: usedInvite.inviter.id } },
        { upsert: true }
    );
    await inviterSchema.findOneAndUpdate(
        { guildID: member.guild.id, userID: usedInvite.inviter.id },
        { $inc: { total: 1, regular: 1 } },
        { upsert: true }
    );
    const inviterData = await inviterSchema.findOne({
        guildID: member.guild.id,
        userID: usedInvite.inviter.id,
    });

    if (usedInvite.inviter) {
        // Görev 
        const checkForTask = await userTask.findOne({ userId: usedInvite.inviter.id });

        const inviterMemberObject = member.guild.members.cache.get(usedInvite.inviter.id)

        if (!checkForTask) {
            new userTask({
                 userId: usedInvite.inviter.id,
                roleId: inviterMemberObject.roles.highest.id
            }).save()
        }

        const dataForTask = await userTask.findOne({ userId: usedInvite.inviter.id });

        if (dataForTask) {
            const activeTask = await tasks.findOne({ currentRole: dataForTask.roleId })
            
            if (activeTask) {
                if (!dataForTask.completeds?.invite && dataForTask.counts?.invite > activeTask.requiredCounts.invite) {
                    await userTask.findOneAndUpdate(
                        { userId: usedInvite.inviter.id },
                        { $set: {'counts.invite': 0, 'completeds.invite': true} },
                        { upsert: true, new: true }
                    )
                } else {
                    await userTask.findOneAndUpdate(
                        { userId: usedInvite.inviter.id },
                        { $inc: { 'counts.invite': 1 } },
                        { upsert: true, new: true }
                    )
                }
            }
        }
        // Görev
    }

    const total = inviterData ? inviterData.total : 0;
    welChannel.send({
        content: `
### ${member}, Sunucumuza hoş geldin.

Seninle beraber sunucumuz ${rakam(memberCount)} üye sayısına ulaştı.
                                
Hesabın **<t:${Math.floor(member.user.createdTimestamp / 1000)}>** **(<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>)** tarihinde oluşturulmuş!
Kayıt işleminden sonra ${RulesChannel} kanalına göz atmayı unutmayın. ${ertum.ConfirmerRoles.map((x) => `<@&${x}>`)}

${member.guild.channels.cache.filter(x => x.parentId == ertum.RegisterRoomCategory && x.type == ChannelType.GuildVoice).random()} Kanalına katılarak **"İsim | Yaş"** vererek kayıt olabilirsiniz.
\`\`\`fix
Kayıt edildikten sonra Topluluk kurallarını okumuş ve kabul etmiş sayılarak ceza-i işlem yapılıcaktır.
\`\`\``,
    });
    invChannel.send({
        content: `${member} üyesi **${usedInvite.inviter.tag}** tarafından <t:${Math.floor(member.joinedAt / 1000)}:R> sunucumuza davet edildi. (Toplam Davet: \`${total}\`)`,
    });
});

const rakam = client.sayıEmoji = (sayi) => {
    var ertu = sayi.toString().replace(/ /g, "     ");
    var ertu2 = ertu.match(/([0-9])/g);
    ertu = ertu.replace(/([a-zA-Z])/g, "Belirlenemiyor").toLowerCase();
    if (ertu2) {
      ertu = ertu.replace(/([0-9])/g, d => {
        return {
          '0': client.emoji("sayiEmoji_sifir") !== null ? client.emoji("sayiEmoji_sifir") : "\` 0 \`",
          '1': client.emoji("sayiEmoji_bir") !== null ? client.emoji("sayiEmoji_bir") : "\` 1 \`",
          '2': client.emoji("sayiEmoji_iki") !== null ? client.emoji("sayiEmoji_iki") : "\` 2 \`",
          '3': client.emoji("sayiEmoji_uc") !== null ? client.emoji("sayiEmoji_uc") : "\` 3 \`",
          '4': client.emoji("sayiEmoji_dort") !== null ? client.emoji("sayiEmoji_dort") : "\` 4 \`",
          '5': client.emoji("sayiEmoji_bes") !== null ? client.emoji("sayiEmoji_bes") : "\` 5 \`",
          '6': client.emoji("sayiEmoji_alti") !== null ? client.emoji("sayiEmoji_alti") : "\` 6 \`",
          '7': client.emoji("sayiEmoji_yedi") !== null ? client.emoji("sayiEmoji_yedi") : "\` 7 \`",
          '8': client.emoji("sayiEmoji_sekiz") !== null ? client.emoji("sayiEmoji_sekiz") : "\` 8 \`",
          '9': client.emoji("sayiEmoji_dokuz") !== null ? client.emoji("sayiEmoji_dokuz") : "\` 9 \`"
        }[d];
      });
    }
    return ertu;
  }