"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Conversations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      lastMessage: {
        type: Sequelize.TEXT("long"),
      },
      status: {
        type: Sequelize.ENUM("seen", "unseen"),
      },
      name: {
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.ENUM("group", "individual"),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Conversations");
  },
};
