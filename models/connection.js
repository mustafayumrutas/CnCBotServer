var mongoose = require('mongoose');

//Types: String, Number, Date, Buffer, Boolean, Mixed, Objectid, Array, Decimal128

var connection = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    socket: {type:String,required:true, lowercase: true}, //index:true

    ip:{tpye:String,required:true},

    port: {type:String,required:true},

    name: {type:String,required:true}

});

var chat = mongoose.model('connection',connection);

module.exports = connection;