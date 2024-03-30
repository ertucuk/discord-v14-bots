const { Schema, model } = require('mongoose');

module.exports = model('channelLogDatas',
    new Schema({
        guildId: String,
        userId: String,
        date: Number,
        channelData: Array
    })
)