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
        GROUP BY articles.article_id`
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
      return response.rows;
    });
};

exports.getCommentsByArticleIdData = (article_id) => {
  return db
    .query(
      `
    SELECT articles.article_id, comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body
    FROM articles
    JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    ORDER BY created_at desc;`,
      [article_id]
    )
    .then((response) => {
      return response.rows;
    });
};
