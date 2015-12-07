'use strict';

export default {
    port: process.ENV_PORT || 9000,
    https: {
        inUse:       new Boolean(process.env.USE_HTTPS || false),
        privateKey:  '/etc/letsencrypt/live/mattij.com/privkey.pem',
        cert:        '/etc/letsencrypt/live/mattij.com/cert.pem',
        ca:          '/etc/letsencrypt/live/mattij.com/fullchain.pem'
    },
    peerJSOptions: {
        debug: true,
        port: 9000,
        allow_discovery: true
    }
}

