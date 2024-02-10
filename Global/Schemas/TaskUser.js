const { model, Schema } = require('mongoose')

module.exports = model('TaskUser',
    new Schema({
        userId: String,
        startedAuth: {type: Date, default: Date.now()},
        currentlyRole: {type: Number, default: Date.now()},
        Mission: { type: Object, default: {
            Tagged: 0,
            Register: 0,
            Message: 0,
            Invite: 0,
            Staff: 0,
            CompletedStaff: false,
            CompletedInvite: false,
            CompletedAllVoice: false,
            CompletedPublicVoice: false,
            CompletedTagged: false,
            CompletedRegister: false,
            CompletedMessage: false,
            CompletedMission: 0,
        }},
    })
)