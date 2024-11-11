'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class employers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      employers.hasMany(models.jobs, {
        foreignKey: 'employerId',
      });
      employers.belongsTo(models.users, {
        foreignKey: 'userId',
      });
    }
  }
  employers.init({
    companyName: DataTypes.STRING,
    companyDescription: DataTypes.TEXT,
    location: DataTypes.TEXT,
    website: DataTypes.TEXT,
    status: DataTypes.ENUM("active", "inactive"),
  }, {
    sequelize,
    modelName: 'employers',
  });
  return employers;
};