'use strict';

import chalk from 'chalk';

import config from './config';

import { io } from './socketIO';

let peerJSOptions = config.peerJSOptions;

export default function (server, app) {
    let ExpressPeerServer = require('peer').ExpressPeerServer(server, peerJSOptions);

    ExpressPeerServer.on('connection',  (id) => {
        console.log(chalk.green('PeerJS Connection from: ' + id));

        //TODO: Proper way of doing online contacts, not this!
        io.emit('contact:online', { peerJSId: id });
    });

    ExpressPeerServer.on('disconnect', (id) => {
        console.log(chalk.yellow('PeerJS Disconnection from: ' + id));
    });

    app.use('/peerjs', ExpressPeerServer);
}

