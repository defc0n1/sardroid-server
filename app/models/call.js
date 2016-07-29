'use strict';
module.exports = function(sequelize, DataTypes) {
  var Call = sequelize.define('Call', {
    startedAt: DataTypes.DATE,
    endedAt: DataTypes.DATE,
    callerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    recipientId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    finalStatus:  {
        type: DataTypes.ENUM,
        values: ['not_answered', 'succeeded', 'error']
    },
    missedCallBeenSeen: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Call.belongsTo(models.User, { as: 'recipient', foreignKey: 'recipientId'});
        Call.belongsTo(models.User, { as: 'caller', foreignKey: 'callerId'});
      }
    }
  });


  return Call;
};
