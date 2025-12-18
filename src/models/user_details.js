'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User_details.init({
  
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
      },

      contact: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },

      designation: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      school_name: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },

      school_address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      school_logo: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      school_website_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      school_assets: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

  }, {
    sequelize,
    modelName: 'User_details',
  });
  return User_details;
};