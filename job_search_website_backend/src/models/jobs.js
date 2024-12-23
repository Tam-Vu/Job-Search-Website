"use strict";
const { Model } = require("sequelize");
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
        foreignKey: "employerId",
      });
      jobs.hasMany(models.applications, {
        foreignKey: "jobId",
      });
      jobs.hasMany(models.interviewschedules, {
        foreignKey: "jobId",
      });
      jobs.hasMany(models.recommendations, {
        foreignKey: "jobId",
      });
      jobs.hasMany(models.useractivities, {
        foreignKey: "jobId",
      });
      // jobs.belongsTo(models.industries, {
      //   foreignKey: 'industryId',
      // });
    }
  }
  jobs.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT("long"),
      location: DataTypes.TEXT,
      district: DataTypes.STRING,
      salaryRange: DataTypes.STRING,
      jobType: DataTypes.ENUM("full-time", "part-time", "contract"),
      requirements: DataTypes.TEXT("long"),
      numberOfApplications: DataTypes.INTEGER,
      jobStatus: DataTypes.ENUM("open", "closed"),
      status: DataTypes.ENUM("accept", "reject", "pending"),
      professionalPosition: DataTypes.STRING,
      industry: DataTypes.STRING,
      jobField: DataTypes.STRING,
      experience: DataTypes.STRING,
      closedDate: DataTypes.DATEONLY,
    },
    {
      sequelize,
      modelName: "jobs",
    },
  );
  return jobs;
};
