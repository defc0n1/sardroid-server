'use strict';

/*
 * Error types for the authentication route
 */
const AUTH = {
    VERIFICATION   : {
        USER_EXISTS    : 'user_exists',
        NUMBER_MISSING : 'number_missing',
        TYPE_MISSING   : 'type_missing',
        USER_NOT_FOUND : 'user_not_found',
        INVALID_TYPE   : 'invalid_type'
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
    },
    RESET_PASSWORD       : {
        NO_VERIFICATION      : 'no_verification',
        USER_NOT_FOUND       : 'user_not_found',
        VERIFICATION_EXPIRED : 'verification_expired',
        VERIFICATION_USED    : 'verification_used',
        RESET_FAILED         : 'register_failed',
    },
    LOGOUT          : {
        USER_NOT_FOUND : 'user_not_found'
    }
}

/*
 * Misc. generic error types
 */
const GENERIC = {
    MISSING_PARAMS    : 'missing_params',
    TOKEN_MISSING     : 'token_missing',
    UNSPECIFIED_ERROR : 'unspecified_error'
}

export { AUTH, GENERIC }

