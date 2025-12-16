'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Admin.init({
 name: {
        type: DataTypes.STRING,
        allowNull:false
      },
      email: {
        type: DataTypes.STRING,
        unique:true,
        allowNull:false,
        validate:{
          isEmail:true,
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull:false
      },
      profile: {
        type: DataTypes.STRING,
        allowNull:true,
        defaultValue:null
      },
      type: {
        type: DataTypes.ENUM("ADMIN","MEMBER"),
        allowNull:false,
        defaultValue:"MEMBER"

      },
      jwt_token: {
        type: DataTypes.STRING,
        allowNull:true,
        defaultValue:null
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true
      },  }, {
    sequelize,
    modelName: 'Admin',
  });
  return Admin;
};