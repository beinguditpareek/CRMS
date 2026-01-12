'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'users',          // table name
      'jwt_token',          // new column
      {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'password' // optional (MySQL)
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
        await queryInterface.removeColumn('users', 'jwt_token');

  }
};
