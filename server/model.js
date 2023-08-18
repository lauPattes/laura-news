const db = require("../db/connection");
const articles = require("../db/data/test-data/articles");
const endpoints = require("../endpoints.json");
const fs = require("fs/promises");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((result) => {
    return result.rows;
  });
};

exports.selectEndpoints = () => {
  return fs.readFile("endpoints.json", "utf8").then((response) => {
    return JSON.parse(response);
  });
};

exports.selectArticleById = (article_id) => {
  const queryStr = 'SELECT articles.article_id, articles.title,articles.topic, articles.author, articles.body, articles.created_at, articles.votes, articles.article_img_url,COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id'
  
  return db
    .query(queryStr, [article_id])
    .then((result) => {
      const article = result.rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: "article does not exist",
        });
      } else {
        return article;
      }
    });
};

exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;",
      [article_id]
    )
    .then((result) => {
      return result.rows;
    });
};

exports.selectArticles = (topic, sort_by = "created_at", order = "desc") => {
  if (
    ![
      "title",
      "topics",
      "author",
      "body",
      "article_img_url",
      "votes",
      "created_at",
    ].includes(sort_by)
  ) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }

  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  } 

  const queryValues = [];
  let queryStr =
    "SELECT articles.article_id, articles.title,articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url,COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id";

  if (topic) {
    queryValues.push(topic);
    queryStr += " WHERE topic = $1";
  }


  queryStr += ` GROUP BY articles.article_id ORDER BY articles.${sort_by} ${order.toUpperCase()};`;

  return db.query(queryStr,queryValues).then((result) => {
    return result.rows;
  });
};

exports.removeComment = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [
      comment_id,
    ])
    .then((result) => {
      return result.rows[0];
    });
};

exports.selectCommentsbyComment_id = (comment_id) => {
  return db
    .query("SELECT * FROM comments WHERE comment_id = $1;", [comment_id])
    .then((result) => {
      const comment = result.rows[0];
      if (!comment) {
        return Promise.reject({
          status: 404,
          msg: "comment does not exist",
        });
      } else {
        return comment;
      }
    });
};
exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;",
      [article_id]
    )
    .then((result) => {
      return result.rows;
    })
};

exports.updateVotes = (article_id, inc_votes) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;",
      [article_id, inc_votes]
    )
    .then((result) => {
      return result.rows[0];
    });
};
exports.insertComment = (username, body, article_id) => {
  return db
    .query(
      "INSERT INTO comments(author,body,article_id) VALUES($1,$2,$3) RETURNING *;",
      [username, body, article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.selectUsers = () => {
  return db.query("SELECT * FROM users;").then((result) => {
    return result.rows;
  });
};
