const { model, Schema } = require('mongoose')

module.exports = model('tasks', 
    new Schema({
        guildId: String,
        currentRole: String,
        endOfMissionRole: String,
        requiredCounts: {
            message: Number,
            voice: Number,
            register: Number,
            invite: Number,
            staff: Number
        },
    })
)