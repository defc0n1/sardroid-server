'use strict';

import _ from 'lodash';

import { log, LOG_TYPES } from './log';
import config from './config';
import { io, EVENT_TYPES } from './socketIO';

let peerJSConnections = [];
let peerJSOptions     = config.peerJSOptions;

function getPeerJSData(peerJSId) {
    const arr = peerJSId.split('PEER');
    const data = { peerJSId };

    if (arr[0]) {
        data.phoneNumber = arr[0];
    }

    return data;
}

function createPeerJS (server, app) {
    let ExpressPeerServer = require('peer').ExpressPeerServer(server, peerJSOptions);

    ExpressPeerServer.on('connection',  (id) => {
        log('PeerJS Connection from: ' + id);
        const data = getPeerJSData(id);

        peerJSConnections.push(data);

        //TODO: Proper way of doing online contacts, not this!
        io.emit(EVENT_TYPES.CONTACT_ONLINE, data);
    });

    ExpressPeerServer.on('disconnect', (id) => {
        log('PeerJS Disconnection from: ' + id, LOG_TYPES.WARN);

        const removed = _.remove(peerJSConnections, connection => {
            return connection.peerJSId === id;
        });

        io.emit(EVENT_TYPES.CONTACT_OFFLINE, removed );
    });

    app.use('/peerjs', ExpressPeerServer);
}

export { createPeerJS, peerJSConnections }

