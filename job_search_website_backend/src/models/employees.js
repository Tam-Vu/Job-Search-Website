"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class employees extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      employees.belongsTo(models.users, {
        foreignKey: "userId",
      });
      employees.hasMany(models.resumes, {
        foreignKey: "employeeId",
      });
    }
  }
  employees.init(
    {
      fullName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "employees",
    },
  );
  return employees;
};
