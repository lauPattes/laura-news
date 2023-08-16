const {
  selectTopics,
  selectEndpoints,
  selectArticleById,
  selectCommentsByArticleId,
  selectArticles,
  updateVotes,
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
  const article = selectArticleById(article_id);
  const comment = selectCommentsByArticleId(article_id);
  Promise.all([article, comment])
    .then((resolvedPromises) => {
      const comments = resolvedPromises[1];
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchVotes = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  const type = typeof inc_votes
  if (type !== "number") {
    next({status: 400, msg: "incorrect body" });
  } else {
    selectArticleById(article_id).then((articles)=>{
      return Promise.all([articles])
    })
    .then(()=>{
      return updateVotes(article_id, inc_votes)
    })
    .then((updatedArticle) => {
        res.status(201).send({ updatedArticle });
      })
      .catch((err) => {
        next(err);
      });
  }
};
