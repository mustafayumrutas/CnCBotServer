$(document).ready(function () {
   // var socket = io.connect('http://25.17.19.10:2620');
    var socket = io.connect('http://localhost:8040');
    var terminal = $('#terminal').terminal(function (cmd, term) {
        if(cmd)
            $.ajax({
                url: '/index-cmd/',
                data: {
                    cmd: cmd
                },
                method: 'post'
            })
    },{
        greetings: 'bu bizim botumuz',
        name: 'raspbot',
        height: 400,
        prompt: '--> '
    });

    socket.on('data', function (data) {
       console.log(JSON.stringify(data));
    });
    socket.on('add-new-socket', function (data) {
        console.log(JSON.stringify(data));
    });
    socket.on('update-connection', function (data) {
        updateConnection(JSON.parse(data));
    });
    socket.on('info', function (data) {
        termMain.echo(JSON.parse(data));
    });
    socket.on('data', function (data) {

    });

});

