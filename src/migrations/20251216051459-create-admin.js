'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('admins', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull:false
      },
      email: {
        type: Sequelize.STRING,
        unique:true,
        allowNull:false,
        validate:{
          isEmail:true,
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull:false
      },
      profile: {
        type: Sequelize.STRING,
        allowNull:true,
        defaultValue:null
      },
      type: {
        type: Sequelize.ENUM("ADMIN","MEMBER"),
        allowNull:false,
        defaultValue:"MEMBER"

      },
      jwt_token: {
        type: Sequelize.STRING,
        allowNull:true,
        defaultValue:null
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('admins');
  }
};