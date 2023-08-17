const { getTopics, getEndpoints, getArticleId, getArticles, getCommentsByArticleId, postComment } = require("./controller");

const express = require("express");
const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleId);

app.get("/api/articles/:article_id/comments",getCommentsByArticleId)

app.get("/api/articles",getArticles)

app.use(express.json())

app.post("/api/articles/:article_id/comments",postComment)

app.use((err, req, res, next) => {
    if (err.status === 404) {
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
  else{
    next(err)
  }
})

app.use((err,req,res,next)=>{
  if(err.code === '23503'){
    res.status(400).send({msg: "incorrect body"})
  }
  else{
    next(err)
  }
})

app.use((err, req, res, next) => {
  res.status(500).send({msg : "Server Error!"});
});

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});

module.exports = app;
