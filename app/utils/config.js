'use strict';

export default {
    port       : process.env.PORT || 9000,
    jwt_secret : process.env.JWT_SECRET || 'supersalainenjwt',
    https: {
        inUse      : (process.env.USE_HTTPS ==  'true'),
        privateKey : process.env.PRIVATE_KEY || '/etc/letsencrypt/live/mattij.com/privkey.pem',
        cert       : process.env.CERT        || '/etc/letsencrypt/live/mattij.com/cert.pem',
        ca         : process.env.CA          || '/etc/letsencrypt/live/mattij.com/fullchain.pem'
    },
    peerJSOptions: {
        debug           : true,
        port            : process.env.PORT || 9000,
        allow_discovery : false,
        proxied         : (process.env.IS_PROXIED == 'true')
    },
    twilio: {
            accountSid   : process.env.TWILIO_SID    || '',
            authToken    : process.env.TWILIO_TOKEN  || '',
            twilioNumber : process.env.TWILIO_NUMBER || ''
    },
    rollbar: {
            postToken    : process.env.ROLLBAR_TOKEN    || '',
    }
}

