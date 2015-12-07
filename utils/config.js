'use strict';

export default {
    port: process.ENV_PORT || 9000,
    https: {
        inUse:       new Boolean(process.env.USE_HTTPS || false),
        privateKey:  process.env.PRIVATE_KEY || '/etc/letsencrypt/live/mattij.com/privkey.pem',
        cert:        process.env.CERT        || '/etc/letsencrypt/live/mattij.com/cert.pem',
        ca:          process.env.CA          || '/etc/letsencrypt/live/mattij.com/fullchain.pem'
    },
    peerJSOptions: {
        debug: true,
        port: process.ENV_PORT || 9000,
        allow_discovery: true
    }
}

