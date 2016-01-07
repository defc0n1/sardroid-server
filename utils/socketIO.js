'use strict';

import { log, LOG_TYPES } from './log';
import decodeJWT          from './decodeJWT';
/*
 * Socket.io related things go !
 */

let io;

let connections = [];

function createSocketIO(server, app) {
    io = require('socket.io')(server);

    io.on('connection', (socket) => {

        socket.on('disconnect', () => {
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


export { io, connections, createSocketIO }

