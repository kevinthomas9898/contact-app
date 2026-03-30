const { constants } = require("../constants");

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    const isDev = process.env.NODE_ENV === 'development';
    const response = (title) => ({
        title,
        message: err.message,
        ...(isDev && { stackTrace: err.stack })
    });
    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            res.json(response("Validation Failed"));
            break;
        case constants.UNAUTHORIZED:
            res.json(response("Unauthorized"));
            break;
        case constants.FORBIDDEN:
            res.json(response("Forbidden"));
            break;
        case constants.NOT_FOUND:
            res.json(response("Not Found"));
            break;
        case constants.INTERNAL_SERVER_ERROR:
            res.json(response("Server Error"));
            break;
        default:
            console.log("No Error, All good !");
            break;
    }
};

module.exports = { errorHandler }