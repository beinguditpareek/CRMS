'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('User_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
      },

      contact: {
        type: Sequelize.STRING(15),
        allowNull: true,
      },

      designation: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      school_name: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },

      school_address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      description: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      school_logo: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      school_website_url: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      school_assets: {
        type: Sequelize.STRING,
        allowNull: true,
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

    // 🔹 Helpful indexes
    await queryInterface.addIndex('User_details', ['user_id']);
    await queryInterface.addIndex('User_details', ['email']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('User_details');
  },
};
