"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class employerratings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      employerratings.belongsTo(models.employers, {
        foreignKey: "employerId",
      });
      employerratings.belongsTo(models.employees, {
        foreignKey: "employeeId",
      });
    }
  }
  employerratings.init(
    {
        star: DataTypes.FLOAT,
        content: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "employerratings",
    },
  );
  return employerratings;
};
