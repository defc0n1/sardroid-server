'use strict';

import { log, LOG_TYPES } from './log';

import config from './config';

import { io } from './socketIO';

let peerJSOptions = config.peerJSOptions;

export default function (server, app) {
    let ExpressPeerServer = require('peer').ExpressPeerServer(server, peerJSOptions);

    ExpressPeerServer.on('connection',  (id) => {
        log('PeerJS Connection from: ' + id);

        //TODO: Proper way of doing online contacts, not this!
        io.emit('contact:online', { peerJSId: id });
    });

    ExpressPeerServer.on('disconnect', (id) => {
        log('PeerJS Disconnection from: ' + id, LOG_TYPES.WARN);
    });

    app.use('/peerjs', ExpressPeerServer);
}

