const express = require("express");
const app = express();
const { getTopics, getArticles, getArticleById } = require('./controllers/app.controllers.js');
const { handle400s, handle404s, handle500s } = require('./controllers/error.controllers.js')



app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById)

app.all("*", (req, res) => {
    res.status(404).send({ msg: "Path not found" });
});
app.use(handle400s)
app.use(handle404s)
app.use(handle500s)

module.exports = app;