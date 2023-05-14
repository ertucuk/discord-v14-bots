const client = global.client;
const { ActivityType, Events } = require("discord.js")
const { green } = require("../../Settings/Emojis.json");
const ertum = require("../../Settings/Setup.json")
const system = require("../../Settings/System");
const forceBans = require("../../schemas/forceBans")
const inviterSchema = require("../../schemas/inviter");
const inviteMemberSchema = require("../../schemas/inviteMember");
const coin = require("../../schemas/coin");
const gorev = require("../../schemas/invite");
const otokayit = require("../../schemas/otokayit");
const bannedTag = require("../../schemas/bannedTag");
const regstats = require("../../schemas/registerStats");

        client.on("guildMemberAdd", async (member) => {

        const invChannel = member.guild.channels.cache.get(ertum.InviteChannel);    
        const welChannel = member.guild.channels.cache.get(ertum.WelcomeChannel);
        
        const ErtuData = await forceBans.findOne({ guildID: system.ServerID, userID: member.user.id });
        if (ErtuData) return member.guild.members.ban(member.user.id, { reason: "Ertu Systems | Sunucudan kalıcı olarak yasaklandı!" }).catch(() => {});
    
        const fakeControl = Date.now()-member.user.createdTimestamp < 1000*60*60*24*7
        if(fakeControl) {
        await inviterSchema.findOneAndUpdate({ guildID: member.guild.id, userID: fakeControl.inviter.id }, { $inc: { total: 1, fake: 1 } }, { upsert: true });
        const inviterData = await inviterSchema.findOne({ guildID: member.guild.id, userID: fakeControl.inviter.id });
        const total = inviterData ? inviterData.total : 0;
        await member.roles.set([ertum.SuspectedRoles], { reason: `Hesabı yeni olduğu için şüpheli olarak işaretlendi!` })
        welChannel.send({ content: `${member} kullanıcısı sunucuya yeni katıldı fakat hesabı <t:${Math.floor(member.user.createdTimestamp / 1000)}:R> açıldığı için şüpheli olarak işaretlendi!` })
        invChannel.send({ content:`${green} ${member} <t:${Math.floor(member.joinedAt / 1000)}:R>  sunucuya ${invite.inviter.tag} davetiyle katıldı! (**${total}**) Sunucumuz **${member.guild.memberCount}** üye sayısına ulaştı!`})
        }
    
        if (member.user.bot) return;
    
        const cachedInvites = client.invites.get(member.guild.id);
        const newInvites = await client.guilds.cache.get(member.guild.id).invites.fetch();
        const usedInvite = await newInvites.find(inv => cachedInvites.get(inv.code) < inv.uses);
        newInvites.each(inv => cachedInvites.set(inv.code, inv.uses));
        client.invites.set(member.guild.id, cachedInvites);
    
        member.user.username.includes(ertum.ServerTag) ? member.roles.add([ertum.FamilyRole, ertum.UnRegisteredRoles]) : member.roles.add(ertum.UnRegisteredRoles)
        member.setNickname(`${member.user.username.includes(ertum.ServerTag) ? ertum.ServerTag : ertum.ServerUntagged} İsim | Yaş`) 
    
        if(!usedInvite) {
        welChannel.send({ content: 
        `
        ${member}, ${member.guild.name} sunucumuza hoş geldin.
Seninle beraber sunucumuz **${member.guild.memberCount}** üye sayısına ulaştı.
                    
Hesabın <t:${Math.floor(member.user.createdTimestamp / 1000)}> (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>) tarihinde oluşturulmuş!
\`\`\`fix
Kayıt olduktan sonra kuralları okuduğunuzu kabul edeceğiz ve içeride yapılacak cezalandırma işlemlerini bunu göz önünde bulundurarak yapacağız.\`\`\`
>>> ${member} kullanıcısını davet eden [**Sunucu Özel URL**] ${ertum.ConfirmerRoles.map(x => `<@&${x}>`)}`
        })
        invChannel.send({ content: 
        `
        >>>  ${green} ${member} <t:${Math.floor(member.joinedAt / 1000)}:R> sunucuya **Sunucu Özel URL** ile katıldı. Sunucumuz **${member.guild.memberCount}** Uye sayisina ulaştı.
         `
        })
        }
        
        if(!usedInvite) return;
        
        await inviterSchema.findOneAndUpdate({ guildID: member.guild.id, userID: member.id }, { $set: { inviterID: usedInvite.inviter.id } }, { upsert: true });
        await inviterSchema.findOneAndUpdate({ guildID: member.guild.id, userID: usedInvite.inviter.id }, { $inc: { total: 1, regular: 1 } }, { upsert: true });
        const inviterData = await inviterSchema.findOne({ guildID: member.guild.id, userID: usedInvite.inviter.id });
        const total = inviterData ? inviterData.total : 0;
        welChannel.send({ content: 
        `
        ${member}, ${member.guild.name} sunucumuza hoş geldin.
Seninle beraber sunucumuz **${member.guild.memberCount}** üye sayısına ulaştı.
        
Hesabın <t:${Math.floor(member.user.createdTimestamp / 1000)}> (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>) tarihinde oluşturulmuş!
\`\`\`fix
Kayıt olduktan sonra kuralları okuduğunuzu kabul edeceğiz ve içeride yapılacak cezalandırma işlemlerini bunu göz önünde bulundurarak yapacağız.\`\`\`
>>> Sunucumuza  **${usedInvite.inviter}**  kullanıcısının davetiyle katıldı! 🎉 ${ertum.ConfirmerRoles.map(x => `<@&${x}>`)}
        `
        })
        invChannel.send({ content:
        `
        >>> ${green} ${member} <t:${Math.floor(member.joinedAt / 1000)}:R>  sunucuya **${usedInvite.inviter.tag}** davetiyle katıldı! Uyenin Davet Sayısı (**${total}**) Sunucumuz **${member.guild.memberCount}** üye sayısına ulaştı!
        `
        })
        
        await coin.findOneAndUpdate({ guildID: member.guild.id, userID: usedInvite.inviter.id }, { $inc: { coin: 1 } }, { upsert: true });
        const gorevData = await gorev.findOne({ guildID: member.guild.id, userID: usedInvite.inviter.id });
        if (gorevData) { await gorev.findOneAndUpdate({ guildID: member.guild.id, userID: usedInvite.inviter.id }, { $inc: { invite: 1 } }, { upsert: true });}
        
    });
  