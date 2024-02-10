const { EmbedBuilder, Events } = require("discord.js");
const ertum = require('../../../../../../Global/Settings/Setup.json');
const system = require('../../../../../../Global/Settings/System');

client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {

    if (oldMember.roles.cache.has(ertum.BoosterRole) && !newMember.roles.cache.has(ertum.BoosterRole)) {
        const data = await isimler.findOne({ guildID: system.ServerID, userID: newMember.user.id });
        if (ertum.OwnerRoles.some(x => newMember.roles.cache.has(x))) return;
        let user = newMember;
        let kanal = client.guilds.cache.get(system.ServerID).guild.channels.cache.find(c => c.name === "boost_log")
        if (!kanal) return;

        const tagModedata = await regstats.findOne({ guildID: system.ServerID })
        if (tagModedata && tagModedata.tagMode === true) {
            if (!tagges.some(tag => user.user.tag.includes(tag)) && !user.roles.cache.has(ertum.VipRole)) return;
            if (kanal) kanal.send({ content: `${user} (\` ${user.user.tag} - ${user.user.id}\`) üye takviyesini kaybetti ve kayıtsıza atıldı.` })
            if (ertum.ChatChannel && client.channels.cache.has(ertum.ChatChannel)) client.channels.cache.get(ertum.ChatChannel).send({ content: `${user.user.username} üyesinin takviyesi çekildiğinden dolayı isim ve yaşı düzeltildi.` }).delete(30)
            await user.voice.disconnect().catch(err => { })
            if (user && user.manageable) await user.setNickname(`${ertum.ServerUntagged} İsim | Yaş`)
            return await user.setRoles(ertum.UnRegisteredRoles)
        } else if (tagModedata && tagModedata.tagMode === false) {
            if (data && data.names.length) {
                let isim = data.names.splice(-1).map((x, i) => `${x.name}`)
                if (user && user.manageable) await user.setNickname(`${ertum.ServerUntagged} ${isim}`)

            }
        }
    }
})