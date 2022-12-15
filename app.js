const express = require("express");
const app = express();
const { getTopics, getArticles, getArticleById, getCommentsByArticleId } = require('./controllers/app.controllers.js');
const { handlePsqlErrors, handleCustomErrors, handle500s } = require('./controllers/error.controllers.js')



app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.all("*", (req, res) => {
    res.status(404).send({ msg: "Path not found" });
});

app.use(handlePsqlErrors)
app.use(handleCustomErrors)
app.use(handle500s)

module.exports = app;