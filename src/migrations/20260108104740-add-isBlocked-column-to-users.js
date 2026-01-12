'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'users',          // table name
      'isBlocked',          // new column
      {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        after: 'email' // optional (MySQL)
      }
    );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
        await queryInterface.removeColumn('users', 'isBlocked');

  }
};
