'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ExperienceDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      companyName: {
        type: Sequelize.STRING
      },
      startMonth: {
        type: Sequelize.INTEGER
      },
      startYear: {
        type: Sequelize.INTEGER
      },
      endMonth: {
        type: Sequelize.INTEGER
      },
      endYear: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.TEXT('long')
      },
      resumeId: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('ExperienceDetails');
  }
};