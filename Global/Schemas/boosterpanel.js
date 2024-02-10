const { Schema, model } = require("mongoose");

const schema = Schema({
    guildID: String,
    userID: String,
    bpanelrol:{type:String, default:undefined},
    bpanelrenk:{type:String, default:undefined},
    rolicon:{type:String, default:undefined},
    kullanıcılar:{type:Array,default:[]},
    date: {type: Number, default: Date.now()},
})

module.exports = model("boosterpanel", schema);
 
