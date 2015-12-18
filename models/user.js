'use strict';

module.exports = function (sequelize, DataTypes) {
    let User = sequelize.define('Soar_user', {
        phoneNumber : DataTypes.STRING,
        password    : DataTypes.STRING
    });

    return User;
};

