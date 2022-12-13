const { response } = require("../app.js");
const {
  getTopicsData,
  getArticlesData,
  getArticleByIdData,
  getCommentsByArticleIdData,
} = require("../models/app.models.js");

exports.getTopics = (request, response, next) => {
  getTopicsData()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (request, response, next) => {
  getArticlesData()
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  getArticleByIdData(article_id)
    .then((articles) => {
      if (articles.length === 0) {
        next({ status: 404, msg: "article_id does not exist" });
      } else {
        response.status(200).send({ articles });
      }
    })
    .catch((error) => {
      next({ status: 400, msg: "article_id is not of correct type" });
    });
};

exports.getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  getCommentsByArticleIdData(article_id)
    .then((comments) => {
      if (comments.length === 0) {
        return next({ status: 404, msg: "article does not exist" });
      } else {
        response.status(200).send({ comments });
      }
    })
    .catch((error) => {
      next({ status: 400, msg: "article_id is not of correct type"});
    });
};
