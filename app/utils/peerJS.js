'use strict';

import { log, LOG_TYPES } from './log';

import config from './config';

import { io, EVENT_TYPES } from './socketIO';

const peerJSConnections = [];
const peerJSOptions     = config.peerJSOptions;

function createPeerJS(server, app) {
    const expressPeerServer = require('peer').ExpressPeerServer(server, peerJSOptions);

    expressPeerServer.on('connection',  (id) => {
        log(`PeerJS connection from: ${id}`);

        peerJSConnections.push(id);

        io.emit(EVENT_TYPES.CONTACT_ONLINE, { peerJSId: id });
    });

    expressPeerServer.on('disconnect', (id) => {
        log(`PeerJS disconnection from: ${id}`, LOG_TYPES.WARN);

        const i = peerJSConnections.indexOf(id);
        peerJSConnections.splice(i, 1);

        io.emit(EVENT_TYPES.CONTACT_OFFLINE, { peerJSId: id });
    });

    app.use('/peerjs', expressPeerServer);
}

export { createPeerJS, peerJSConnections };

