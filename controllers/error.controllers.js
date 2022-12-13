exports.handle400s = (error, request, response, next) => {
    if (error.status) {
        response.status(error.status).send({message: error.msg})
    } else {
        next(error)
    }
}

exports.handlePsqlErrors = (error, request, response, next) => {
    if(error.code = "22P02") {
        response.status(404).send({message: error.msg})
    } else {
        next(error)
    }
}

exports.handle404s = (error, request, response, next) => {
    if (error.code === 404) {
        response.status(404).send({message: error.msg})
    } else {
        next(error)
    }
}


exports.handle500s = (error, request, response, next) => {
    response.status(500).send({msg: 'server error'});
}