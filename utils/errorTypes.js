'use strict';

/*
 * Error types for the authentication route
 */
const AUTH = {
    VERIFICATION   : {
        USER_EXISTS    : 'user_exists',
        NUMBER_MISSING : 'number_missing'
    },
    REGISTER       : {
        NO_VERIFICATION      : 'no_verification',
        VERIFICATION_EXPIRED : 'verification_expired',
        VERIFICATION_USED    : 'verification_used',
        REGISTER_FAILED      : 'register_failed',
    },
    LOGIN          : {
        USER_NOT_FOUND : 'user_not_found',
        BCRYPT_ERROR   : 'bcrypt_error',
        WRONG_PASSWORD : 'wrong_password'
    }
}

/*
 * Misc. generic error types
 */
const GENERIC = {
    MISSING_PARAMS: 'missing_params'
}

export { AUTH, GENERIC }

