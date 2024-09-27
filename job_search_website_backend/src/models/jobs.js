'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class jobs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      jobs.belongsTo(models.employers, {
        foreignKey: 'employerId',
      });
      jobs.hasMany(models.applications, {
        foreignKey: 'jobId',
      });
      jobs.hasMany(models.interviewschedules, {
        foreignKey: 'jobId',
      });
      jobs.hasMany(models.recommendations, {
        foreignKey: 'jobId',
      });
      jobs.hasMany(models.useractivities, {
        foreignKey: 'jobId',
      });
    }
  }
  jobs.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT('long'),
    location: DataTypes.TEXT,
    salaryRange: DataTypes.BIGINT,
    jobType: DataTypes.ENUM("full-time", "part-time", "contract"),
    requirements: DataTypes.TEXT('long'),
    jobCategory: DataTypes.STRING,
    numberOfApplications: DataTypes.INTEGER,
    jobStatus: DataTypes.ENUM("open", "closed"),
  }, {
    sequelize,
    modelName: 'jobs',
  });
  return jobs;
};