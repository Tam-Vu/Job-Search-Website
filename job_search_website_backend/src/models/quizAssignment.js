'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class quizAssignments extends Model {
    static associate(models) {
      quizAssignments.belongsTo(models.quizzes, {
        foreignKey: 'quizId',
      });
      quizAssignments.belongsTo(models.employees, {
        foreignKey: 'employeeId',
      });
      quizAssignments.hasMany(models.quizAnswers, {
        foreignKey: 'quizAssignmentId',
      });
    }
  }
  quizAssignments.init(
    {
      quizId: DataTypes.INTEGER,
      employeeId: DataTypes.INTEGER,
      status: DataTypes.ENUM('assigned', 'in_progress', 'completed'),
      dueDate: DataTypes.DATE,
      startedAt: DataTypes.DATE,
      completedAt: DataTypes.DATE,
      correctAnswers: DataTypes.INTEGER,
      totalQuestions: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'quizAssignments',
    }
  );
  return quizAssignments;
};
