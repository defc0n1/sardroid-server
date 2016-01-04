'use strict';

module.exports = function (sequelize, DataTypes) {
    let User = sequelize.define('Soar_user', {
        phoneNumber : { type: DataTypes.STRING, unique: true},
        password    : DataTypes.STRING,
        token       : DataTypes.STRING(1024)
    });

    return User;
};

