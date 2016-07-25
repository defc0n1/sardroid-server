'use strict';
module.exports = function(sequelize, DataTypes) {
  var Call = sequelize.define('Call', {
    startedAt: DataTypes.DATE,
    endedAt: DataTypes.DATE,
    finalStatus:  {
        type: DataTypes.ENUM,
        values: ['not_answered', 'succeeded', 'error']
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Call.belongsToMany(models.User, { through: models.UserCall });
      }
    }
  });


  return Call;
};
