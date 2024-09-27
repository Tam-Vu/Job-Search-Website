'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class resumes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      resumes.belongsTo(models.users, {
        foreignKey: 'userId',
      });
      resumes.hasMany(models.applications, {
        foreignKey: 'resumeId',
      });
      resumes.hasMany(models.interviewschedules, {
        foreignKey: 'resumeId',
      });
    }
  }
  resumes.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT('long'),
    skill: DataTypes.TEXT('long'),
    experience: DataTypes.TINYINT,
    education: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'resumes',
  });
  return resumes;
};