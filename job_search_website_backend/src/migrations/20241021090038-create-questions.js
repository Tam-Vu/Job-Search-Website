'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('questions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      quizId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'quizzes',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      questionText: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
      },
      questionType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      helperText: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      placeholder: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isRequired: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
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
    await queryInterface.dropTable('questions');
  },
};
