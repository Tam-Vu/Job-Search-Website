"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class interviewschedules extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      interviewschedules.belongsTo(models.applications, {
        foreignKey: "applicationId",
      });
    }
  }
  interviewschedules.init(
    {
      location: DataTypes.TEXT,
      date: DataTypes.DATEONLY,
      time: DataTypes.TIME,
      status: DataTypes.ENUM("scheduled", "completed", "cancelled"),
    },
    {
      sequelize,
      modelName: "interviewschedules",
    },
  );
  return interviewschedules;
};
