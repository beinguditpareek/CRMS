"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("transactions", {
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
          model: "users", // table name
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      transaction_id: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
      },

      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      currency: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: "INR",
      },

      payment_method: {
        type: Sequelize.STRING(30),
        allowNull: false,
        comment: "CARD | UPI | NETBANKING | WALLET | CASH",
      },

      status: {
        type: Sequelize.ENUM(
          "PENDING",
          "SUCCESS",
          "FAILED",
          "REFUNDED"
        ),
        allowNull: false,
        defaultValue: "PENDING",
      },

      gateway_response: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: "Raw payment gateway response (JSON string)",
      },

      initiated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      completed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("transactions");
    await queryInterface.sequelize.query(
      "DROP TYPE IF EXISTS enum_transactions_status;"
    );
  },
};
