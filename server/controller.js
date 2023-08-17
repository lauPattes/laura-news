const {
  selectTopics,
  selectEndpoints,
  selectArticleById,
  selectCommentsByArticleId,
  selectArticles,
  insertComment
} = require("./model");

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

exports.getArticles = (req,res,next) => {
  selectArticles()
  .then((articles)=>{
    res.status(200).send({articles})
  })
  .catch((err)=>{
    next(err)
  })
  }

  exports.postComment = (req,res,next) =>{
    const {username, body} = req.body
    const {article_id} = req.params
    selectArticleById(article_id).then((response)=>{
      return Promise.all([response])
    })
    .then(()=>{
     return insertComment(username, body, article_id)
     
    })
    .then((comment)=>{
      res.status(201).send({comment})
    })
    .catch((err)=>{
      next(err)
    })

  }
