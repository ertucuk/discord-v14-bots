const ertum = require("../../Global/Settings/System");
let activities = ertum.Presence.Message, i = 0;
const {Events,ActivityType} = require("discord.js")
let { ERTU } = require('./ertucuk');
const {joinVoiceChannel,} = require('@discordjs/voice');
for (let index = 0; index < ertum.Welcome.Tokens.length; index++) {
    let token = ertum.Welcome.Tokens[index]
    let channel = ertum.Welcome.Channels.length < 1 ? ertum.Welcome.Channels[0] : ertum.Welcome.Channels[index]
    if(channel) {
        let client = new ERTU();
        client.login(token).catch(err => {console.log(`🔴 | Bot Giriş Yapamadı -> Sebep: ${err}`)})
        client.on(Events.VoiceStateUpdate, async (oldState, newState) => { 
            if(oldState.member.id == client.user.id && oldState.channelId && !newState.channelId) { 
            let guild = client.guilds.cache.get(ertum.ServerID);
            if(!guild) return;
            let Channel = global.Voice = guild.channels.cache.get(channel);
            if(!Channel) return console.error("🔴 | Kanal Bulunamadı!");
            client.voiceConnection = await joinVoiceChannel({channelId: Channel.id,guildId: Channel.guild.id,adapterCreator: Channel.guild.voiceAdapterCreator,group: client.user.id})}})
        client.on(Events.ClientReady, async () => {
            console.log(`🟢 | ${client.user.tag} Başarıyla Giriş Yaptı!`)
            let guild = client.guilds.cache.get(ertum.ServerID);
            if(!guild) return;
            let Channel = global.Voice = guild.channels.cache.get(channel);
            if(!Channel) return console.error("🔴 | Kanal Bulunamadı!");
            client.voiceConnection = await joinVoiceChannel({channelId: Channel.id,guildId: Channel.guild.id,adapterCreator: Channel.guild.voiceAdapterCreator,group: client.user.id});
            if(!Channel.hasStaff()) await client.start(channel)
            else client.staffJoined = true, client.playing = false, await client.start(channel)})
        client.on(Events.VoiceStateUpdate, async (oldState, newState) => { 
            if(newState.channelId && (oldState.channelId !== newState.channelId) &&newState.member.isStaff() &&newState.channelId === channel &&!newState.channel.hasStaff(newState.member)) {client.staffJoined = true; client.player.stop() 
            return;}
            if(oldState.channelId && (oldState.channelId !== newState.channelId) && newState.member.isStaff() && oldState.channelId === channel &&!oldState.channel.hasStaff()) {client.staffJoined = false; client.start(channel, true)
            return }})}}

