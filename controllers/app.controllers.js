const {
  getTopicsData,
  getArticlesData,
  getArticleByIdData,
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
        next({ code: 404, msg: "article_id does not exist" });
      } else {
        response.status(200).send({ articles });
      }
    })
    .catch((error) => {
      next({ code: 400, msg: "article_id is not of correct type" });
    });
};
