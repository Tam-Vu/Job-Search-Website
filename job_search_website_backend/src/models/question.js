"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class questions extends Model {
    static associate(models) {
      questions.belongsTo(models.quizzes, {
        foreignKey: "quizId",
      });
      questions.hasMany(models.choices, {
        foreignKey: "questionId",
      });
      questions.hasMany(models.quizAnswers, {
        foreignKey: "questionId",
      });
    }
  }
  questions.init(
    {
      quizId: DataTypes.INTEGER,
      questionText: DataTypes.TEXT('long'),
      questionType: DataTypes.ENUM('multiple-choice', 'essay'),
      helperText: DataTypes.STRING,
      placeholder: DataTypes.STRING,
      isRequired: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "questions",
    }
  );
  return questions;
};
