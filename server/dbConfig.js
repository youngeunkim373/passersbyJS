const mariaDB = require("mysql");

const conn = mariaDB.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "apm6311",
  database: "passersby",
});

module.exports = conn;