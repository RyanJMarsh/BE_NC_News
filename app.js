const express = require("express");
const app = express();
const { getTopics, getArticles } = require('./controllers/app.controllers.js');
const { handle500s } = require('./controllers/error.controllers.js')



app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);

app.all("*", (req, res) => {
    res.status(404).send({ msg: "Path not found" });
});

app.use(handle500s)

module.exports = app;