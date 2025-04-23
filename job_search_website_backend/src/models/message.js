"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.Conversation, { foreignKey: "conversationId" });
      Message.belongsTo(models.users, { foreignKey: "senderId" });
    }
  }

  Message.init(
    {
      text: DataTypes.TEXT("long"),
      conversationId: DataTypes.INTEGER,
      senderId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Message",
    }
  );

  return Message;
};
