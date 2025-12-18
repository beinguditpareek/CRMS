'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Plan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Plan.init({
  name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },

      features: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      base_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      offer_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },

      student_limit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      team_limit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },

      validity: {
        // validity in DAYS
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Validity in days',
      },

      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },  }, {
    sequelize,
    modelName: 'Plan',
  });
  return Plan;
};