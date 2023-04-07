const {config} = require('dotenv');

config();

module.exports = {
  "development": {
    "username": process.env.MYSQLUSER || "300501",
    "password": process.env.MYSQLPASSWORD || "thisisnotapassword",
    "database": process.env.MYSQLDATABASE || "luluaylen00_argenleague",
    "host": process.env.MYSQLHOST || "mysql-luluaylen00.alwaysdata.net",
    "dialect": "mysql",
    "port": process.env.MYSQLPORT || 3306
  },
  "test": {
    "username": process.env.MYSQLUSER || "300501",
    "password": process.env.MYSQLPASSWORD || "thisisnotapassword",
    "database": process.env.MYSQLDATABASE || "luluaylen00_argenleague",
    "host": process.env.MYSQLHOST || "mysql-luluaylen00.alwaysdata.net",
    "dialect": "mysql",
    "port": process.env.MYSQLPORT || 3306
  },
  "production": {
    "username": process.env.MYSQLUSER || "300501",
    "password": process.env.MYSQLPASSWORD || "thisisnotapassword",
    "database": process.env.MYSQLDATABASE || "luluaylen00_argenleague",
    "host": process.env.MYSQLHOST || "mysql-luluaylen00.alwaysdata.net",
    "dialect": "mysql",
    "port": process.env.MYSQLPORT || 3306
  }
}
