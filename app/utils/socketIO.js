'use strict';

/*
 * Socket.io related things go here!
 */

import { log, LOG_TYPES } from './log';
import { decodeJWT }      from './JWT';

const EVENT_TYPES = {
    DISCONNECT      : 'disconnect',
    CONNECTION      : 'connection',
    TOKEN_VALID     : 'token_valid',
    TOKEN_INVALID   : 'token_invalid',
    CONTACT_ONLINE  : 'contact:online',
    CONTACT_OFFLINE : 'contact:offline',
};

let io;

const connections = [];

function createSocketIO(server) {
    io = require('socket.io')(server);

    io.on(EVENT_TYPES.CONNECTION, (socket) => {
        socket.on(EVENT_TYPES.DISCONNECT, () => {
            log(`Socket disconnected with id ${socket.id}`, LOG_TYPES.WARN);

            const i = connections.indexOf(socket);
            connections.splice(i, 1);
        });

        decodeJWT(socket.handshake.query.token)
            .then(results => {
                log(`Socket connected with id ${socket.id}`);
                socket.emit('token_valid',  {});
                socket.user = results;
                connections.push(socket);
            })
            .catch(() => {
                log(`Token from ${socket.id} is invalid`, LOG_TYPES.ALERT);
                socket.emit('token_invalid', {});
                socket.disconnect(true);
            });
    });
}

export { io, connections, createSocketIO, EVENT_TYPES };

