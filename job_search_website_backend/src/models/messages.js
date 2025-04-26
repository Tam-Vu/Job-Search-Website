"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class messages extends Model {
    static associate(models) {
      // Keep existing association with conversations
      messages.belongsTo(models.conversations, {
        foreignKey: "conversationId",
      });
      
      // Add missing association with users
      messages.belongsTo(models.users, {
        foreignKey: "senderId",
      });
    }
  }
  messages.init(
    {
      text: DataTypes.TEXT("long"),
      file: DataTypes.TEXT("long"),
      conversationId: DataTypes.INTEGER,
      senderId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "messages",
    },
  );
  return messages;
};
