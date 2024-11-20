"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class recommendations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      recommendations.belongsTo(models.jobs, {
        foreignKey: "jobId",
      });
      recommendations.belongsTo(models.users, {
        foreignKey: "userId",
      });
    }
  }
  recommendations.init(
    {
      score: DataTypes.TINYINT,
    },
    {
      sequelize,
      modelName: "recommendations",
    },
  );
  return recommendations;
};
