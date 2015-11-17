'use strict';

import express from 'express';
import ip      from 'ip';

let app = express();
let port = process.ENV_PORT || 9000;
let server = app.listen(port);

app.get('/', (req, res, next) => { res.send('Hello world!'); });


server.on('connection',  (id) => {
    console.log('Connection from: ' +id);
});

server.on('disconnect', (id) => {
    console.log('Disconnection from: ' +id);
});

let options = {
    debug: true,
    port: 9000,
    allow_discovery: true
};

var ExpressPeerServer = require('peer').ExpressPeerServer(server, options);

app.use('/peerjs', ExpressPeerServer);

console.log(`Sardroid server running on: ${ip.address()}:${port}`);
