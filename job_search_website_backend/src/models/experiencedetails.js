'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class experienceDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      experienceDetails.belongsTo(models.resumes, {
        foreignKey: 'resumeId',
      });
    }
  }
  experienceDetails.init({
    companyName: DataTypes.STRING,
    startMonth: DataTypes.INTEGER,
    startYear: DataTypes.INTEGER,
    endMonth: DataTypes.INTEGER,
    endYear: DataTypes.INTEGER,
    description: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'experienceDetails',
  });
  return experienceDetails;
};