module.exports = function (http) {
    var io = require('socket.io').listen(http);
    io.on('connection',function (data) {
        console.log('baglandi');
    });
    var emitter=function (sendmessage) {
        var data=JSON.stringify(sendmessage.data);

        io.sockets.emit(sendmessage.type,data);
    };
    var sendmsg=function (type,msg) {
        emitter({type:type,data:msg});
    };
    var listener=function (type,msg) {
        io.sockets.on(type,msg);

    };
    return{
        sendmsg:sendmsg,
        listener:listener

    }

};