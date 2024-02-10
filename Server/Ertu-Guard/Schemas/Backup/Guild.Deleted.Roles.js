const mongoose = require("mongoose");

const schema = mongoose.model('deletedRole', new mongoose.Schema({
    roleID: String,
    Date: Date,
    Remover: String,
}));

module.exports = schema;