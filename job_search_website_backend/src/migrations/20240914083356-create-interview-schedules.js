"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("interviewschedules", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      location: {
        type: Sequelize.TEXT,
      },
      status: {
        type: Sequelize.ENUM("scheduled", "completed", "cancelled"),
        defaultValue: "scheduled",
      },
      time: {
        type: Sequelize.TIME,
      },
      date: {
        type: Sequelize.DATEONLY,
      },
      applicationId: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("interviewschedules");
  },
};
