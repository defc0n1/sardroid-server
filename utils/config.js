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
        allow_discovery : true,
        proxied         : (process.env.IS_PROXIED == 'true')
    },
    db: {
            host     : process.env.POSTGRES_HOST    || 'localhost',
            user     : process.env.POSTGRES_USER    || 'postgres',
            password : process.env.POSTGRES_PW      || 'supersalainensalasana',
            database : process.env.POSTGRES_DB      || 'soar',
            charset  : process.env.POSTGRES_CHARSET || 'utf8',
            dialect  : 'postgres'
    }
}

