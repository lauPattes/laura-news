const { selectTopics, selectEndpoints, selectArticleById, selectArticles, commentCount } = require("./model");

exports.getTopics = (req, res) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getEndpoints = (req, res, next) => {
  selectEndpoints()
    .then((endpoints) => {
      res.status(200).send({ endpoints });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
  .then((article) => {
    res.status(200).send({ article });
  })
  .catch((err)=>{
    next(err)
  })
};

exports.getArticles = (req,res,next) => {
  selectArticles()
  .then((articles)=>{
    res.status(200).send({articles})
  })
  .catch((err)=>{
    next(err)
  })
  }
