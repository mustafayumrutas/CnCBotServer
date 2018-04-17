var crypt = require('./crypt');
var port =4000;
var dataload = require('./models/dataload');
var connections = require('./models/connections');
var mongoose = require('mongoose');



module.exports=function(WebSocketServer){
    
    var io =require('socket.io')(port);
    
    io.on('connection',function (socket) {
        var connections= new connections({
            _id: new mongoose.Types.ObjectId,
            socket:socket,
            ip:socket.request.connection.remoteAddress,
            port:socket.request.connection.remotePort,
            name:" "
        });
        try{connections.save()}
        catch(err){console.log('Veritabanına kaydederken bir sıkıntı çıktı')};
        addSocketlist(connections);
        socket.on('data',Getdata);
        socket.on('disconnect',SocketDisconnect)
    });

    var Getdata=function (cipher) {
        var cipher=crypt.decrypt(cipher);
        WebSocketServer.sendmsg('data',Json.stringify(data));
    }
    var SocketDisconnect=function () {
        console.log('socket ayrıldı');

    }
    var addSocketlist=function (connections) {
        WebSocketServer.sendmsg('add-new-socket',connections);
    }
    var deneme =function () {
        WebSocketServer.sendmsg('add-new-socket','selam');
    }
    return{
        deneme:deneme
    }
};