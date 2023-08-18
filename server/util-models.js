const db = require("../db/connection");
const articles = require("../db/data/test-data/articles");
const endpoints = require("../endpoints.json");
const fs = require("fs/promises");
const format = require("pg-format");

const checkExists = (table, column, value) => {
if(!value){
    return Promise.resolve()
}
  const queryStr = format("SELECT * FROM %I WHERE %I = $1;", table, column);
  return db.query(queryStr, [value]).then((response) => {
    if (response.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Resource not found" });
    } else {
      return response.rows;
    }
  });
};

module.exports = { checkExists };
