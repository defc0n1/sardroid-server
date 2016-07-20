'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    phoneNumber: {type: DataTypes.STRING, unique: true},
    password: DataTypes.STRING(1024),
    token: DataTypes.STRING(2048),
    contactsList: DataTypes.JSONB,
    lastSeen: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return User;
};
