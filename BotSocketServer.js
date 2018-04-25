var uuid= require('uuid-v4');
var Packet = require('./models/packet');
var parser =require('./parser');
var crypto = require('./crypto');
var mongoose =require('mongoose');



mongoose.connect('mongodb://localhost/Mesajlasma', function (err) {

    if (err) throw err;

    console.log('www dosyasından veritabanına bağlanıldı');
});

module.exports=  function(websocket){
    var connections=require('./models/connections');
    var dataload=require('./models/dataload');
    const SERVER_ID = uuid();
    var io = require('socket.io')(4000);
    io.on('connection', function(socket){
        var ip=socket.request.connection.remoteAddress;
        var port=socket.request.connection.remotePort;
        let connection = new connections({
            _id:new mongoose.Types.ObjectId,
            id:uuid(),
            socket:socket.id,
            ip:ip,
            port:port,
            name:'',
            online:true,

            });
        console.log(connection.id);
        connection.save().then(function () {
            send(new Packet(SERVER_ID,connection.id,{ack : ''}));
        });
        addNewConnection(connection);
        sendinfo(`-> ${connection.id} : Baglanti Kuruldu`);
        var data=new dataload ({
            _id:new mongoose.Types.ObjectId,
            sender_id:SERVER_ID,
            receiver_id:connection.id,
            data:{ack:' '}
        });
        data.save();
        socket.on('data', onData.bind({},connection));
        socket.on('disconnect', onEnd.bind({},connection));
    });

    let onData= function(connection,cipher){
        let data= crypto.decrypt(cipher);

        sendinfo(`-> ${connection.id} : Veri Alindi`);

        if(!parser.isValid(data)){
            sendinfo(`-> ${connection.id} : Veri Yanlis`);
            return;
        }
        let parsedPacket = parser.decode(data);
        console.log(parsedPacket);
        if(parsedPacket.receiver_id == SERVER_ID){
            processCmd(parsedPacket,connection);
        }else{
            send(parsedPacket);
        }
    };

    let onEnd = function(connection,data){
        sendinfo(`-> ${connection.id} : baglanti koptu`);
        connection.online=false;
        connection.save(function (err,res) {
            if(err) throw err;
            console.log('Silindi'+ JSON.stringify(connection));
        });
        removeConnection(connection);
    };



    let send = function(packet){
       getConnectionById(packet.receiver_id,function (connection) {
           sendinfo(`-> ${connection.id} : Veri Gönderiliyor`);
           console.log(JSON.stringify(connection));
           dataloadpush(packet);
           let parsedPacket = parser.encode(packet);
           let cipher = crypto.encrypt(parsedPacket);
           io.to(connection.socket).emit('data',cipher);
       });
    };

    let broadcast = function(packet){
            getAllConnections(function (connection) {
                connection.forEach((connection) => {
                    sendinfo(`-> ${connection.id} : Broadcast Yapılıyor`);
                    packet.receiver_id = connection.id;
                    dataloadpush(packet);
                    let parsedPacket = parser.encode(packet);
                    let cipher = crypto.encrypt(parsedPacket);
                    io.to(connection.socket).emit('data',cipher);
                })
            });
    };



    let processCmd = function(packet,connection){
        if(packet.data.hasOwnProperty('name')){
            connection.name = packet.data['name'];
            updateConnection(connection);
        }
        pushDataToSocket(packet);
        packet.data.output=atob(packet.data.output);
        dataloadpush(packet);
    };

    var sendCmd = function(receiverId,cmd){
        send(new Packet(SERVER_ID,receiverId,{cmd: cmd}))
    };
    var broadcastCmd = function(cmd){
        broadcast(new Packet(SERVER_ID,null, {cmd: cmd}))
    };
    let sendinfo = function(message){
        console.log(message);
        websocket.send('info',message)
    };
    let addNewConnection = function(connection){
        websocket.send('new-connection',connection);
    };
    let removeConnection = function(connection){
        websocket.send('delete-connection',connection);
    };
    let updateConnection = function(connection){
        connection.save();
        websocket.send('update-connection',connection);
    };
    let pushDataToSocket = function(data){
        websocket.send('data',data);
    };
    let dataloadpush =function (packet) {
        let push=new dataload({
            _id:new mongoose.Types.ObjectId,
            sender_id:packet.sender_id,
            receiver_id:packet.receiver_id,
            data:packet.data
        });
        push.save();
    };
    let GetAllLogs=function (callback) {
        dataload.find({},function (err,result) {
            if(err) throw err;
            callback(result);
        });
    };
    let GetUserLogs=function (id,callback) {
        dataload.find({ $or: [ { sender_id:id },{receiver_id:id} ] },function (err,result){
            if(err) throw err;
            callback(result);
        });
    };
    let getConnectionById = function(id,callback){
        connections.findOne({id:id},function (err,result) {
            console.log(id);
            if(err) throw err;
            console.log(JSON.stringify(result));
            callback(result);
        });
    };

    let getAllConnections = function(callback){
        connections.find({online:true},function (err,result) {
            if(err) throw err;
            else
            {callback(result);}

        });
    };


    return {
        getConnectionById: getConnectionById,
        getAllConnections: getAllConnections,
        sendCmd: sendCmd,
        broadcastCmd: broadcastCmd,
        GetAllLogs:GetAllLogs,
        GetUserLogs:GetUserLogs
    }
};









