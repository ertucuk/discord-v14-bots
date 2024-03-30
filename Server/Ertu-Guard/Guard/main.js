const { Approval } = require('../Structures/Default.Clients');
const Bots = require("../../../Global/Settings/System.js")

let client = global.client = new Approval({
    token: Bots.Security.Guard_I,
    owners: Bots.BotsOwners,
    MongoURI: Bots.MongoURL,
    _dirname: "GuardThree"
});

process.on("unhandledRejection", function(error) {
    console.error(error);
  });
  process.on("unhandledException", function(error) {
    console.error(error);
  });

client.fetchEvents2(true)
client.connect()


