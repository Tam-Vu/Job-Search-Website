"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class conversations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      conversations.belongsTo(models.users, {
        foreignKey: "senderId",
      });
      conversations.belongsTo(models.users, {
        foreignKey: "receiverId",
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
    },
    {
      sequelize,
      modelName: "conversations",
    },
  );
  return conversations;
};
