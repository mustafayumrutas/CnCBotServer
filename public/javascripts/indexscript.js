$(document).ready(function () {
   // var socket = io.connect('http://25.17.19.10:2620');
    var socket = io.connect('http://localhost:3000');
    var terminal = $('#terminal').terminal(function (cmd, term) {
        if(cmd)
            $.ajax({
                url: '/index-cmd',
                data: {
                    cmd: cmd
                },
                method: 'post'
            })
    },{
        greetings: 'MHBOT',
        name: 'raspbot',
        height: 400,
        prompt: '--> '
    });
    socket.on('info', function (data) {
        terminal.echo(JSON.parse(data));
    });
    socket.on('data', function (data) {
        let packet =JSON.parse(data);
        let output = `-> ${packet.receiver_id} : ${packet.data.name}  \n ${atob(packet.data.output)}`
        console.log(packet.data.output);
        terminal.echo(output);
    });

});

