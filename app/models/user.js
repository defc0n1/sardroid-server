'use strict';
var _ = require('lodash');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    phoneNumber: {type: DataTypes.STRING, unique: true},
    password: DataTypes.STRING(1024),
    token: DataTypes.STRING(2048),
    contactsList: DataTypes.JSONB,
    lastSeen: DataTypes.DATE,
    notificationTokens: DataTypes.ARRAY(DataTypes.STRING)
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    instanceMethods: {
        getContactsListNumbers: function () {
            return _.map(this.contactsList, 'phoneNumber');
        }
    }
  });
  return User;
};
