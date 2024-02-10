const { model, Schema } = require('mongoose')

module.exports = model('TaskRole',
    new Schema({
        guildID: String,
        RoleID: String,
        Active: {type: Boolean, default: true},
        AllVoice: Number,
        Tagged: Number,
        Message: Number,
        Staff: Number,
        PublicVoice: Number,
        Register: Number,
        Invite: Number, 
        Date: {type: Number, default: Date.now()},
        Time: {type: Number },
        Users: Array,
        CountTasks: Number,   
    })
)