$(document).ready(() => {
    var socket = io.connect('http://localhost:3000');
    let send = $('#terminal').data('connection-id');
    let terminal = $('#terminal').terminal(function (cmd, term) {
        $.ajax({
            url: '/command/'+send+'/cmd/',
            data: {
                cmd: cmd
            },
            method: 'post'
        })
    }, {
        greetings: 'MHBOT',
        name: 'MHBOT',
        height: 600,
        prompt: '--> '
    });
    socket.on('delete-connection', function(data){
        let packet =JSON.parse(data);
        if(packet.id === senderId){
            terminal.echo('Baglanti Koptu (' +send +')');
            terminal.pause();
        }
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
