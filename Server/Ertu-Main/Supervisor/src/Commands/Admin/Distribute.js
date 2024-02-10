const { ApplicationCommandOptionType,PermissionsBitField, ChannelType } = require("discord.js");
const ertum = require("../../../../../../Global/Settings/Setup.json");
const ertucuk = require("../../../../../../Global/Settings/System");

module.exports = {
    name: "dağıt",
    description: "Bulunduğunuz ses kanalındaki üyeleri public odalara dağıtmaya yarar.",
    category: "ADMIN",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: ["dağıt", "dagit"],
      usage: ".dağıt", 
    },
  

    onLoad: function (client) { },

    onCommand: async function (client, message, args, ertuembed) {

        if(!ertum.OwnerRoles.some(ertucum => message.member.roles.cache.has(ertucum)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
        {
        message.reply({ content:`Yeterli yetkin yok!`}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        return }
	
		let voiceChannel = message.member.voice.channelId;
		if (!voiceChannel)
			return message.reply({ content: "Bir ses kanalında olmalısın!" });
		let publicRooms = message.guild.channels.cache.filter(
			(c) =>
				c.parentId === ertum.PublicRoomsCategory &&
				c.id !== ertum.SleepRoomChannel &&
				c.type === ChannelType.GuildVoice,
		);
		[...message.member.voice.channel.members.values()].forEach(
			(m, index) => {
				setTimeout(() => {
					if (m.voice.channelId !== voiceChannel) return;
					m.voice.setChannel(publicRooms.random().id);
				}, index * 1000);
			},
		);
		message.reply({content: `\`${message.member.voice.channel.name}\` ses kanalında bulunan üyeler public kanallara dağıtılmaya başlandı!`});
     },

  };