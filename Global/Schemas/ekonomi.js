const mongoose = require('mongoose');

const schema = mongoose.Schema({
    guildID: { type: String, default: "" },
    userID: { type: String, default: "" },
    coin: { type: Number, default: 0 },
    
    beklemeSuresi: { type: Number, default: Date.now() },
    gameSize:{type:Number,default:0},
    profilOlusturma:{type:Number,default:Date.now()},
    hakkimda:{type:String,default:"Girilmedi!"},

    evlilik:{type:Boolean,default:false},
    evlendigi: {type: String, default: ""},
    evlendiğikisiID: {type: String, default: ""},
    evlendigitarih: {type: Number, default:Date.now()},
    evliolduguyuzuk: {type: String, default: ""},

    dailyCoinDate:{type:Number,default:Date.now()},
    profilArkaPlan:{type:String,default:""},
    rozetSeviyesi:{type:String,default:""},

    pirlanta:{type:Number,default:0},
    baget:{type:Number,default:0},
    tektas:{type:Number,default:0},
    tria:{type:Number,default:0},
    bestas:{type:Number,default:0},
});
module.exports = mongoose.model("ekonomi", schema);