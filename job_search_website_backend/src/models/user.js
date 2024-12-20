"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      users.hasOne(models.employers, {
        foreignKey: "userId",
      });
      users.hasMany(models.useractivities, {
        foreignKey: "userId",
      });
      users.hasMany(models.conversations, {
        foreignKey: "senderId",
      });
      users.hasMany(models.conversations, {
        foreignKey: "receiverId",
      });
      users.hasMany(models.recommendations, {
        foreignKey: "userId",
      });
    }
  }
  users.init(
    {
      fullName: DataTypes.STRING,
      email: DataTypes.STRING,
      image: DataTypes.TEXT,
      password: DataTypes.STRING,
      role: DataTypes.ENUM("admin", "employer", "user"),
    },
    {
      sequelize,
      modelName: "users",
    },
  );
  return users;
};
