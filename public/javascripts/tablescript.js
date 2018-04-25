$(document).ready(function () {
    var socket = io('http://127.0.0.1:3000');
    console.log('selam');
    socket.on('new-connection', function (data) {
        addConnection(JSON.parse(data));
    });
    socket.on('delete-connection', function (data) {
        deleteConnection(JSON.parse(data))
    });
    socket.on('update-connection', function (data) {
        updateConnection(JSON.parse(data));
    });
    let addConnection = function (data) {
        $('#connections tr:last').after(AddList(data));
    };
    let deleteConnection = function (data) {
        $('tr[data-connection-id=' + data.id + ']').empty();
    };
    let updateConnection = function (data) {
        let element = $('tr[data-connection-id=' + data.id + ']').replaceWith(AddList(data));
    };
    let AddList = function (data) {
        return `
             <tr data-connection-id="${data.id}">
                <td>${data.id}</td>
                <td>${data.name}</td>
                <td>${data.ip}</td>
                <td>${data.port}</td>
                <td><a href="/control/${data.id}" class="btn btn-success btn-xs">CONTROL</a></td>
            </tr>`
    };

});