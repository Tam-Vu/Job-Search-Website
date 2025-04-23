"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    static associate(models) {
      Conversation.hasMany(models.Message, { foreignKey: "conversationId" });
      // Use the correctly cased model name that actually exists in your system
      Conversation.belongsToMany(models.users, {
        through: "GroupMembers",
        foreignKey: "conversationId",
      });
    }
  }

  Conversation.init(
    {
      name: DataTypes.STRING,
      isGroup: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Conversation",
    }
  );

  return Conversation;
};
