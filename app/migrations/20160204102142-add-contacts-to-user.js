'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
        'Users',
        'contactsList',
        Sequelize.JSONB
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Users', 'contactsList');
  }
};
