        const client = global.client;
        const { ActivityType, Events } = require("discord.js")
        const { green } = require("../../../../../../Global/Settings/Emojis.json");
        const ertum = require("../../../../../../Global/Settings/Setup.json")
        const system = require("../../../../../../Global/Settings/System");
        const forceBans = require("../../../../Supervisor/src/schemas/forceBans")
        const inviterSchema = require("../../../../Supervisor/src/schemas/inviter");
        const inviteMemberSchema = require("../../../../Supervisor/src/schemas/inviteMember");
        const coin = require("../../../../Supervisor/src/schemas/coin");
        const gorev = require("../../../../Supervisor/src/schemas/invite");
        const otokayit = require("../../../../Supervisor/src/schemas/otokayit");
        const bannedTag = require("../../../../Supervisor/src/schemas/bannedTag");
        const regstats = require("../../../../Supervisor/src/schemas/registerStats");
        const isimler = require("../../../../Supervisor/src/schemas/names");

                client.on("guildMemberAdd", async (member) => {

                const ErtuData = await forceBans.findOne({ guildID: system.ServerID, userID: member.user.id });
                if (ErtuData) return member.guild.members.ban(member.user.id, { reason: "Ertu Systems | Sunucudan kalıcı olarak yasaklandı!" }).catch(() => {});
        
                const cachedInvites = client.invites.get(member.guild.id);
                const newInvites = await client.guilds.cache.get(member.guild.id).invites.fetch();
                const usedInvite = await newInvites.find(inv => cachedInvites.get(inv.code) < inv.uses);
                newInvites.each(inv => cachedInvites.set(inv.code, inv.uses));
                client.invites.set(member.guild.id, cachedInvites);

                let guvenilirlik = Date.now() - member.user.createdTimestamp < 1000 * 60 * 60 * 24 * 7;
                if (guvenilirlik) {
                if (ertum.SuspectedRoles) member.roles.add(ertum.SuspectedRoles).catch();
                } else if (ertum.UnRegisteredRoles) member.roles.add(ertum.UnRegisteredRoles).catch();
                if (ertum.ServerTag.some(tag => member.user.displayName.includes(tag))) { member.setNickname(`${ertum.ServerUntagged} İsim | Yaş`).catch(); }
                else { member.setNickname(`${ertum.ServerUntagged} İsim | Yaş`).catch(); }

                const otoreg = await otokayit.findOne({ userID: member.id })
                const tagModedata = await regstats.findOne({ guildID: system.ServerID })
                if (tagModedata && tagModedata.tagMode === false) {
                if (otoreg) {
                await member.roles.set(otoreg.roleID)
                await member.roles.remove(ertum.UnRegisteredRoles)
                await member.setNickname(`${ertum.ServerUntagged} ${otoreg.name} | ${otoreg.age}`);
                if (ertum.ChatChannel && client.channels.cache.has(ertum.ChatChannel)) client.channels.cache.get(ertum.ChatChannel).send({ content: `Aramıza hoşgeldin **${member}**! Sunucumuzda daha önceden kayıtın bulunduğu için direkt içeriye alındınız. Kuralları okumayı unutma!` }).then((e) => setTimeout(() => { e.delete(); }, 10000));
                await isimler.findOneAndUpdate({ guildID: system.ServerID, userID: member.user.id }, { $push: { names: { name: member.displayName, sebep: "Oto Bot Kayıt", rol: otoreg.roleID.map(x => `<@&${x}>`), date: Date.now() } } }, { upsert: true });
                }
                }

                const invChannel = member.guild.channels.cache.get(ertum.InviteChannel);    
                const welChannel = member.guild.channels.cache.get(ertum.WelcomeChannel);
                const RulesChannel = member.guild.channels.cache.get(ertum.RulesChannel);
                if (!invChannel) return;
                if (member.user.bot) return;
                
                member.user.displayName.includes(ertum.ServerTag) ? member.roles.add([ertum.TaggedRole, ertum.UnRegisteredRoles]) : member.roles.add(ertum.UnRegisteredRoles)
                member.setNickname(`${member.user.displayName.includes(ertum.ServerTag) ? ertum.ServerTag : ertum.ServerUntagged} İsim | Yaş`) 
        
                if(!usedInvite) {
                welChannel.send({ content: 
                `
### ${member}, Sunucumuza hoş geldin.

Seninle beraber sunucumuz **${member.guild.memberCount}** üye sayısına ulaştı.
                        
Hesabın **<t:${Math.floor(member.user.createdTimestamp / 1000)}>** **(<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>)** tarihinde oluşturulmuş!
Kayıt işleminden sonra ${RulesChannel} kanalına göz atmayı unutmayın. ${ertum.ConfirmerRoles.map(x => `<@&${x}>`)}
\`\`\`fix
Kayıt edildikten sonra Topluluk kurallarını okumuş ve kabul etmiş sayılarak ceza-i işlem yapılıcaktır.
\`\`\`
        `})
        invChannel.send({ content: 
                `
                >>>  ${green} ${member} <t:${Math.floor(member.joinedAt / 1000)}:R> sunucuya **Sunucu Özel URL** ile katıldı. Sunucumuz **${member.guild.memberCount}** Uye sayisina ulaştı.
                `
                })
                }
                
                if(!usedInvite) return;
                await inviteMemberSchema.findOneAndUpdate({ guildID: member.guild.id, userID: member.user.id }, { $set: { inviter: usedInvite.inviter.id } }, { upsert: true });
                await inviterSchema.findOneAndUpdate({ guildID: member.guild.id, userID: member.id }, { $set: { inviterID: usedInvite.inviter.id } }, { upsert: true });
                await inviterSchema.findOneAndUpdate({ guildID: member.guild.id, userID: usedInvite.inviter.id }, { $inc: { total: 1, regular: 1 } }, { upsert: true });
                const inviterData = await inviterSchema.findOne({ guildID: member.guild.id, userID: usedInvite.inviter.id });
                const total = inviterData ? inviterData.total : 0;
                welChannel.send({ content: 
                `
### ${member}, Sunucumuza hoş geldin.

Seninle beraber sunucumuz **${member.guild.memberCount}** üye sayısına ulaştı.
                                
Hesabın **<t:${Math.floor(member.user.createdTimestamp / 1000)}>** **(<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>)** tarihinde oluşturulmuş!
Kayıt işleminden sonra ${RulesChannel} kanalına göz atmayı unutmayın. ${ertum.ConfirmerRoles.map(x => `<@&${x}>`)}
\`\`\`fix
Kayıt edildikten sonra Topluluk kurallarını okumuş ve kabul etmiş sayılarak ceza-i işlem yapılıcaktır.
\`\`\`
                `
                })
                invChannel.send({ content:
                `
                >>> ${green} ${member} <t:${Math.floor(member.joinedAt / 1000)}:R>  sunucuya **${usedInvite.inviter.tag}** davetiyle katıldı! Uyenin Davet Sayısı (**${total}**) Sunucumuz **${member.guild.memberCount}** üye sayısına ulaştı!
                `
                })
                
                await coin.findOneAndUpdate({ guildID: member.guild.id, userID: usedInvite.inviter.id }, { $inc: { coin: 1 } }, { upsert: true });
                if (gorev) { await gorev.findOneAndUpdate({ guildID: member.guild.id, userID: usedInvite.inviter.id }, { $inc: { invite: 1 } }, { upsert: true });}
                
        });
        