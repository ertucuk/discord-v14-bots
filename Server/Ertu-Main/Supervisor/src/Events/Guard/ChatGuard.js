const { EmbedBuilder, AuditLogEvent, ChannelType,Events } = require("discord.js");
const client = global.client;
const moment = require("moment");
require("moment-duration-format")
moment.locale("tr")
const ms = require("ms");
const usersMap = new Map();
const getLimit = new Map();
const LIMIT = 3;
const TIME = 10000;
const DIFF = 1000;
const system = require('../../../../../../Global/Settings/System');
const ertum = require('../../../../../../Global/Settings/Setup.json');
const {reklamlar, inviteEngel, küfürler} = require("../../../../../../Global/Settings/AyarName");
const guard = require("../../../../../Ertu-Guard/Schemas/Guard");

client.on(Events.MessageCreate, async (message) => {
  const Guard = await guard.findOne({guildID: system.ServerID})
  const chatGuard = Guard ? Guard.chatGuards : false;
  if(chatGuard == true){
    if(message.webhookID || message.author.bot || message.channel.type === ChannelType.DM) return;
    if (await guvenli(message.author,"chatguard") == true) return;
    if ((message.mentions.roles.size + message.mentions.users.size + message.mentions.channels.size) >= 3) return send(message, "Birden çok kişiyi etiklemezsen seviniriz")

    if (system.Security.KufurEngel && küfürler.some(word => new RegExp("(\\b)+(" + word + ")+(\\b)", "gui").test(message.content))) return send(message, `Küfür etmekten vazgeç`)

    if(message.content && message.content.length && message.content.length >= 165) return send(message, "Lütfen uzun mesaj göndermeyin")
    const Caps = (message.content.match(/[A-ZĞÇÖIÜ]/gm) || []).length;
    if ((system.Security.CapsEngel) && (Caps / message.content.length) >= 0.7) return send(message, `Sohbet kanallarında caps kullanmaktan vazgeç`)

    if (system.Security.ReklamEngel && message.content.match(inviteEngel)) {
        const invites = await message.guild.invites.fetch();
        if ((message.guild.vanityURLCode && message.content.match(inviteEngel).some((i) => i === message.guild.vanityURLCode)) || invites.some((x) => message.content.match(inviteEngel).some((i) => i === x))) return;
        return send(message, "Lütfen reklam yapmayı bırakınız")
    }

    if(system.Security.KufurEngel && reklamlar.some(word => message.content.toLowerCase().includes(word))) return send(message, "Lütfen reklam yapmayı bırakınız")
  }
})

client.on(Events.MessageCreate, async (message) => {
  const Guard = await guard.findOne({guildID: system.ServerID})
  const chatGuard = Guard ? Guard.chatGuards : false;
  if(chatGuard == true){
    if(message.webhookID || message.author.bot || message.channel.type === ChannelType.DM) return;
    if (await guvenli(message.author,"chatguard") == true) return;
    if (system.Security.SpamEngel == false) return;
  
      if(usersMap.has(message.author.id)) {
          const userData = usersMap.get(message.author.id);
          const {lastMessage, timer} = userData;
          const difference = message.createdTimestamp - lastMessage.createdTimestamp;
          let msgCount = userData.msgCount;
          
              if(difference > DIFF) {
                  clearTimeout(timer);
                  userData.msgCount = 1;
                  userData.lastMessage = message;
                      userData.timer = setTimeout(() => {
                          usersMap.delete(message.author.id);
                      }, TIME);
                  usersMap.set(message.author.id, userData)
              } else {
                      msgCount++;
                      if(parseInt(msgCount) === LIMIT) {
                          sonMesajlar(message, 30)
                          usersMap.delete(message.author.id);
                          client.guilds.cache.get(system.ServerID).members.cache.get(message.member.id).roles.add(ertum.MutedRole)
                          const duration = "3m" ? ms("3m") : undefined;
                          await message.member.send({content: `Sunucumuz da **Sohbet kanallarını kirletme!** sebebi ile metin kanallarında susturuldun. Ceza bitiş tarihi <t:${Math.floor((Date.now() + duration) / 1000)}:R>. Eğer bu konu hakkında bir itirazın var ise üst yetkililerimize ulaşmaktan çekinme! `})
                          await message.reply({content: `Sohbet kanallarını kirletme sebebiyle \` 3 dakika \` süresince susturuldunuz, mesajlar temizlendi. Lütfen yavaşlayın. ${message.member}`}).then(x => setTimeout(() => {
                              x.delete().catch(err => {})
                          }, 7500)).catch(err => {})
                          return client.penalize(message.guild.id, message.author.id, "Chat-Mute", true, client.user.id, "Metin Kanallarında Flood Yapmak!", true, Date.now() + duration);
                       } else {
            userData.msgCount = msgCount;
            usersMap.set(message.author.id, userData)
          }}}
           else{
          let fn = setTimeout(() => {
            usersMap.delete(message.author.id)
          }, TIME);
          usersMap.set(message.author.id, {
          msgCount: 1,
          lastMessage: message,
          timer: fn
          
          })
          }
        }
  })


  client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
    const Guard = await guard.findOne({guildID: system.ServerID})
    const chatGuard = Guard ? Guard.chatGuards : false;
    if(chatGuard == true){
    if(newMessage.webhookID || newMessage.author.bot || newMessage.channel.type === ChannelType.DM) return;
    if (await guvenli(newMessage.author,"chatguard") == true) return;
    if (system.Security.KufurEngel && küfürler.some(word => new RegExp("(\\b)+(" + word + ")+(\\b)", "gui").test(newMessage.content))) newMessage.delete().catch(err => {});
    if (newMessage.content.replace(system.Security.CapsEngel, "").length >= newMessage.content.length / 2) {
        if (newMessage.content.length <= 15) return;
        if (newMessage.deletable) newMessage.delete().catch(err => err);
    }
    if (system.Security.ReklamEngel && newMessage.content.match(inviteEngel)) {
        const invites = await newMessage.guild.invites.fetch();
        if ((newMessage.guild.vanityURLCode && newMessage.content.match(inviteEngel).some((i) => i === newMessage.guild.vanityURLCode)) || invites.some((x) => newMessage.content.match(inviteEngel).some((i) => i === x))) return;
        return newMessage.delete().catch(err => {});
    }
    if(system.Security.KufurEngel && reklamlar.some(word => newMessage.content.toLowerCase().includes(word))) return newMessage.delete().catch(err => {})
  }
});

  async function send(message, content) {
    if ((Number(getLimit.get(`${message.member.id}`))) == 3) {
        message.delete().catch(err => {})
        getLimit.delete((Number(getLimit.get(`${message.member.id}`))))
        const duration = "10m" ? ms("10m") : undefined;
        await message.member.send({content: `Sunucumuz da **Metin Kanallarında kurallara uymamak!** sebebi ile metin kanallarında susturuldun. Ceza bitiş tarihi <t:${Math.floor((Date.now() + duration) / 1000)}:R>. Eğer bu konu hakkında bir itirazın var ise üst yetkililerimize ulaşmaktan çekinme! `})
        await message.channel.send({content: `${message.member} Sohbet kanallarında ki kurallara uymadığın için \` 10 Dakika \` susturuldun.`}).then(x => setTimeout(() => {
            x.delete().catch(err => {})
        }, 7500)).catch(err => {})
        client.guilds.cache.get(system.ServerID).members.cache.get(message.member.id).roles.add(ertum.MutedRole)
        return client.penalize(message.guild.id, message.member.id, "Chat-Mute", true, client.user.id, "Metin Kanallarında kurallara uymamak.", true, Date.now() + duration);
    } else {
        getLimit.set(`${message.member.id}`, (Number(getLimit.get(`${message.member.id}`) || 0)) + 1)
        message.delete().catch(err => {})
        let embed = new EmbedBuilder().setColor("Random")
        message.channel.send({content: `${message.member}`, embeds: [embed.setColor("Random").setDescription(`**Merhaba!** ${message.member.user.tag}
Sohbet kanalında ${content}, aksi taktirde yaptırım uygulanacaktır.
    `)]}).then(x => {
            setTimeout(() => {
                x.delete().catch(err => {})
            }, 6000);
        })
        setTimeout(() => {
            if(getLimit.get(`${message.member.id}`)) getLimit.set(`${message.member.id}`, (Number(getLimit.get(`${message.member.id}`) || 0)) - 1)
          },10000)
    }
} 

async function sonMesajlar(message, count = 25) {
    let messages = await message.channel.messages.fetch({ limit: 100 });
    let filtered = [...messages.filter((x) => x.author.id === message.author.id).values()].splice(0, count);
    message.channel.bulkDelete(filtered).catch(err => {});
} 

const guvenli = global.guvenli = async function(member,type){
    const guardData = await guard.findOne({guildID:system.ServerID});
    const whitelistFull = guardData ? guardData.SafedMembers : system.BotsOwners;
    const whitelistServer = guardData ? guardData.serverSafedMembers : system.BotsOwners;
    const whitelistRole = guardData ? guardData.roleSafedMembers : system.BotsOwners;
    const whitelistChannel = guardData ? guardData.channelSafedMembers : system.BotsOwners;
    const whitelistBanKick = guardData ? guardData.banKickSafedMembers : system.BotsOwners;
    const whitelistEmojiSticker = guardData ? guardData.banKickSafedMembers : system.BotsOwners;
    const chatguard = guardData ? guardData.chatGuard : system.BotsOwners;
    if(type == "full"){
      if(whitelistFull.some(id=> member.id === id) || system.BotsOwners.some(x=> member.id === x)){ return true}else return false
    }
    if(type == "server"){
    if(whitelistFull.some(id=> member.id === id) || whitelistServer.some(id=> member.id === id) || System.BotsOwners.some(x=> member.id === x)) {return true}else return false
    }
    if(type == "role"){
      if(whitelistFull.some(id=> member.id === id) || whitelistRole.some(id=> member.id === id) || system.BotsOwners.some(x=> member.id === x)) {return true}else return false
    }
    if(type == "channel"){
      if(whitelistFull.some(id=> member.id === id) || whitelistChannel.some(id=> member.id === id) || system.BotsOwners.some(x=> member.id === x)) {return true}else return false
    }
    if(type == "bankick"){
      if(whitelistFull.some(id=> member.id === id) || whitelistBanKick.some(id=> member.id === id) || system.BotsOwners.some(x=> member.id === x)) {return true}else return false
    }
    if(type == "emojisticker"){
      if(whitelistFull.some(id=> member.id === id) || whitelistEmojiSticker.some(id=> member.id === id) || system.BotsOwners.some(x=> member.id === x)) {return true}else return false
    }
    if(type == "chatguard"){
      if(whitelistFull.some(id=> member.id === id) || chatguard.some(id=> member.id === id) || system.BotsOwners.some(x=> member.id === x)) {return true}else return false
    }
  }