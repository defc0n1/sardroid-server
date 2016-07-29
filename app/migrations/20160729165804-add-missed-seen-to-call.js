'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
        'Calls',
        'missedCallBeenSeen',
        {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    );

  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Calls', 'missedCallBeenSeen');
  }
};
