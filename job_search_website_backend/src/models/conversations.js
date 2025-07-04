"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class conversations extends Model {
    static associate(models) {
      // Define regular association for filtering
      conversations.hasMany(models.groupmembers, {
        foreignKey: "conversationId",
      });
      
      // Add another association with alias for getting all members
      conversations.hasMany(models.groupmembers, {
        as: 'allMembers',
        foreignKey: "conversationId",
      });
      
      conversations.hasMany(models.messages, {
        foreignKey: "conversationId",
      });
    }
  }
  conversations.init(
    {
      lastMessage: DataTypes.TEXT("long"),
      status: DataTypes.ENUM("seen", "unseen"),
      name: DataTypes.STRING,
      type: DataTypes.ENUM("group", "individual"),
    },
    {
      sequelize,
      modelName: "conversations",
    },
  );
  return conversations;
};
