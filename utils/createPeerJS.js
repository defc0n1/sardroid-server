'use strict';

import  config  from './config';

let peerJSOptions = config.peerJSOptions;

export default function (server, app) {
    let ExpressPeerServer = require('peer').ExpressPeerServer(server, peerJSOptions);

    ExpressPeerServer.on('connection',  (id) => {
        console.log('Connection from: ' +id);
    });

    ExpressPeerServer.on('disconnect', (id) => {
        console.log('Disconnection from: ' +id);
    });

    app.use('/peerjs', ExpressPeerServer);
}

