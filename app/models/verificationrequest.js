'use strict';
module.exports = function(sequelize, DataTypes) {
  var VerificationRequest = sequelize.define('VerificationRequest', {
    phoneNumber: DataTypes.STRING,
    verificationCode: DataTypes.STRING,
    expireDate: DataTypes.DATE,
    beenUsed: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return VerificationRequest;
};