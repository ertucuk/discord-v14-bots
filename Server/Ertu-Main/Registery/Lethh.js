require("./src/Helpers/Extenders/Prototypes");

const System = require("../../../Global/Settings/System");
const { Lethh } = require("./src/Structures/Lethh");
const { Collection } = require("discord.js");

let client = global.client = new Lethh({ 
   Directory: "Lethh V14 Bot", 
   token: System.Mainframe.Registery,
});

client.loadClient({
   Events   : true,
   Commands : false,
   Slashes  : false,
   Contexts : false,
   Database : true,
});


module.exports = client;
client.connect();
