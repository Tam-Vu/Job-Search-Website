"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class GroupMember extends Model {
    static associate(models) {
      GroupMember.belongsTo(models.Conversation, { foreignKey: "conversationId" });
      GroupMember.belongsTo(models.users, { foreignKey: "userId" });
    }
  }

  GroupMember.init(
    {
      conversationId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "GroupMember",
      tableName: "GroupMembers", // Make sure this matches with the through table name
    }
  );

  return GroupMember;
};
