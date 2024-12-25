'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class educations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      educations.belongsTo(models.resumes, {
        foreignKey: "resumeId",
      });
    }
  }
  educations.init({
    startYear: DataTypes.INTEGER,
    endYear: DataTypes.INTEGER,
    university: DataTypes.STRING,
    degree: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'educations',
  });
  return educations;
};