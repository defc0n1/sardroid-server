import ip    from 'ip';
import http  from 'http';
import https from 'https';
import fs    from 'fs';

import  app    from '../server.js';
import { config, log, createPeerJS, createSocketIO } from '../utils';
import models from '../models';

const port = config.port;
let server = null;

models.sequelize.sync({ force: false }).then(() => {
    if (config.https.inUse === true) {
        const ca = [];
        let cert = [];
        let line;
        let caFile = fs.readFileSync(config.https.ca).toString();
        caFile = caFile.split('\n');

        for (let i = 0, len = caFile.length; i < len; i++) {
            line = caFile[i];
            if (!(line.length !== 0)) {
                continue;
            }
            cert.push(line);
            if (line.match(/-END CERTIFICATE-/)) {
                ca.push(cert.join('\n'));
                cert = [];
            }
        }

        const credentials = {
            key:  fs.readFileSync(config.https.privateKey),
            cert: fs.readFileSync(config.https.cert),
            ca,
        };

        server = https.createServer(credentials, app).listen(port, () => {
            log(`HTTPS Sardroid server running on: https://${ip.address()}:${port}`);
        });
    } else {
        server = http.createServer(app).listen(port, () => {
            log(`Sardroid server running on: http://${ip.address()}:${port}`);
        });
    }
    createPeerJS(server, app);
    createSocketIO(server);
});

