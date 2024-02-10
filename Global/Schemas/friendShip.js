const { model, Schema} = require('mongoose')

module.exports = model('friendShips',
    new Schema({
        id: String,
        voices: { type: Object, default: { channels: {}, total: 0 } },
        voiceFriends: { type: Object, default: {} }
    })
) 