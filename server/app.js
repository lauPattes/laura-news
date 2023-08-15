const { getTopics, getEndpoints, getArticleId, getArticles } = require("./controller");

const express = require("express");
const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleId);

app.get("/api/articles",getArticles)

app.use((err, req, res, next) => {
    if (err.msg === "article does not exist") {
      const { msg } = err;
      res.status(404).send({ msg });
    } else {
    next(err);
  }
});

app.use((err,req,res,next)=>{
  if(err.code === "22P02"){
    res.status(400).send({msg: "invalid id"})
  }
})

app.use((err, req, res, next) => {
  if (err.code) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({msg : "Server Error!"});
});

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});

module.exports = app;
