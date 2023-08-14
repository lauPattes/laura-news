const { getTopics,getEndpoints,getArticleId } = require("./controller");

const express = require("express");
const app = express();

app.get("/api/topics", getTopics);

app.get("/api",getEndpoints)

app.get("/api/articles/:article_id",getArticleId)


app.use((err, req, res, next) => {
  if (err.code) {
    res.status(err.status).send({msg: err.msg});
  }
  else{
    next(err)
  }
});

app.use((err, req, res, next) => {
  res.status(500).send("Server Error!");
});

app.all("/*",(req,res)=>{
    res.status(404).send({msg :"path not found"})
})

module.exports = app;

