require("dotenv").config();

module.exports = {
  development: {
    username: "postgres",
    password: "nabilaba",
    database: "ch6_development",
    host: "localhost",
    dialect: "postgres",
  },
  test: {
    username: "postgres",
    password: "nabilaba",
    database: "ch6_test",
    host: "localhost",
    dialect: "postgres",
  },
  production: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    dialect: "postgres",
    port: process.env.PGPORT,
  },
};
