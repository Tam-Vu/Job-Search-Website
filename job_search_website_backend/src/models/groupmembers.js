"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class groupmembers extends Model {
    static associate(models) {
      groupmembers.belongsTo(models.conversations, { foreignKey: "conversationId" });
      groupmembers.belongsTo(models.users, { foreignKey: "userId" });
    }
  }

  groupmembers.init(
    {
      conversationId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "groupmembers",
    }
  );

  return groupmembers;
};
