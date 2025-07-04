"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class quizAnswers extends Model {
    static associate(models) {
      quizAnswers.belongsTo(models.quizAssignments, {
        foreignKey: "quizAssignmentId",
      });
      quizAnswers.belongsTo(models.questions, {
        foreignKey: "questionId",
      });
      quizAnswers.belongsTo(models.choices, {
        foreignKey: "choiceId",
      });
    }
  }
  quizAnswers.init(
    {
      quizAssignmentId: DataTypes.INTEGER,
      questionId: DataTypes.INTEGER,
      choiceId: DataTypes.INTEGER,
      essayAnswer: DataTypes.TEXT('long'),
      isCorrect: DataTypes.BOOLEAN,
      score: DataTypes.FLOAT,
      feedback: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "quizAnswers",
    }
  );
  return quizAnswers;
};
