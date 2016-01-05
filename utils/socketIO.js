'use strict';

import { log, LOG_TYPES } from './log';

/*
 * Socket.io related things go !
 */

let io;

let connections = [];

function createSocketIO(server, app) {
    io = require('socket.io')(server);
 
    io.on('connection', (socket) => {
        log(`Socket connected with id ${socket.id}`);
        connections.push(socket);

        socket.on('disconnect', () => {
            log(`Socket disconnected with id ${socket.id}`, LOG_TYPES.WARN);

            var i = connections.indexOf(socket);
            connections.splice(i, 1);
        });

    });
}


export { io, connections, createSocketIO }

