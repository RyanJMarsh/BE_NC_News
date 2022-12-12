exports.handle500s = (err, req, res, next) => {
    console.log('Inside handle 500s', err);
    res.status(500).send({msg: 'server error'});
}