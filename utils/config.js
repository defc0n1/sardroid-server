'use strict';

export default {
    port: process.ENV_PORT || 9000,
    https: {
        inUse:       new Boolean(process.env.USE_HTTPS),
        privateKey:  '',
        cert:        '',
        ca:          ''
    }
}

