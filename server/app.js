const { getTopics } = require("./controller");

const express = require("express");
const app = express();

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
  if (err.code === "404") {
    res.status(404).send({ msg: "path not found" });
  }
  else{
    next(err)
  }
});

app.use((err, req, res, next) => {
  res.status(500).send("Server Error!");
});


module.exports = app;
