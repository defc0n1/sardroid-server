'use strict';

var express = require('express');
var ip      = require('ip');

var app = express();
var port = process.ENV_PORT || 9000;
var server = app.listen(port);

app.get('/', function(req, res, next) { res.send('Hello world!'); });


server.on('connection', function (id) {
    console.log('Connection from: ' +id);
});

server.on('disconnect', function(id) {
    console.log('Disconnection from: ' +id);
});

var options = {
    debug: true,
    port: 9000,
    allow_discovery: true
};

var ExpressPeerServer = require('peer').ExpressPeerServer(server, options);

app.use('/peerjs', ExpressPeerServer);

console.log('Sardroid server running on: ' + ip.address() + ':' + port);
