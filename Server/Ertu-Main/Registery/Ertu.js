require("../../../Global/Helpers/Extenders/Prototypes");

const System = require("../../../Global/Settings/System");
const { Ertu } = require("./src/Structures/Ertu");
const { Collection } = require("discord.js");

let client = global.client = new Ertu({ 
   Directory: "Ertu V14 Bot", 
   token: System.Mainframe.Registery,
});

client.loadClient({
   Events   : true,
   Database : true,
});


module.exports = client;
client.connect();
