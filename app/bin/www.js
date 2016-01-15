#!/usr/bin/env node

import ip    from 'ip';
import http  from 'http';
import https from 'https';
import fs    from 'fs';

import   app    from '../server.js';
import { config, log, createPeerJS, createSocketIO } from '../utils';
import models from '../models';

let port = config.port;
let peerJSOptions = config.peerJSOptions;
let server = null;

models.sequelize.sync({force: false}).then(() => {
    if (config.https.inUse == true) {
        var ca = [];
        var cert = [];
        var line;
        var caFile = fs.readFileSync(config.https.ca).toString();
        caFile = caFile.split("\n");

        for (var i = 0, len = caFile.length; i < len; i++) {
          line = caFile[i];
          if (!(line.length !== 0)) {
            continue;
          }
          cert.push(line);
          if (line.match(/-END CERTIFICATE-/)) {
            ca.push(cert.join("\n"));
            cert = [];
          }
        }

        var credentials = {
          key:  fs.readFileSync(config.https.privateKey),
          cert: fs.readFileSync(config.https.cert),
          ca:   ca
        };

        server = https.createServer(credentials, app).listen(port, () => {
            log(`HTTPS Sardroid server running on: https://${ip.address()}:${port}`);
        });

    } else {
        server = http.createServer(app).listen(port, () => {
            log(`Sardroid server running on: http://${ip.address()}:${port}`);
        })
    }
    createPeerJS(server, app);
    createSocketIO(server, app);
});

