'use strict';
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

var schema = new Schema({
    id: ObjectId
}, { strict: false });

//Modelo// test
module.exports = mongoose.model('itesis', schema);
