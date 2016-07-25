'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
   return queryInterface.addColumn(
       'Calls',
       'callerId',
       {
           type: Sequelize.INTEGER,
           allowNull: false
       }
   ).then(function () {
       return queryInterface.addColumn(
           'Calls',
           'recipientId',
           {
               type: Sequelize.INTEGER,
               allowNull: false
           }
       );
   });
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.removeColumn('Calls', 'callerId')
    .then(function () {
        return queryInterface.removeColumn('Calls', 'recipientId')
    })
  }
};
