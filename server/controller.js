const {
  selectTopics,
  selectEndpoints,
  selectArticleById,
  selectCommentsByArticleId,
} = require("./model");

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
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const article = selectArticleById(article_id)
  const comment = selectCommentsByArticleId(article_id)
  Promise.all([article, comment])
  .then((resolvedPromises)=>{
    const comments = resolvedPromises[1]
    res.status(200).send({comments})
  })
  .catch((err)=>{
    next(err)
  });
  };
