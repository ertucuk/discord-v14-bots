const { Event } = require("../../../Structures/Default.Events");
const Guild = require("../../../../../Global/Settings/System")
const GuardData = require("../../../Schemas/Guard")

const startDistributors = require('../../../Additions/_general.additions')


class Backup extends Event {
    constructor(client) {
        super(client, {
            name: "ready",
            enabled: true,
        });    
    }    

 async onLoad() {
        const guild = client.guilds.cache.get(Guild.ServerID)
        const Guard = await GuardData.findOne({guildID: guild.id})
        const databaseonly = Guard ? Guard.database : false;
        if(databaseonly == true){
        await startDistributors()
      await guildRoles(guild)
      await guildChannels(guild)
      setInterval(async () => {
        await guildRoles(guild)
        await guildChannels(guild)
    }, 1000*60*60*1);
        }
    }
}    




module.exports = Backup;
