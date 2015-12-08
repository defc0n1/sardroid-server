'use strict';

export default {
    port: process.env.PORT || 9000,
    https: {
        inUse:       (process.env.USE_HTTPS ==  'true'),
        privateKey:  process.env.PRIVATE_KEY || '/etc/letsencrypt/live/mattij.com/privkey.pem',
        cert:        process.env.CERT        || '/etc/letsencrypt/live/mattij.com/cert.pem',
        ca:          process.env.CA          || '/etc/letsencrypt/live/mattij.com/fullchain.pem'
    },
    peerJSOptions: {
        debug:           true,
        port:            process.env.PORT || 9000,
        allow_discovery: true,
        proxied:         (process.env.IS_PROXIED == 'true')
    }
}

