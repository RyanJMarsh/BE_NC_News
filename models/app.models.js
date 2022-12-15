const db = require("../db/connection");

exports.getTopicsData = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

exports.getArticlesData = () => {
  return db
    .query(
      `
        SELECT articles.article_id, articles.title, articles.body, articles.votes, articles.topic, articles.author, articles.created_at, COUNT(comments.comment_id) AS comment_count
        FROM articles
        JOIN comments
        ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY created_at desc`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.getArticleByIdData = (article_id) => {
  return db
    .query(
      `
  SELECT articles.article_id, articles.title, articles.body, articles.votes, articles.topic, articles.author, articles.created_at, COUNT(comments.comment_id) AS comment_count
  FROM articles
  JOIN comments
  ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id
  `,
      [article_id]
    )
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "article_id does not exist",
        });
      } else {
        return response.rows;
      }
    });
};

exports.getCommentsByArticleIdData = (article_id) => {
  return db.query("SELECT article_id FROM articles WHERE article_id = $1", [article_id])
  .then((checkArticleId) => {
      if (checkArticleId.rows.length === 0) {
          return Promise.reject({
              message: "article_id does not exist",
              status: 404
          })
      }
      else {
          return db.query("SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC", [article_id])
          .then((comments) => {
              return comments.rows
              })
          }
      })
}
