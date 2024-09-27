'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class useractivities extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      useractivities.belongsTo(models.users, {
        foreignKey: 'userId',
      });
      useractivities.belongsTo(models.jobs, {
        foreignKey: 'jobId',
      });
    }
  }
  useractivities.init({
    activityType: DataTypes.ENUM('view', 'apply', 'save')
  }, {
    sequelize,
    modelName: 'useractivities',
  });
  return useractivities;
};