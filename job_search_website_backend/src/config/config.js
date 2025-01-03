require("dotenv").config();
const databasename = process.env.DATABASENAME;
const databaseuser = process.env.DATABASEUSERNAME;
const databasepassword = process.env.DATABASEPASSWORD;
const databasehost = process.env.DATABASEHOST;
const databaseport = process.env.DATABASEPORT;
const databasedialect = process.env.DATABASEDIALECT;
module.exports = {
  development: {
    username: databaseuser,
    password: databasepassword,
    database: databasename,
    port: databaseport,
    dialect: databasedialect,
    host: databasehost,
    define: {
      freezeTableName: true,
    },
  },
  test: {
    username: databaseuser,
    password: databasepassword,
    database: databasename,
    port: databaseport,
    dialect: databasedialect,
    host: databasehost,
  },
  production: {
    username: databaseuser,
    password: databasepassword,
    database: databasename,
    port: databaseport,
    dialect: databasedialect,
    host: databasehost,
  },
};
