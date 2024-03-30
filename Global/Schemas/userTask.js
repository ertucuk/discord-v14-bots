const { model, Schema } = require('mongoose')

module.exports = model('userTasks', 
    new Schema({
        userId: String,
        roleId: String,
        counts: {
            message: { type: Number, default: 0 },
            voice: { type: Number, default: 0 },
            register: { type: Number, default: 0 },
            invite: { type: Number, default: 0 },
            staff: { type: Number, default: 0 }
        },
        completeds: {
            message: { type: Boolean, default: false },
            voice: { type: Boolean, default: false },
            register: { type: Boolean, default: false },
            invite: { type: Boolean, default: false },
            staff: { type: Boolean, default: false}
        }
    })
)