var socket_io = require('socket.io');
var io = socket_io(2620);
var socketApi = {};
var crypto = require('./crypt');

socketApi.io = io;

io.on('connection', function(socket){
    console.log('A user connected');
    socket.on('cmd',function () {
    });
    socket.on('terminal',function (data) {
        console.log(data);
    });
    var parsedPacket='selam sana ey yolcu';
    var cipher = crypto.encrypt(parsedPacket);
    console.log(cipher);
    io.emit('data',cipher);
    socket.on('data',function (err,result) {
        if(err) throw err;
        var cipher=crypto.decrypt(result);
        console.log(cipher);

    })


});

socketApi.sendNotification = function() {
    io.sockets.emit('hello', {msg: 'Hello World!'});
}

module.exports = socketApi;