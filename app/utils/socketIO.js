'use strict';

/*
 * Socket.io related things go !
 */

import { log, LOG_TYPES } from './log';
import decodeJWT          from './decodeJWT';

const EVENT_TYPES = {
    DISCONNECT      : 'disconnect',
    CONNECTION      : 'connection',
    TOKEN_VALID     : 'token_valid',
    TOKEN_INVALID   : 'token_invalid',
    CONTACT_ONLINE  : 'contact:online',
    CONTACT_OFFLINE : 'contact:offline'
};

let io;

let connections = [];

function createSocketIO(server, app) {
    io = require('socket.io')(server);
    io.set('origins', '*');
    io.on(EVENT_TYPES.CONNECTION, (socket) => {

        socket.on(EVENT_TYPES.DISCONNECT, () => {
            log(`Socket disconnected with id ${socket.id}`, LOG_TYPES.WARN);

            var i = connections.indexOf(socket);
            connections.splice(i, 1);
        });

        decodeJWT(socket.handshake.query.token)
            .then( results => {
                log(`Socket connected with id ${socket.id}`);
                socket.emit('token_valid',  {});
                socket.user = results;
                connections.push(socket);

            })
            .catch(error => {
                log(`Token from ${socket.id} is invalid`, LOG_TYPES.ALERT)
                socket.emit('token_invalid', {});
                socket.disconnect(true);
            })
    });
}


export { io, connections, createSocketIO, EVENT_TYPES }

