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
      conversations.hasMany(models.groupmembers, {
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
