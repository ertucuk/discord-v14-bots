const mongoose = require("mongoose");
const afkSchema = mongoose.Schema({
    guildID: { type: String, default: "" },
    crewHouse: {type: Array, default: ""},
    tarih: { type: String, default: "" }

});
module.exports = mongoose.model("ekip", afkSchema);