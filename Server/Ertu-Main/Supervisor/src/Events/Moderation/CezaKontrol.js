const moment = require("moment");
moment.locale("tr");
const { Events } = require("discord.js");
const client = global.client;
const ertum = require("../../../../../../Global/Settings/Setup.json")
const Penal = require("../../../../../../Global/Schemas/penals");

client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {

    const muteRoles = ertum.MutedRole; 
    const vmuteRoles = ertum.VMutedRole; 
    const jailRoles = ertum.JailedRoles; 

    if(muteRoles.some(r => oldMember.roles.cache.has(r)) && muteRoles.some(r => !newMember.roles.cache.has(r))) {
    const guildID = newMember.guild.id;
    const activeMutes = await Penal.find({ guildID, userID: newMember.id, type: 'Chat-Mute', active: true });
      if(!activeMutes[0]) return
    const mute = activeMutes[0];
      if(mute.finishDate && mute.finishDate > Date.now()) {
        try {
          await newMember.roles.add(muteRoles).then(() => console.log(`Kullanıcıya tekrar mute rolleri verildi: ${newMember.user.tag}`)).catch(err => console.error('Mute rollerini ekleme hatası2:', err));
        } catch (err) {
          console.error('Mute rollerini ekleme hatası:', err);
        };
      };
   }

   if(vmuteRoles.some(r => oldMember.roles.cache.has(r)) && vmuteRoles.some(r => !newMember.roles.cache.has(r))) {
    const guildID = newMember.guild.id;
    const activeMutes = await Penal.find({ guildID, userID: newMember.id, type: 'Voice-Mute', active: true });
      if(!activeMutes[0]) return
    const mute = activeMutes[0];
      if(mute.finishDate && mute.finishDate > Date.now()) {
        try {
          await newMember.roles.add(vmuteRoles).then(() => console.log(`Kullanıcıya tekrar mute rolleri verildi: ${newMember.user.tag}`)).catch(err => console.error('Mute rollerini ekleme hatası2:', err));
        } catch (err) {
          console.error('Mute rollerini ekleme hatası:', err);
        };
      };
   }

   if(jailRoles.some(r => oldMember.roles.cache.has(r)) && jailRoles.some(r => !newMember.roles.cache.has(r))) {
    const guildID = newMember.guild.id;
    const activeMutes = await Penal.find({ guildID, userID: newMember.id, type: 'Jail', active: true });
      if(!activeMutes[0]) return
    const mute = activeMutes[0];
      if(mute.finishDate && mute.finishDate > Date.now()) {
        try {
          await newMember.roles.add(jailRoles).then(() => console.log(`Kullanıcıya tekrar jail rolleri verildi: ${newMember.user.tag}`)).catch(err => console.error('jail rollerini ekleme hatası2:', err));
        } catch (err) {
          console.error('jail rollerini ekleme hatası:', err);
        };
      };
   }
})
  
  module.exports.config = {
    name: "guildMemberUpdate",
  };
  