"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class resumeSkills extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      resumeSkills.belongsTo(models.resumes, {
        foreignKey: "resumeId",
      });
      resumeSkills.belongsTo(models.skills, {
        foreignKey: "skillId",
      });
    }
  }
  resumeSkills.init(
    {
      resumeId: DataTypes.INTEGER,
      skillId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "resumeSkills",
    },
  );
  return resumeSkills;
};
