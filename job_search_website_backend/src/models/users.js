"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    static associate(models) {
      // Fix the Job association - it should use lowercase 'jobs'
      users.hasMany(models.jobs, {
        foreignKey: "userId",
      });
      
      users.hasMany(models.employees, {
        foreignKey: "userId",
      });
      
      users.hasMany(models.employers, {
        foreignKey: "userId",
      });
      
      users.hasMany(models.messages, {
        foreignKey: "senderId",
      });
      
      users.belongsToMany(models.Conversation, {
        through: "GroupMembers",
        foreignKey: "userId",
      });
    }
  }

  users.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      image: DataTypes.TEXT,
      role: DataTypes.ENUM("admin", "employer", "user"),
    },
    {
      sequelize,
      modelName: "users",
    }
  );

  return users;
};