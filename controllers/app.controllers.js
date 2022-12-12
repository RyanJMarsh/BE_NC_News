const { getTopicsData, getArticlesData } = require("../models/app.models.js");

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
}