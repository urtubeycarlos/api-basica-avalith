const auth = (req, res, next) => {
    if( req.session )
        return next();
    else
        res.sendStatus(401);
}

module.exports = auth;