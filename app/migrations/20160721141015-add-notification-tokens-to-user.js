'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
        'Users',
        'notificationTokens',
        Sequelize.ARRAY(Sequelize.STRING)
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Users', 'notificationTokens');
  }
};
