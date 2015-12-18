'use strict';

module.exports = function (sequelize, DataTypes) {
    let User = sequelize.define('Soar_user', {
        phoneNumber : { type: DataTypes.STRING, unique: true},
        password    : DataTypes.STRING
    });

    return User;
};

