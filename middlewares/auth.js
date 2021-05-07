const db = require('./../db');
const auth = (request, response, next) => {
    if( request.session && request.session.user )
        return next();
    else
        response.sendStatus(401);
}

module.exports = auth;