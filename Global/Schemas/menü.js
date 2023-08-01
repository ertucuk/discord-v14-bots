const { Schema, model } = require("mongoose");

const schema = Schema({
    Name: String,
    Roles: Array,
    Text: String,
    Secret: String,
    Date: Date,
    Author: String,
});
module.exports = model("menü", schema);