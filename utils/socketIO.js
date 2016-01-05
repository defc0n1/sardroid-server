'use strict';

import chalk from 'chalk';

/*
 * Socket.io related things go here!
 */

let io;

let connections = [];

function createSocketIO(server, app) {
    io = require('socket.io')(server);
 
    io.on('connection', (socket) => {
        console.log(chalk.green(`Socket connected with id ${socket.id}`));
        connections.push(socket);

        socket.on('disconnect', () => {
            console.log(chalk.yellow(`Socket disconnected with id ${socket.id}`));

            var i = connections.indexOf(socket);
            connections.splice(i, 1);
        });

    });
}


export { io, connections, createSocketIO }

