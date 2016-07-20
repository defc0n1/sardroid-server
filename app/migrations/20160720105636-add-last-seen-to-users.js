'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
        'Users',
        'lastSeen',
        Sequelize.DATE
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Users', 'lastSeen');
  }
};
