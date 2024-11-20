"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class applications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      applications.belongsTo(models.jobs, {
        foreignKey: "jobId",
      });
      applications.belongsTo(models.resumes, {
        foreignKey: "resumeId",
      });
    }
  }
  applications.init(
    {
      status: DataTypes.ENUM("pending", "accepted", "rejected"),
    },
    {
      sequelize,
      modelName: "applications",
    },
  );
  return applications;
};
