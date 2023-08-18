const {
  selectTopics,
  selectEndpoints,
  selectArticleById,
  selectCommentsByArticleId,
  selectArticles,
  removeComment,
  selectCommentsbyComment_id,
  updateVotes,
  insertComment,
  selectUsers,
} = require("./model");

const { checkExists } = require("./util-models");

exports.getTopics = (req, res, next) => {
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
      console.log(err)
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
  const { query } = req;
  const { topic, sort_by, order } = query;
  checkExists("topics", "slug", topic)
    .then(() => {
      return selectArticles(topic, sort_by, order);
    })
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
  const type = typeof inc_votes;
  if (type !== "number") {
    next({ status: 400, msg: "incorrect body" });
  } else {
    selectArticleById(article_id)
      .then(() => {
        return updateVotes(article_id, inc_votes);
      })
      .then((updatedArticle) => {
        res.status(201).send({ updatedArticle });
      })
      .catch((err) => {
        next(err);
      });
  }
};

exports.deleteCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  selectCommentsbyComment_id(comment_id)
    .then((comment) => {
      return removeComment(comment_id);
    })
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((response) => {
      return Promise.all([response]);
    })
    .then(() => {
      return insertComment(username, body, article_id);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  selectUsers().then((response) => {
    res.status(200).send({ response });
  });
};
