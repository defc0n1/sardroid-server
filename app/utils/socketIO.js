'use strict';

/*
 * Socket.io related things go !
 */

import { log, LOG_TYPES } from './log';
import { decodeJWT }      from './JWT';
import models             from '../models';

const User = models.User;

const EVENT_TYPES = {
    DISCONNECT      : 'disconnect',
    CONNECTION      : 'connection',
    TOKEN_VALID     : 'token_valid',
    TOKEN_INVALID   : 'token_invalid',
    CONTACT_ONLINE  : 'contact:online',
    CONTACT_OFFLINE : 'contact:offline',
    HEARTBEAT_PONG  : 'heartbeat_pong',
    HEARTBEAT_PING  : 'heartbeat_ping'
};

let io;

let connections = [];

function sendHeartbeat() {
    if (io) {
        setTimeout(sendHeartbeat, 10000);
        io.sockets.emit(EVENT_TYPES.HEARTBEAT_PING, { beat: 1 });
    }
}

function createSocketIO(server, app) {
    io = require('socket.io')(server);
    io.on(EVENT_TYPES.CONNECTION, (socket) => {

        socket.on(EVENT_TYPES.DISCONNECT, () => {
            log(`Socket disconnected with id ${socket.id}`, LOG_TYPES.WARN);

            let i = connections.indexOf(socket);
            connections.splice(i, 1);
        });

        socket.on(EVENT_TYPES.HEARTBEAT_PONG, () => { });

        decodeJWT(socket.handshake.query.token)
            .then( results => {
                log(`Socket connected with id ${socket.id}`);
                socket.emit('token_valid',  {});
                let lastSeen = Date.now();
                results.lastSeen = lastSeen;
                socket.user = results;
                User.update({ lastSeen: lastSeen }, { where: { id: results.id } });
                connections.push(socket);
            })
            .catch(error => {
                log(`Token from ${socket.id} is invalid`, LOG_TYPES.ALERT)
                socket.emit('token_invalid', {});
                socket.disconnect(true);
            })
    });

    setTimeout(sendHeartbeat, 10000);
}

export { io, connections, createSocketIO, EVENT_TYPES }

