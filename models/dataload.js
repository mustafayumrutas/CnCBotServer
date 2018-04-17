var mongoose = require('mongoose');

//Types: String, Number, Date, Buffer, Boolean, Mixed, Objectid, Array, Decimal128

var dataload = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    Sender: {type:String,required:true, lowercase: true}, //index:true

    Receiver: {type:String,required:true},

    Data: {type: Date, default: Date.now() },

});

var dataload = mongoose.model('dataload',dataload);

module.exports = dataload;