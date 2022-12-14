exports.handlePsqlErrors = (error, request, response, next) => {
    // console.log("Reach PSQL Error Handler")
    if(error.code === "22P02") {
        response.status(400).send({message: "Bad Request"})
    } else {
        next(error)
    }
}

exports.handleCustomErrors = (error, request, response, next) => {
    // console.log("Reach Custom Error Handler")
    if (error.status) {
        response.status(error.status).send({message: error.message})
    } else {
        next(error)
    }
}


exports.handle500s = (error, request, response, next) => {
    console.log(error)
    response.status(500).send({message: 'server error'});
}