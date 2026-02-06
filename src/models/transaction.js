"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      // Transaction belongs to User
      Transaction.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }

  Transaction.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      transaction_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      currency: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "INR",
      },

      payment_method: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM(
          "PENDING",
          "SUCCESS",
          "FAILED",
          "REFUNDED"
        ),
        allowNull: false,
        defaultValue: "PENDING",
      },

      gateway_response: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      initiated_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      completed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Transaction",
      tableName: "transactions",
      timestamps: true,
    }
  );

  return Transaction;
};
