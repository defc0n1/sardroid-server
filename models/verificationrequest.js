'use strict';

module.exports = function (sequelize, DataTypes) {
    let VerificationRequest = sequelize.define('Soar_verification_request', {
        phoneNumber             : DataTypes.STRING,
        verificationCode        : DataTypes.STRING,
        expireDate              : DataTypes.DATE,
        beenUsed                : DataTypes.BOOLEAN
    });

    return VerificationRequest;
};

