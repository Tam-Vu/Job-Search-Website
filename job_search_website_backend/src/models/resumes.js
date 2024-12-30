"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) =>
{
  class resumes extends Model
  {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models)
    {
      // define association here
      resumes.belongsTo(models.employees, {
        foreignKey: "employeeId",
      });
      resumes.hasMany(models.applications, {
        foreignKey: "resumeId",
      });
      resumes.hasMany(models.resumeSkills, {
        foreignKey: "resumeId",
      });
      resumes.hasMany(models.experienceDetails, {
        foreignKey: "resumeId",
      });
      resumes.hasMany(models.educations, {
        foreignKey: "resumeId",
      });
    }
  }
  resumes.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT("long"),
      skill: DataTypes.TEXT("long"),
      experience: DataTypes.STRING,
      field: DataTypes.STRING,
      isInvisible: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "resumes",
    },
  );
  return resumes;
};
