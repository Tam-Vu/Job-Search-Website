"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
// const config = require(__dirname + '/../config/config.json')[env];
require("dotenv").config();
const databasename = process.env.DATABASENAME;
const databaseuser = process.env.DATABASEUSERNAME;
const databasepassword = process.env.DATABASEPASSWORD;
const databasehost = process.env.DATABASEHOST;
const databaseport = process.env.DATABASEPORT;
const databasedialect = process.env.DATABASEDIALECT;
const db = {};

let sequelize;
const customSequelize = {
  host: databasehost,
  port: databaseport,
  dialect: databasedialect,
  logging: false,
  query: { raw: true },
};
sequelize = new Sequelize(
  process.env.DATABASENAME,
  process.env.DATABASEUSERNAME,
  process.env.DATABASEPASSWORD,
  customSequelize,
);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes,
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
