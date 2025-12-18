'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Plans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },

      features: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      base_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      offer_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },

      student_limit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      team_limit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },

      validity: {
        // validity in DAYS
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Validity in days',
      },

      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Plans');
  },
};
