const db = require("../db/connection");
const format = require("pg-format");

exports.getTopicsData = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

exports.getArticlesData = ({ query }) => {
  const queryValues = [];
  const topicValue = [];
  let articlesQueryString =
    "SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id";
  if (query.topic) {
    topicValue.push(query.topic);
    articlesQueryString += " WHERE topic = $1";
  }
  if (query.sort_by) {
    queryValues.push(query.sort_by);
    articlesQueryString += " GROUP BY articles.article_id ORDER BY %I";
  } else {
    articlesQueryString += " GROUP BY articles.article_id ORDER BY created_at";
  }
  if (query.order === "asc") {
    articlesQueryString += " ASC";
  } else if (query.order === undefined || query.order === "desc") {
    articlesQueryString += " DESC";
  } else {
    return Promise.reject({
      message: "Bad Request",
      status: 400,
    });
  }
  const formattedArticlesQueryString = format(articlesQueryString, queryValues);

  return db.query(formattedArticlesQueryString, topicValue).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        message: "Not Found",
        status: 404,
      });
    } else {
      const formattedArticlesData = rows.map((article) => {
        const formattedArticle = { ...article };
        formattedArticle.comment_count = parseInt(
          formattedArticle.comment_count,
          10
        );
        return formattedArticle;
      });
      return formattedArticlesData;
    }
  });
  // return db
  //   .query(
  //     `
  //       SELECT articles.article_id, articles.title, articles.body, articles.votes, articles.topic, articles.author, articles.created_at, COUNT(comments.comment_id) AS comment_count
  //       FROM articles
  //       JOIN comments
  //       ON articles.article_id = comments.article_id
  //       GROUP BY articles.article_id
  //       ORDER BY created_at desc`
  //   )
  //   .then(({ rows }) => {
  //     return rows;
  //   });
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
  return db
    .query("SELECT article_id FROM articles WHERE article_id = $1", [
      article_id,
    ])
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({
          message: "article_id does not exist",
          status: 404,
        });
      } else {
        return db
          .query(
            "SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC",
            [article_id]
          )
          .then((response) => {
            return response.rows;
          });
      }
    });
};

exports.insertNewComment = ({ params, body }) => {
  if (typeof body.username !== "string" || typeof body.body !== "string") {
    return Promise.reject({
      message: "Invalid Comment",
      status: 400,
    });
  } else {
    return db
      .query("SELECT article_id FROM articles WHERE article_id = $1", [
        params.article_id,
      ])
      .then((articleIdCheck) => {
        if (articleIdCheck.rows.length === 0) {
          return Promise.reject({
            message: "Not Found",
            status: 404,
          });
        } else {
          return db
            .query(
              "INSERT INTO comments(body, article_id, author) VALUES ($1, $2, $3) RETURNING *;",
              [body.body, params.article_id, body.username]
            )
            .then((newComment) => {
              return newComment.rows[0];
            });
        }
      });
  }
};

exports.updateArticleById = ({ params, body }) => {
  if (typeof body.inc_votes !== "number") {
    return Promise.reject({
      message: "Bad Request",
      status: 400,
    });
  } else {
    return db
      .query("SELECT article_id FROM articles WHERE article_id = $1", [
        params.article_id,
      ])
      .then((articleIdCheck) => {
        if (articleIdCheck.rows.length === 0) {
          return Promise.reject({
            message: "Not Found",
            status: 404,
          });
        } else {
          return db
            .query(
              "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *",
              [body.inc_votes, params.article_id]
            )
            .then((updatedArticle) => {
              return updatedArticle.rows[0];
            });
        }
      });
  }
};

exports.getUsersData = () => {
  return db.query("SELECT * FROM users;").then(({ rows }) => {
    return rows;
  });
};
