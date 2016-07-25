'use strict';
module.exports = function(sequelize, DataTypes) {
  var UserCall = sequelize.define('UserCall', {
    type:  {
        type: DataTypes.ENUM,
        values: ['caller', 'recipient']
    }
  }, {
    classMethods: {
      associate: function(models) {

      }
    }
  });

  return UserCall;
};
