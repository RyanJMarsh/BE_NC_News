const db = require('../db/connection');

exports.getTopicsData = () => {
    return db.query('SELECT * FROM topics').then(({ rows }) => {
        return rows;
    })
}

exports.getArticlesData = () => {
    return db.query('SELECT * FROM articles ORDER BY created_at desc').then(({ rows }) => {
        return rows;
    })
}