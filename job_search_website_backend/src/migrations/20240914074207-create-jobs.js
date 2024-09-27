'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('jobs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT('long')
      },
      location: {
        type: Sequelize.TEXT
      },
      salaryRange: {
        type: Sequelize.BIGINT
      },
      jobType: {
        type: Sequelize.ENUM("full-time", "part-time", "contract")
      },
      requirements: {
        type: Sequelize.TEXT('long')
      },
      jobCategory: {
        type: Sequelize.STRING
      },
      numberOfApplications: {
        type: Sequelize.INTEGER
      },
      jobStatus: {
        type: Sequelize.ENUM("open", "closed"),
        defaultValue: "open"
      },
      employerId: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('jobs');
  }
};