const { GuildMember, Guild, TextChannel } = require("discord.js");
const Webhooklar = {};
const client = global.client;

GuildMember.prototype.rolBul = function (content) {
    let Role = this.roles.cache.find(r => r.name === content) || this.roles.cache.find(r => r.id === content)
    if(!Role) return;
    return Role;
}
Guild.prototype.kanalBul = function(content) {
    let Channel = this.channels.cache.find(k => k.name === content) || this.channels.cache.find(k => k.id === content) || this.client.channels.cache.find(e => e.id === content) || this.client.channels.cache.find(e => e.name === content)
    if(!Channel) return;
    return Channel;
}
Promise.prototype.sil = function(delayInSeconds) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this);
      }, delayInSeconds * 1000);
    }).then((message) => {
      if (message && message.deletable) {
        return message.delete().catch(console.error);
      }
      return null;
    });
};
Guild.prototype.emojiGöster = function(emojiid) {
    let emoji = this.emojis.cache.get(emojiid)
    return emoji;
}
Guild.prototype.getUser = async function (id) {
    let member = this.members.cache.get(id);
    if (!member) {
      try {
        member = await this.members.fetch(id);
      } catch (err) {
        member = undefined;
      }
    }
    return member;
};
TextChannel.prototype.wsend = async function (content, options) {
    if (Webhooklar[this.id]) return (await Webhooklar[this.id].send(content, options));
    let entegrasyonlar = await this.fetchWebhooks();
    let webh = entegrasyonlar.find(e => e.name == client.user.username),
        result;
    if (!webh) {
        webh = await this.createWebhook({
            name:   client.user.username,
            avatar: client.user.avatarURL()
        });
        Webhooklar[this.id] = webh;
        result = await webh.send(content, options);
    } else {
        Webhooklar[this.id] = webh;
        result = await webh.send(content, options);
    }
    return result;
};