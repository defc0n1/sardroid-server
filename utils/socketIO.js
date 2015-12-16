'use strict';

/*
 * Socket.io related things go here!
 */

let io;

let connections = [];

function createSocketIO(server, app) {
    io = require('socket.io')(server);
    
    io.on('connection', (socket) => {
        console.log(`Socket connected with id ${socket.id}`);
        connections.push(socket);

        socket.on('disconnect', () => {
            console.log(`Socket disconnected with id ${socket.id}`);

            var i = connections.indexOf(socket);
            connections.splice(i, 1);
        });

        socket.emit('sockettest', {'hello': 'world'});
    });
}


export { io, connections, createSocketIO }

