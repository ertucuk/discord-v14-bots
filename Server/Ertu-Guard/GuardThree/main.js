const { Approval } = require('../Structures/Default.Clients');
const Bots = require("../../../Global/Settings/System.js")

let client = global.client = new Approval({
    token: Bots.Security.Guard_III,
    owners: Bots.BotsOwners,
    MongoURI: Bots.MongoURL,
    _dirname: "GuardThree"
});

client.fetchEvents(true)
client.connect()


