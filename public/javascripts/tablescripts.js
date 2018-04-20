$(document).ready(function () {
    let socket = io('http://127.0.0.1:4000');

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
        $('#connections tr:last').after(getConnectionHtml(data));
        changeNumberOfConnections(1);
    };
    let deleteConnection = function (data) {
        $('tr[data-connection-id=' + data._id + ']').empty();
        changeNumberOfConnections(-1);
    };
    let updateConnection = function (data) {
        let element = $('tr[data-connection-id=' + data._id + ']').replaceWith(getConnectionHtml(data));
    };
    let getConnectionHtml = function (data) {
        return `
             <tr data-connection-id="${data._id}">
                <td>${data._id}</td>
                <td>${data.name}</td>
                <td>${data.ip}</td>
                <td>${data.port}</td>
                <td><a href="/control/${data._id}" class="btn btn-success btn-xs">CONTROL</a></td>
            </tr>`
    };

});