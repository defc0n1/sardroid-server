'use strict';

import express from 'express';
import ip      from 'ip';

import { config }  from './utils/';

console.log(config);

let app = express();
let port = process.ENV_PORT || 9000;

let server = app.listen(port);

let options = {
    debug: true,
    port: 9000,
    allow_discovery: true
};

let ExpressPeerServer = require('peer').ExpressPeerServer(server, options);

ExpressPeerServer.on('connection',  (id) => {
    console.log('Connection from: ' +id);
});

ExpressPeerServer.on('disconnect', (id) => {
    console.log('Disconnection from: ' +id);
});

app.get('/', (req, res, next) => { res.send('Hello world!'); });

app.use('/peerjs', ExpressPeerServer);

console.log(`Sardroid server running on: ${ip.address()}:${port}`);

export default app;

