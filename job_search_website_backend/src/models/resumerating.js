"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class resumeratings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      resumeratings.belongsTo(models.employers, {
        foreignKey: "employerId",
      });
      resumeratings.belongsTo(models.resumes, {
        foreignKey: "resumeId",
      });
    }
  }
  resumeratings.init(
    {
      star: DataTypes.FLOAT,
      content: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "resumeratings",
    },
  );
  return resumeratings;
};
