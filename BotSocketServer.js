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
    const SERVER_ID = new mongoose.Types.ObjectId;
    var io = require('socket.io')(4000);
    io.on('connection', function(socket){
        var ip=socket.request.connection.remoteAddress;
        var port=socket.request.connection.remotePort;
        let connection = new connections({
            _id:new mongoose.Types.ObjectId,
            socket:socket.id,
            ip:ip,
            port:port,
            name:''
            });
        console.log(connection._id);
        connection.save().then(function () {
            send(new Packet(SERVER_ID,connection._id,{ack : ''}));
        });
        addNewConnection(connection);
        console.log(connection._id+': Connection has been received');
        var data=new dataload ({
            _id:new mongoose.Types.ObjectId,
            sender_id:SERVER_ID,
            receiver_id:connection._id,
            data:{ack:' '}
        });
        data.save();
        socket.on('data', onData.bind({},connection));
        socket.on('disconnect', onEnd.bind({}, connection));
    });
    /*
    Processes received data on socket
     */
    let onData= function(connection,cipher){
        let data= crypto.decrypt(cipher);

        log(`-> ${connection._id} : Packet has been received`);

        if(!parser.isValid(data)){
            log(`-> ${connection._id} : Received packet is invalid`);
            return;
        }
        let parsedPacket = parser.decode(data);
        if(parsedPacket.receiver_id === 'BROADCAST'){
            broadcast(parsedPacket);
        }else if(parsedPacket.receiver_id == SERVER_ID){
            processCmd(parsedPacket,connection);
        }else{
            send(parsedPacket);
        }
    };

    /*
    Handles data on end and error
     */

    let onEnd = function(connection,data){
        log(`-> ${connection._id} : Connection has been lost`);
        connection.findOneAndDelete({_id:connection._id},function (err,res) {
            if(err) throw err;
            console.log('Silindi'+ JSON.stringify(connection));
        });
        removeConnection(connection);
    };

    /*
    Send data over socket
     */

    let send = function(packet){
       getConnectionById(packet.receiver_id,function (connection) {
           console.log(connection._id+": Sending data");
           console.log(JSON.stringify(connection));
           let parsedPacket = parser.encode(packet);
           let cipher = crypto.encrypt(parsedPacket);
           io.to(connection.socket).emit('data',cipher);
       });
    };

    /*
    Brooadcast data over socket
     */
    let broadcast = function(packet){
            connections.find({},{'name':0}).then(function (connection) {
                connection.forEach((connection) => {
                    console.log(connection.id+": Sending broadcast");
                    packet.receiver_id = connection._id;
                    let parsedPacket = parser.encode(packet);
                    let cipher = crypto.encrypt(parsedPacket);
                    io.to(connection.socket).emit('data',cipher);
                })
            });
    };

    /*
    Get connection by id
     */
    let getConnectionById = function(id,callback){
        connections.findOne({_id:id},function (err,result) {
            if(err) throw err;
            else
            {callback(result);}

        });
    };

    /*
    Get all connections on server
     */
    let getAllConnections = function(callback){
        connections.find({},function (err,result) {
            if(err) throw err;
            else
            {callback(result);}

        });
    };

    /*
    Process command
     */
    let processCmd = function(packet,connection){
        if(packet.data.hasOwnProperty('name')){
            connection.name = packet.data['name'];
            updateConnection(connection);
        }
        pushDataToSocket(packet);
    };

    var sendCmd = function(receiverId,cmd){
        send(new Packet(SERVER_ID,receiverId,{cmd: cmd}))
    };
    var broadcastCmd = function(cmd){
        broadcast(new Packet(SERVER_ID,null, {cmd: cmd}))
    };
    let log = function(message){
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
        websocket.send('update-connection',connection);
    };
    let pushDataToSocket = function(data){
        websocket.send('data',data);
    };


    return {
        getConnectionById: getConnectionById,
        getAllConnections: getAllConnections,
        sendCmd: sendCmd,
        broadcastCmd: broadcastCmd
    }
};









