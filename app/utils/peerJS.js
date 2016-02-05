'use strict';

import { log, LOG_TYPES } from './log';

import config from './config';

import { io, EVENT_TYPES } from './socketIO';

let peerJSConnections = [];
let peerJSOptions     = config.peerJSOptions;

function createPeerJS (server, app) {
    let ExpressPeerServer = require('peer').ExpressPeerServer(server, peerJSOptions);

    ExpressPeerServer.on('connection',  (id) => {
        log('PeerJS Connection from: ' + id);

        peerJSConnections.push(id);

        //TODO: Proper way of doing online contacts, not this!
        io.emit(EVENT_TYPES.CONTACT_ONLINE, { peerJSId: id });
    });

    ExpressPeerServer.on('disconnect', (id) => {
        log('PeerJS Disconnection from: ' + id, LOG_TYPES.WARN);

        let i = peerJSConnections.indexOf(id);
        peerJSConnections.splice(i, 1);

        io.emit(EVENT_TYPES.CONTACT_OFFLINE, { peerJSId: id });
    });

    app.use('/peerjs', ExpressPeerServer);
}

export { createPeerJS, peerJSConnections }

