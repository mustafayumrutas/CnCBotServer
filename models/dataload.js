var mongoose = require('mongoose');

//Types: String, Number, Date, Buffer, Boolean, Mixed, Objectid, Array, Decimal128

var dataload = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    sender_id: {type:String},

    receiver_id: {type:String},

    data: {type:Object},

    Date: {type: Date, default: Date.now() }
});

var dataload = mongoose.model('dataload',dataload);

module.exports = dataload;