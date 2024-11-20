"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class industries extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // industries.hasMany(models.jobs, {
      //   foreignKey: 'industryId',
      // });
    }
  }
  industries.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "industries",
    },
  );
  return industries;
};
