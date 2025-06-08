"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class quizzes extends Model {
    static associate(models) {
      quizzes.belongsTo(models.employers, {
        foreignKey: "employerId",
      });
      quizzes.hasMany(models.questions, {
        foreignKey: "quizId",
      });
      quizzes.hasMany(models.quizAssignments, {
        foreignKey: "quizId",
      });
    }
  }
  quizzes.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT('long'),
      employerId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "quizzes",
    }
  );
  return quizzes;
};
