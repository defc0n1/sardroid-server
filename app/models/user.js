'use strict';
import _ from 'lodash';
import { sendNotification } from '../utils/pushNotifications';

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    phoneNumber: { type: DataTypes.STRING, unique: true },
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
        },
        notifyAbout: function (message) {
            return sendNotification(message, this.notificationTokens);
        }
    }
  });
  return User;
};
