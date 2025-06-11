'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class choices extends Model {
    static associate(models) {
      choices.belongsTo(models.questions, {
        foreignKey: 'questionId',
      });
      choices.hasMany(models.quizAnswers, {
        foreignKey: 'choiceId',
      });
    }
  }
  choices.init(
    {
      questionId: DataTypes.INTEGER,
      choiceText: DataTypes.TEXT,
      isCorrect: DataTypes.BOOLEAN,
      idFront: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'choices',
    }
  );
  return choices;
};
