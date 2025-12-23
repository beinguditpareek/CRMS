'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({

      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 100],
        },
      },

      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg:'Email must be in correct format'
          },
          notEmpty: true,
        },
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [8, 100],
        },
      },

      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};