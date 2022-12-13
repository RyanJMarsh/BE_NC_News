exports.handle400s = (error, request, response, next) => {
    if (error.code === 400) {
        response.status(400).send(error)
    } else {
        next(error)
    }
}

exports.handle404s = (error, request, response, next) => {
    if (error.code === 404) {
        response.status(404).send(error)
    } else {
        next(error)
    }
}


exports.handle500s = (error, request, response, next) => {
    response.status(500).send({msg: 'server error'});
}