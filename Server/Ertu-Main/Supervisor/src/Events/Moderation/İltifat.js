const { EmbedBuilder,Events } = require("discord.js");
const ertum = require('../../../../../../Global/Settings/Setup.json');
const system = require('../../../../../../Global/Settings/System');
const { iltifatlar } = require('../../../../../../Global/Settings/AyarName');

client.on(Events.MessageCreate, async (message) => {
let ertucuk = 0;
if (message.channel.id === ertum.ChatChannel && !message.author.bot) {
ertucuk++;
if (ertucuk >= 75) {
ertucuk = 0;
message.reply({ content: iltifatlar.random()});
};
};
})