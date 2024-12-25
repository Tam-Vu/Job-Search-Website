"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("jobs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT("long"),
      },
      location: {
        type: Sequelize.TEXT,
      },
      district: {
        type: Sequelize.STRING,
      },
      salaryRange: {
        type: Sequelize.STRING,
      },
      jobType: {
        type: Sequelize.ENUM("full-time", "part-time", "contract"),
      },
      requirements: {
        type: Sequelize.TEXT("long"),
      },
      numberOfApplications: {
        type: Sequelize.INTEGER,
      },
      jobStatus: {
        type: Sequelize.ENUM("open", "closed"),
        defaultValue: "open",
      },
      closedDate: {
        type: Sequelize.DATEONLY,
      },
      status: {
        type: Sequelize.ENUM("accept", "reject", "pending"),
        defaultValue: "pending",
      },
      employerId: {
        type: Sequelize.INTEGER,
      },
      industry: {
        type: Sequelize.STRING,
      },
      jobField: {
        type: Sequelize.STRING,
      },
      professionalPosition: {
        type: Sequelize.STRING,
      },
      experience: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("jobs");
  },
};
