const express = require("express");
const app = express();
const { getTopics, getArticles, getArticleById, getCommentsByArticleId, postNewComment, patchArticleById } = require('./controllers/app.controllers.js');
const { handlePsqlErrors, handleCustomErrors, handle500s } = require('./controllers/error.controllers.js')

app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)
app.post('/api/articles/:article_id/comments', postNewComment)
app.patch('/api/articles/:article_id', patchArticleById)

app.all("*", (request, response) => {
    response.status(404).send({ message: "Path not found" });
});

app.use(handlePsqlErrors)
app.use(handleCustomErrors)
app.use(handle500s)

module.exports = app;