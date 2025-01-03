"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("resumes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      skill: {
        type: Sequelize.TEXT("long"),
      },
      field: {
        type: Sequelize.STRING,
      },
      experience: {
        type: Sequelize.STRING,
      },
      employeeId: {
        type: Sequelize.INTEGER,
      },
      description: {
        type: Sequelize.TEXT("long"),
      },
      isInvisible: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("resumes");
  },
};
