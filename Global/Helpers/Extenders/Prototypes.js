const { Client, Collection, GuildMember, Guild, MessageEmbed, TextChannel } = require('discord.js');

exports.toFancyNum = function (num) {
	let parts = num.toString().split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return parts.join('.');
};

exports.toShortNum = function (num) {
	if (num >= 1000000) return Math.trunc(num / 1000000) + 'M';
	else if (num >= 1000) return Math.trunc(num / 1000) + 'K';
	else return num;
};

Guild.prototype.findRole = function(content) {
    let Role = this.roles.cache.find(r => r.name === content) || this.roles.cache.find(r => r.id === content)
    if(!Role) return logger.error(`${content} rolünü ${this.name} sunucusun da aradım fakat bulamadım.`);
    return Role;
}

Guild.prototype.findChannel = function(content) {
    let Channel = this.channels.cache.find(k => k.name === content) || this.channels.cache.find(k => k.id === content) || this.client.channels.cache.find(e => e.id === content) || this.client.channels.cache.find(e => e.name === content)
    if(!Channel) return logger.error(`${content} kanalını ${this.name} sunucusun da aradım fakat bulamadım.`);
    return Channel;
}

TextChannel.prototype.wsend = async function (message) {
    const hooks = await this.fetchWebhooks();
    let webhook = hooks.find(a => a.name === Client.user.username && a.owner.id === Client.user.id);
    if (webhook) return webhook.send(message);
    webhook = await this.createWebhook(Client.user.username, { avatar: Client.user.avatarURL() });
    return webhook.send(message);
};

Array.prototype.listele = function () {
    return this.length > 1 ? this.slice(0, -1).map((x) => `${x}`).join(" ") + " ve " + this.map((x) => `${x}`).slice(-1) : this.map((x) => `${x}`).join("");
};

Array.prototype.prefixle = function () {
    return this.length > 1 ? this.slice(0, -1).map((x) => `${x}`).join(" | ") + " ve " + this.map((x) => `${x}`).slice(-1) : this.map((x) => `${x}`).join("");
};


Array.prototype.last = function () {
    return this[this.length - 1];
};

Collection.prototype.array = function () {
    return [...this.values()]
};

Promise.prototype.delete = function (time) {
    if (this) this.then(message => {
      if (message.deletable)
        setTimeout(() => message.delete(), time * 1000)
    });
  };