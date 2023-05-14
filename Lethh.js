require("./src/Helpers/Extenders/Prototypes");

const System = require("./src/Settings/System");
const { Lethh } = require("./src/Structures/Lethh");
const { Collection } = require("discord.js");

let client = global.client = new Lethh({ 
   Directory: "Lethh V14 Bot", 
   token: System.Moderation.Token,
});

client.loadClient({
   Events   : true,
   Commands : true,
   Slashes  : true,
   Contexts : true,
   Database : true,
});


module.exports = client;
client.connect();
