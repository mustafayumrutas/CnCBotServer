var mongoose = require('mongoose');

//Types: String, Number, Date, Buffer, Boolean, Mixed, Objectid, Array, Decimal128

var connections = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    socket: {type:Object,required:true}, //index:true

    ip:{type:String,required:true},

    port: {type:String,required:true},

    name: {type:String}

});

var connections = mongoose.model('connections',connections);

module.exports = connections;