var mongoose = require('mongoose');

//Types: String, Number, Date, Buffer, Boolean, Mixed, Objectid, Array, Decimal128

var dataload = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    sender_id: mongoose.Schema.Types.ObjectId, //index:true

    receiver_id: mongoose.Schema.Types.ObjectId,

    data: {type:Object},

});

var dataload = mongoose.model('dataload',dataload);

module.exports = dataload;